import axios from 'axios';
import { throttledGetDataFromApi } from './index';

describe('throttledGetDataFromAp`i', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();
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
    const mock = jest.spyOn(axios, 'get');
    const relativePath = '/posts/1';
    const responseData = {
      id: 1,
      userId: 1,
      title:
        'sunt aut facere repellat provident occaecati excepturi optio reprehenderit',
      body: 'quia et suscipit\nsuscipit recusandae consequuntur expedita et cum\nreprehenderit molestiae ut ut quas totam\nnostrum rerum est autem sunt rem eveniet architecto',
    };
    mock.mockResolvedValue({ data: responseData });

    const result = await throttledGetDataFromApi(relativePath);
    expect(result[0]).toEqual(responseData);
  });

  test('should return response data', async () => {
    jest.useRealTimers();
    const result = await throttledGetDataFromApi('/posts');
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
  });
});
