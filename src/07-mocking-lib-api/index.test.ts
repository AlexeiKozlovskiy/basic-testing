import axios from 'axios';
import { throttledGetDataFromApi } from './index';

describe('throttledGetDataFromAp`i', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.useRealTimers();
  });

  test('should create instance with provided base url', async () => {
    const mock = jest.spyOn(axios, 'create');

    const relativePath = '/posts';
    await throttledGetDataFromApi(relativePath);

    expect(mock).toHaveBeenCalledWith({
      baseURL: 'https://jsonplaceholder.typicode.com',
    });
  });

  test('should perform request to correct provided url', async () => {
    // Write your test here
  });
});

test('should return response data', async () => {
  const result = await throttledGetDataFromApi('/posts');

  expect(Array.isArray(result)).toBe(true);
  expect(result.length).toBeGreaterThan(0);
});
