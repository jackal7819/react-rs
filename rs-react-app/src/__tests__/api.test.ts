import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { fetchCharacters } from '../api';

describe('fetchCharacters', () => {
  beforeEach(() => {
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should fetch characters successfully', async () => {
    const mockData = {
      info: { pages: 1 },
      results: [
        { id: 1, name: 'Rick Sanchez' },
        { id: 2, name: 'Morty Smith' },
      ],
    };

    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: () => Promise.resolve(mockData),
    } as unknown as Response);

    const result = await fetchCharacters('Rick');
    expect(result.results).toEqual(mockData.results);
    expect(fetch).toHaveBeenCalledWith(
      'https://rickandmortyapi.com/api/character/?name=Rick&page=1'
    );
  });

  it('should throw 404 error', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: false,
      status: 404,
      json: () => Promise.resolve({}),
    } as unknown as Response);

    await expect(fetchCharacters('invalid')).rejects.toThrow(
      'No characters found. Please try another name.'
    );
  });

  it('should throw 500 error', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: () => Promise.resolve({}),
    } as unknown as Response);

    await expect(fetchCharacters('test')).rejects.toThrow(
      'Server error. Please try again later.'
    );
  });

  it('should throw generic error', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: false,
      status: 400,
      json: () => Promise.resolve({}),
    } as unknown as Response);

    await expect(fetchCharacters('test')).rejects.toThrow(
      'Something went wrong. Please try again.'
    );
  });
});
