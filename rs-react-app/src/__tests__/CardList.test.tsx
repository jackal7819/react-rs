import { describe, it, expect, vi, afterEach } from 'vitest';
import { cleanup, render, screen, fireEvent } from '@testing-library/react';
import { CardList } from '../components/CardList';
import { Character } from '../types';

vi.mock('../components/Card', () => ({
  Card: ({
    name,
    status,
    species,
    gender,
  }: {
    name: string;
    status: string;
    species: string;
    gender: string;
  }) => (
    <div>
      <h2>{name || 'Unknown'}</h2>
      <p>{status || 'Unknown'}</p>
      <p>{`${species || 'Unknown'} - ${gender || 'Unknown'}`}</p>
    </div>
  ),
}));

afterEach(cleanup);

describe('CardList Component', () => {
  afterEach(cleanup);

  const mockData: Character[] = [
    {
      id: 1,
      name: 'Rick Sanchez',
      status: 'Alive',
      species: 'Human',
      gender: 'Male',
      image: 'https://rickandmortyapi.com/api/character/avatar/1.jpeg',
    },
    {
      id: 2,
      name: 'Morty Smith',
      status: 'Alive',
      species: 'Human',
      gender: 'Male',
      image: 'https://rickandmortyapi.com/api/character/avatar/2.jpeg',
    },
  ];

  it('renders correct number of items when data is provided', () => {
    render(<CardList data={mockData} />);
    expect(screen.getAllByRole('heading', { level: 2 })).toHaveLength(2);
  });

  it('displays "no results" message when data array is empty', () => {
    render(<CardList data={[]} />);
    expect(screen.getByText('No results')).toBeInTheDocument();
  });

  it('correctly displays item names, status, species and gender', () => {
    render(<CardList data={mockData} />);
    expect(screen.getByText('Rick Sanchez')).toBeInTheDocument();
    expect(screen.getByText('Morty Smith')).toBeInTheDocument();
    expect(screen.getAllByText('Alive')).toHaveLength(2);
    expect(screen.getAllByText('Human - Male')).toHaveLength(2);
  });

  it('handles missing or undefined data gracefully', () => {
    const brokenData = [
      {
        id: 3,
        name: undefined,
        status: undefined,
        species: undefined,
        gender: undefined,
        image: undefined,
      },
    ] as unknown as Character[];

    render(<CardList data={brokenData} />);
    expect(screen.getAllByText('Unknown')[0]).toBeInTheDocument();
    expect(screen.getByText('Unknown - Unknown')).toBeInTheDocument();
  });

  it('calls onCardClick handler with correct id when a card is clicked', () => {
    const onCardClick = vi.fn();
    render(<CardList data={mockData} onCardClick={onCardClick} />);
    const cardDivs = screen
      .getAllByRole('heading', { level: 2 })
      .map((heading) => heading.parentElement?.parentElement);
    if (cardDivs[0]) {
      fireEvent.click(cardDivs[0]);
      expect(onCardClick).toHaveBeenCalledWith(mockData[0].id);
    }
  });
});
