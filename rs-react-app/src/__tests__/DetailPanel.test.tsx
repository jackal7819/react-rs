import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, expect, test, vi, beforeEach, afterEach } from 'vitest';
import { DetailPanel } from '../components/DetailPanel';
import { fetchCharacterById } from '../api';

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

describe('DetailPanel', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('shows loader while fetching', async () => {
    mockedFetch.mockReturnValue(new Promise(() => {}));

    render(<DetailPanel />);

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

    render(<DetailPanel />);

    await waitFor(() =>
      expect(screen.getByRole('heading', { name: /Rick/i })).toBeInTheDocument()
    );

    const btn = screen.getByRole('button', { name: /Close details/i });
    fireEvent.click(btn);

    expect(mockDelete).toHaveBeenCalledWith('details');
    expect(mockSetSearchParams).toHaveBeenCalledWith(expect.any(Object));
  });
});
