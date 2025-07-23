import {
  describe,
  it,
  expect,
  vi,
  beforeEach,
  afterEach,
  MockedFunction,
} from 'vitest';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { App } from '../App';
import { fetchCharacters } from '../api';
import { Character } from '../types';

vi.mock('../api');

const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    clear: () => {
      store = {};
    },
    removeItem: (key: string) => {
      store = Object.fromEntries(
        Object.entries(store).filter(([k]) => k !== key)
      );
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('App component', () => {
  const mockFetchCharacters = fetchCharacters as MockedFunction<
    typeof fetchCharacters
  >;

  const getSearchInput = () => {
    return (
      screen.getByPlaceholderText(/search/i) ||
      screen.getByRole('textbox') ||
      screen.getByLabelText(/search/i) ||
      screen.getByDisplayValue('') ||
      (document.querySelector('input[type="text"]') as HTMLInputElement)
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
    window.localStorage.clear();
  });

  afterEach(cleanup);

  describe('Integration Tests', () => {
    it('makes initial API call on component mount', async () => {
      const mockData: Character[] = [
        {
          id: 1,
          name: 'Rick Sanchez',
          status: 'Alive',
          species: 'Human',
        } as Character,
      ];

      mockFetchCharacters.mockResolvedValueOnce(mockData);

      render(<App />);

      expect(mockFetchCharacters).toHaveBeenCalledWith('');
      expect(screen.getByText(/loading/i)).toBeInTheDocument();

      await waitFor(() => {
        expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
      });
    });

    it('handles search term from localStorage on initial load', async () => {
      const mockData: Character[] = [
        {
          id: 1,
          name: 'Rick Sanchez',
          status: 'Alive',
          species: 'Human',
        } as Character,
      ];

      window.localStorage.setItem('searchTerm', JSON.stringify('Rick'));
      mockFetchCharacters.mockResolvedValueOnce(mockData);

      render(<App />);

      expect(mockFetchCharacters).toHaveBeenCalledWith('Rick');

      await waitFor(() => {
        expect(screen.getByText(/Rick Sanchez/i)).toBeInTheDocument();
      });
    });

    it('manages loading states during API calls', async () => {
      const mockData: Character[] = [
        {
          id: 1,
          name: 'Morty Smith',
          status: 'Alive',
          species: 'Human',
        } as Character,
      ];

      mockFetchCharacters.mockResolvedValueOnce(mockData);

      render(<App />);

      expect(screen.getByText(/loading/i)).toBeInTheDocument();

      await waitFor(() => {
        expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
      });
    });

    it('handles empty search term correctly', async () => {
      const mockData: Character[] = [];
      mockFetchCharacters.mockResolvedValueOnce(mockData);

      render(<App />);

      expect(mockFetchCharacters).toHaveBeenCalledWith('');

      await waitFor(() => {
        expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
      });
    });
  });

  describe('API Integration Tests', () => {
    it('calls API with correct parameters', async () => {
      const mockData: Character[] = [];
      mockFetchCharacters.mockResolvedValueOnce(mockData);

      render(<App />);

      expect(mockFetchCharacters).toHaveBeenCalledWith('');

      const searchData: Character[] = [
        {
          id: 1,
          name: 'Rick Sanchez',
          status: 'Alive',
          species: 'Human',
        } as Character,
      ];
      mockFetchCharacters.mockResolvedValueOnce(searchData);

      const input = getSearchInput();
      const user = userEvent.setup();

      await user.clear(input);
      await user.type(input, 'Rick');
      await user.keyboard('{Enter}');

      await waitFor(() => {
        expect(mockFetchCharacters).toHaveBeenCalledWith('Rick');
      });
    });

    it('handles successful API responses', async () => {
      const mockData: Character[] = [
        {
          id: 1,
          name: 'Summer Smith',
          status: 'Alive',
          species: 'Human',
        } as Character,
        {
          id: 2,
          name: 'Beth Smith',
          status: 'Alive',
          species: 'Human',
        } as Character,
      ];

      mockFetchCharacters.mockResolvedValueOnce(mockData);

      render(<App />);

      await waitFor(() => {
        expect(screen.getByText(/Summer Smith/i)).toBeInTheDocument();
        expect(screen.getByText(/Beth Smith/i)).toBeInTheDocument();
      });
    });

    it('handles API error responses', async () => {
      const errorMessage = 'No characters found';
      mockFetchCharacters.mockRejectedValueOnce(new Error(errorMessage));

      render(<App />);

      await waitFor(() => {
        expect(screen.getByText(errorMessage)).toBeInTheDocument();
      });

      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });
  });

  describe('State Management Tests', () => {
    it('updates component state based on API responses', async () => {
      const mockData: Character[] = [
        {
          id: 1,
          name: 'Birdperson',
          status: 'Alive',
          species: 'Bird-Person',
        } as Character,
      ];

      mockFetchCharacters.mockResolvedValueOnce(mockData);

      render(<App />);

      await waitFor(() => {
        expect(screen.getByText(/Birdperson/i)).toBeInTheDocument();
      });
    });

    it('manages search term state correctly', async () => {
      const initialData: Character[] = [];
      const searchData: Character[] = [
        {
          id: 1,
          name: 'Jerry Smith',
          status: 'Alive',
          species: 'Human',
        } as Character,
      ];

      mockFetchCharacters
        .mockResolvedValueOnce(initialData)
        .mockResolvedValueOnce(searchData);

      render(<App />);

      const input = getSearchInput();
      const user = userEvent.setup();

      await user.clear(input);
      await user.type(input, 'Jerry');
      await user.keyboard('{Enter}');

      await waitFor(() => {
        expect(mockFetchCharacters).toHaveBeenCalledWith('Jerry');
      });

      await waitFor(() => {
        expect(screen.getByText(/Jerry Smith/i)).toBeInTheDocument();
      });
    });

    it('clears error state on new search', async () => {
      mockFetchCharacters.mockRejectedValueOnce(new Error('Network error'));

      render(<App />);

      await waitFor(() => {
        expect(screen.getByText(/Network error/i)).toBeInTheDocument();
      });

      const mockData: Character[] = [
        {
          id: 1,
          name: 'Rick Sanchez',
          status: 'Alive',
          species: 'Human',
        } as Character,
      ];

      mockFetchCharacters.mockResolvedValueOnce(mockData);

      const input = getSearchInput();
      const user = userEvent.setup();

      await user.clear(input);
      await user.type(input, 'Rick');
      await user.keyboard('{Enter}');

      await waitFor(() => {
        expect(screen.queryByText(/Network error/i)).not.toBeInTheDocument();
        expect(screen.getByText(/Rick Sanchez/i)).toBeInTheDocument();
      });
    });
  });

  describe('Mocked API Calls', () => {
    it('uses vi.mock to mock API calls for success scenario', async () => {
      const mockData: Character[] = [
        {
          id: 1,
          name: 'Evil Morty',
          status: 'Alive',
          species: 'Human',
        } as Character,
      ];

      mockFetchCharacters.mockResolvedValueOnce(mockData);

      render(<App />);

      expect(mockFetchCharacters).toHaveBeenCalled();

      await waitFor(() => {
        expect(screen.getByText(/Evil Morty/i)).toBeInTheDocument();
      });
    });

    it('uses vi.mock to mock API calls for error scenario', async () => {
      const errorMessage = 'API is down';
      mockFetchCharacters.mockRejectedValueOnce(new Error(errorMessage));

      render(<App />);

      expect(mockFetchCharacters).toHaveBeenCalled();

      await waitFor(() => {
        expect(screen.getByText(errorMessage)).toBeInTheDocument();
      });
    });

    it('handles multiple API calls with different responses', async () => {
      const firstData: Character[] = [
        {
          id: 1,
          name: 'Pickle Rick',
          status: 'Alive',
          species: 'Pickle',
        } as Character,
      ];

      const secondData: Character[] = [
        {
          id: 2,
          name: 'Squanch',
          status: 'Alive',
          species: 'Squanch',
        } as Character,
      ];

      mockFetchCharacters
        .mockResolvedValueOnce(firstData)
        .mockResolvedValueOnce(secondData);

      render(<App />);

      await waitFor(() => {
        expect(screen.getByText(/Pickle Rick/i)).toBeInTheDocument();
      });

      const input = getSearchInput();
      const user = userEvent.setup();

      await user.clear(input);
      await user.type(input, 'Squanch');
      await user.keyboard('{Enter}');

      await waitFor(() => {
        expect(
          screen.getByRole('heading', { name: /Squanch/i })
        ).toBeInTheDocument();
      });

      expect(mockFetchCharacters).toHaveBeenCalledTimes(2);
    });
  });
});
