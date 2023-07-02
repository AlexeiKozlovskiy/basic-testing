import {
  getBankAccount,
  InsufficientFundsError,
  TransferFailedError,
  SynchronizationFailedError,
} from '.';

describe('BankAccount', () => {
  const initialBalance = 1000;

  test('should create account with initial balance', () => {
    const account = getBankAccount(initialBalance);

    expect(account.getBalance()).toBe(initialBalance);
  });

  test('should throw InsufficientFundsError error when withdrawing more than balance', () => {
    const account = getBankAccount(initialBalance);
    const withdrawingAmount = 2000;

    expect(() => account.withdraw(withdrawingAmount)).toThrowError(
      InsufficientFundsError,
    );
  });

  test('should throw error when transferring more than balance', () => {
    const account = getBankAccount(initialBalance);
    const accountTo = getBankAccount(initialBalance);
    const transferringAmount = 2000;

    expect(() => account.transfer(transferringAmount, accountTo)).toThrowError(
      InsufficientFundsError,
    );
  });

  test('should throw error when transferring to the same account', () => {
    const transferringAmount = 500;
    const account = getBankAccount(initialBalance);

    expect(() => account.transfer(transferringAmount, account)).toThrowError(
      TransferFailedError,
    );
  });

  test('should deposit money', () => {
    const account = getBankAccount(initialBalance);
    const depositAmount = 500;
    account.deposit(depositAmount);

    expect(account.getBalance()).toBe(initialBalance + depositAmount);
  });

  test('should withdraw money', () => {
    const account = getBankAccount(initialBalance);
    const withdrawingAmount = 500;
    account.withdraw(withdrawingAmount);

    expect(account.getBalance()).toBe(initialBalance - withdrawingAmount);
  });

  test('should transfer money', () => {
    const initialBalanceTo = 2000;
    const transferringAmount = 500;
    const account = getBankAccount(initialBalance);
    const accountTo = getBankAccount(initialBalanceTo);
    account.transfer(transferringAmount, accountTo);

    expect(account.getBalance()).toBe(initialBalance - transferringAmount);
    expect(accountTo.getBalance()).toBe(initialBalanceTo + transferringAmount);
  });

  test('fetchBalance should return number in case if request did not failed', async () => {
    const account = getBankAccount(initialBalance);

    account.fetchBalance = jest.fn().mockResolvedValue(50);

    const balance = await account.fetchBalance();
    expect(typeof balance).toBe('number');
  });

  test('should set new balance if fetchBalance returned number', async () => {
    const account = getBankAccount(initialBalance);
    const newBalance = 200;

    account.fetchBalance = jest.fn().mockResolvedValue(newBalance);
    await account.synchronizeBalance();

    expect(account.getBalance()).not.toBe(initialBalance);
  });

  test('should throw SynchronizationFailedError if fetchBalance returned null', async () => {
    const account = getBankAccount(initialBalance);

    account.fetchBalance = jest.fn().mockResolvedValue(null);

    await expect(account.synchronizeBalance()).rejects.toThrowError(
      SynchronizationFailedError,
    );
  });
});
