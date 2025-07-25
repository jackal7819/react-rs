import { cleanup, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { MemoryRouter } from 'react-router';
import { fetchCharacterById } from '../api';
import { DetailPanel } from '../components/DetailPanel';

vi.mock('../api');
const mockedFetch = vi.mocked(fetchCharacterById);

describe('DetailPanel', () => {
  afterEach(cleanup);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders character details when "details" query param is present in URL', async () => {
    mockedFetch.mockResolvedValue({
      id: 1,
      name: 'Rick Sanchez',
      status: 'Alive',
      species: 'Human',
      gender: 'Male',
      image: 'https://rickandmortyapi.com/api/character/avatar/1.jpeg',
      origin: { name: 'Earth' },
      location: { name: 'Earth' },
      episode: ['S01E01'],
    });

    render(
      <MemoryRouter initialEntries={['/?details=1']}>
        <DetailPanel />
      </MemoryRouter>
    );

    await waitFor(() =>
      expect(
        screen.getByRole('heading', { name: /Rick Sanchez/ })
      ).toBeInTheDocument()
    );

    expect(screen.getByText(/Status:/)).toBeInTheDocument();
    expect(screen.getByText(/Alive/)).toBeInTheDocument();
    expect(screen.getByText(/Species:/)).toBeInTheDocument();
    expect(screen.getByText(/Human/)).toBeInTheDocument();
    expect(screen.getByText(/Gender:/)).toBeInTheDocument();
    expect(screen.getByText(/Male/)).toBeInTheDocument();

    // For duplicate "Earth", use getAllByText and assert count
    const earthItems = screen.getAllByText('Earth');
    expect(earthItems).toHaveLength(2);

    expect(screen.getByText(/Episodes:/)).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();

    const img = screen.getByRole('img', { name: /Rick Sanchez/ });
    expect(img).toHaveAttribute(
      'src',
      'https://rickandmortyapi.com/api/character/avatar/1.jpeg'
    );
  });

  test('displays an error message on failed fetch', async () => {
    mockedFetch.mockRejectedValue(new Error('Failed to fetch character'));

    render(
      <MemoryRouter initialEntries={['/?details=1']}>
        <DetailPanel />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Failed to fetch character/)).toBeInTheDocument();
    });
  });
});
