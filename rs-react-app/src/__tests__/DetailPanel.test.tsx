import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, test, vi, beforeEach, afterEach } from 'vitest';
import { DetailPanel } from '../components/DetailPanel';
import { fetchCharacterById } from '../api';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const mockDelete = vi.fn();
const mockSetSearchParams = vi.fn();

vi.mock('react-router', () => ({
  useSearchParams: () => [
    {
      get: (key: string) => (key === 'details' ? '1' : null),
      delete: mockDelete,
    },
    mockSetSearchParams,
  ],
}));

vi.mock('../api');
const mockedFetch = vi.mocked(fetchCharacterById);

const renderWithClient = (ui: React.ReactNode) => {
  const queryClient = new QueryClient();
  return render(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>
  );
};

describe('DetailPanel', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('shows loader while fetching', async () => {
    mockedFetch.mockReturnValue(new Promise(() => {}));

    renderWithClient(<DetailPanel />);

    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  test('closes detail panel when close button clicked', async () => {
    mockedFetch.mockResolvedValue({
      id: 1,
      name: 'Rick',
      status: 'Alive',
      species: 'Human',
      gender: 'Male',
      image: '',
      origin: { name: 'Earth' },
      location: { name: 'Mars' },
      episode: [],
    });

    renderWithClient(<DetailPanel />);

    await screen.findByRole('heading', { name: /Rick/i });

    const btn = screen.getByRole('button', { name: /Close details/i });
    await userEvent.click(btn);

    expect(mockDelete).toHaveBeenCalledWith('details');
    expect(mockSetSearchParams).toHaveBeenCalledWith(expect.any(Object));
  });
});
