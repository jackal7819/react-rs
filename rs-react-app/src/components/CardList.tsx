import { Character } from '../types';
import { Card } from './Card';

interface CardListProps {
  data: Character[];
}

export const CardList = ({ data }: CardListProps) => {
  if (!data.length) {
    return <p className="p-4 text-gray-500">No results</p>;
  }

  return (
    <div className="grid gap-4 py-4">
      {data.map((item) => (
        <Card
          key={item.id}
          name={item.name}
          description={`${item.status} - ${item.species}`}
          image={item.image}
        />
      ))}
    </div>
  );
};
