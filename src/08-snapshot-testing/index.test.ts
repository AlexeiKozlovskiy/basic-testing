import { generateLinkedList } from './index';

describe('generateLinkedList', () => {
  test('should generate linked list from values 1', () => {
    const elements = [1, 2, 3];
    const result = generateLinkedList(elements);

    const expectedLinkedList = {
      value: 1,
      next: {
        value: 2,
        next: {
          value: 3,
          next: {
            value: null,
            next: null,
          },
        },
      },
    };
    expect(result).toStrictEqual(expectedLinkedList);
  });

  // Check match by comparison with snapshot
  test('should generate linked list from values 2', () => {
    const elements = [4, 5, 6];
    const result = generateLinkedList(elements);

    expect(result).toMatchInlineSnapshot(`
      {
        "next": {
          "next": {
            "next": {
              "next": null,
              "value": null,
            },
            "value": 6,
          },
          "value": 5,
        },
        "value": 4,
      }
    `);
  });
});
