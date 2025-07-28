import { Character } from '../types';
import { Card } from './Card';

interface CardListProps {
  data: Character[];
  onCardClick?: (id: number) => void;
}

export const CardList = ({ data, onCardClick }: CardListProps) => {
  if (!data.length) {
    return <p className="p-4 text-gray-500">No results</p>;
  }

  return (
    <div className="grid gap-4 py-4">
      {data.map((item) => (
        <div
          key={item.id}
          onClick={(e) => {
            onCardClick?.(item.id);
            e.stopPropagation();
          }}
        >
          <Card
            id={item.id}
            name={item.name}
            description={`${item.status} - ${item.species}`}
            image={item.image}
          />
        </div>
      ))}
    </div>
  );
};
