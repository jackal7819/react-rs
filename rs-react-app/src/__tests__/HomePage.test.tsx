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
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { App } from '../App';
import { fetchCharacters } from '../api';
import { Character } from '../types';
import { ThemeProviderWrapper } from '../components/ThemeProviderWrapper';

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

let queryClient: QueryClient;

beforeEach(() => {
  vi.clearAllMocks();
  window.localStorage.clear();
  queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
});

const customRender = (ui: React.ReactElement, options = {}) =>
  render(ui, {
    wrapper: ({ children }) => (
      <QueryClientProvider client={queryClient}>
        <ThemeProviderWrapper>{children}</ThemeProviderWrapper>
      </QueryClientProvider>
    ),
    ...options,
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

      mockFetchCharacters.mockResolvedValueOnce({
        results: mockData,
        info: {
          count: 1,
          pages: 1,
          next: null,
          prev: null,
        },
      });

      customRender(<App />);

      expect(mockFetchCharacters).toHaveBeenCalledWith('', 1);
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
      mockFetchCharacters.mockResolvedValueOnce({
        results: mockData,
        info: {
          count: 1,
          pages: 1,
          next: null,
          prev: null,
        },
      });

      customRender(<App />);

      expect(mockFetchCharacters).toHaveBeenCalledWith('Rick', 1);

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

      mockFetchCharacters.mockResolvedValueOnce({
        results: mockData,
        info: {
          count: 1,
          pages: 1,
          next: null,
          prev: null,
        },
      });

      customRender(<App />);

      expect(screen.getByText(/loading/i)).toBeInTheDocument();

      await waitFor(() => {
        expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
      });
    });

    it('handles empty search term correctly', async () => {
      const mockData: Character[] = [];
      mockFetchCharacters.mockResolvedValueOnce({
        results: mockData,
        info: {
          count: 1,
          pages: 1,
          next: null,
          prev: null,
        },
      });

      customRender(<App />);

      expect(mockFetchCharacters).toHaveBeenCalledWith('', 1);

      await waitFor(() => {
        expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
      });
    });
  });

  describe('API Integration Tests', () => {
    it('calls API with correct parameters', async () => {
      const mockData: Character[] = [];
      mockFetchCharacters.mockResolvedValueOnce({
        results: mockData,
        info: {
          count: 1,
          pages: 1,
          next: null,
          prev: null,
        },
      });

      customRender(<App />);

      expect(mockFetchCharacters).toHaveBeenCalledWith('', 1);

      const searchData: Character[] = [
        {
          id: 1,
          name: 'Rick Sanchez',
          status: 'Alive',
          species: 'Human',
        } as Character,
      ];
      mockFetchCharacters.mockResolvedValueOnce({
        results: searchData,
        info: {
          count: 1,
          pages: 1,
          next: null,
          prev: null,
        },
      });

      const input = getSearchInput();
      const user = userEvent.setup();

      await user.clear(input);
      await user.type(input, 'Rick');
      await user.keyboard('{Enter}');

      await waitFor(() => {
        expect(mockFetchCharacters).toHaveBeenCalledWith('Rick', 1);
      });

      expect(mockFetchCharacters).toHaveBeenCalledTimes(2);
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

      mockFetchCharacters.mockResolvedValueOnce({
        results: mockData,
        info: {
          count: 1,
          pages: 1,
          next: null,
          prev: null,
        },
      });

      customRender(<App />);

      await waitFor(() => {
        expect(screen.getByText(/Summer Smith/i)).toBeInTheDocument();
        expect(screen.getByText(/Beth Smith/i)).toBeInTheDocument();
      });
    });

    it('handles API error responses', async () => {
      const errorMessage = 'No characters found';
      mockFetchCharacters.mockRejectedValueOnce(new Error(errorMessage));

      customRender(<App />);

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

      mockFetchCharacters.mockResolvedValueOnce({
        results: mockData,
        info: {
          count: 1,
          pages: 1,
          next: null,
          prev: null,
        },
      });

      customRender(<App />);

      await waitFor(() => {
        expect(screen.getByText(/Birdperson/i)).toBeInTheDocument();
      });
    });

    it('manages search term state correctly', async () => {
      const mockData: Character[] = [
        {
          id: 1,
          name: 'Rick Sanchez',
          status: 'Alive',
          species: 'Human',
        } as Character,
      ];

      mockFetchCharacters.mockResolvedValue({
        results: mockData,
        info: {
          count: 1,
          pages: 1,
          next: null,
          prev: null,
        },
      });

      customRender(<App />);

      const input = getSearchInput();
      const user = userEvent.setup();

      await user.clear(input);
      await user.type(input, 'Rick');
      await user.keyboard('{Enter}');

      await waitFor(() => {
        expect(window.localStorage.getItem('searchTerm')).toBe(
          JSON.stringify('Rick')
        );
      });
    });
  });
});
