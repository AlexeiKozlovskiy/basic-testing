import { readFileAsynchronously, doStuffByTimeout, doStuffByInterval } from '.';
import { join } from 'path';
import { existsSync, promises } from 'fs';

jest.mock('path', () => ({
  join: jest.fn(),
}));

jest.mock('fs', () => ({
  existsSync: jest.fn(),
  readFile: jest.fn(),
  promises: {
    readFile: jest.fn(),
  },
}));

describe('doStuffByTimeout', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should set timeout with provided callback and timeout', () => {
    const callback = jest.fn();
    const timeout = 200;

    doStuffByTimeout(callback, timeout);
    expect(callback).not.toHaveBeenCalled();

    jest.advanceTimersByTime(timeout);
    expect(callback).toHaveBeenCalled();
  });

  test('should call callback only after timeout', () => {
    const callback = jest.fn();
    const timeout = 500;

    doStuffByTimeout(callback, timeout);
    expect(callback).not.toHaveBeenCalled();

    jest.advanceTimersByTime(250);
    expect(callback).not.toHaveBeenCalled();

    jest.advanceTimersByTime(timeout - 250);
    expect(callback).toHaveBeenCalled();
  });
});

describe('doStuffByInterval', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should set interval with provided callback and timeout', () => {
    const callback = jest.fn();
    const interval = 200;

    doStuffByInterval(callback, interval);
    expect(callback).not.toHaveBeenCalled();

    jest.advanceTimersByTime(interval);
    expect(callback).toHaveBeenCalled();

    jest.advanceTimersByTime(interval);
    expect(callback).toHaveBeenCalledTimes(2);
  });

  test('should call callback multiple times after multiple intervals', () => {
    const callback = jest.fn();
    const interval = 200;

    doStuffByInterval(callback, interval);
    expect(callback).not.toHaveBeenCalled();

    jest.advanceTimersByTime(interval * 3);
    expect(callback).toHaveBeenCalledTimes(3);
  });
});

describe('readFileAsynchronously', () => {
  test('should call join with pathToFile', async () => {
    const mockJoin = join as jest.Mock;
    const pathToFile = 'path/file.txt';

    await readFileAsynchronously(pathToFile);
    expect(mockJoin).toHaveBeenCalledWith(__dirname, pathToFile);
  });

  test('should return null if file does not exist', async () => {
    const filePath = 'path/file.txt';
    const result = await readFileAsynchronously(filePath);

    expect(result).toBeNull();
  });

  test('should return file content if file exists', async () => {
    const fileContent = 'content';
    const filePath = 'path/file.txt';

    (existsSync as jest.Mock).mockResolvedValueOnce(true);
    (promises.readFile as jest.Mock).mockResolvedValueOnce(
      Buffer.from(fileContent),
    );

    const result = await readFileAsynchronously(filePath);
    expect(result).toEqual(fileContent);
  });
});
