import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { fetchCharacters, fetchCharacterById } from '../api';

describe('fetchCharacters', () => {
  beforeEach(() => {
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should fetch characters successfully with default page', async () => {
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

  it('should fetch characters successfully with specified page', async () => {
    const mockData = {
      info: { pages: 3 },
      results: [
        { id: 3, name: 'Summer Smith' },
        { id: 4, name: 'Beth Smith' },
      ],
    };

    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: () => Promise.resolve(mockData),
    } as unknown as Response);

    const result = await fetchCharacters('Smith', 2);
    expect(result.results).toEqual(mockData.results);
    expect(fetch).toHaveBeenCalledWith(
      'https://rickandmortyapi.com/api/character/?name=Smith&page=2'
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

describe('fetchCharacterById', () => {
  beforeEach(() => {
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should fetch character by id successfully', async () => {
    const mockCharacter = { id: 1, name: 'Rick Sanchez' };

    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: () => Promise.resolve(mockCharacter),
    } as unknown as Response);

    const result = await fetchCharacterById(1);
    expect(result).toEqual(mockCharacter);
    expect(fetch).toHaveBeenCalledWith(
      'https://rickandmortyapi.com/api/character/1'
    );
  });

  it('should throw 404 error when character not found', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: false,
      status: 404,
      json: () => Promise.resolve({}),
    } as unknown as Response);

    await expect(fetchCharacterById(999)).rejects.toThrow(
      'Character not found.'
    );
  });

  it('should throw generic error when fetch fails', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: () => Promise.resolve({}),
    } as unknown as Response);

    await expect(fetchCharacterById(1)).rejects.toThrow(
      'Failed to fetch character.'
    );
  });
});
