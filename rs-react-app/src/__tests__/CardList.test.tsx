import { describe, it, expect, vi, afterEach } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { CardList } from '../components/CardList';
import { Character } from '../types';

vi.mock('../components/Card', () => ({
  Card: ({ name, description }: { name: string; description: string }) => (
    <div>
      <h2>{name}</h2>
      <p>{description}</p>
    </div>
  ),
}));

afterEach(cleanup);

describe('CardList Component', () => {
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

  it('correctly displays item names and descriptions', () => {
    render(<CardList data={mockData} />);
    expect(screen.getAllByText('Rick Sanchez')).toHaveLength(1);
    expect(screen.getAllByText('Morty Smith')).toHaveLength(1);
    expect(screen.getAllByText('Alive - Human')).toHaveLength(2);
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
    expect(screen.getByText('undefined - undefined')).toBeInTheDocument();
  });
});
