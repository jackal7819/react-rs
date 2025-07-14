import React from 'react';
import { Character } from '../types';
import { Card } from './Card';

interface CardListProps {
  data: Character[];
}

export class CardList extends React.Component<CardListProps> {
  render() {
    if (!this.props.data.length) {
      return <p className="p-4 text-gray-500">Нет результатов</p>;
    }

    return (
      <div className="grid gap-4 py-4">
        {this.props.data.map((item) => (
          <Card
            key={item.id}
            name={item.name}
            description={`${item.status} - ${item.species}`}
            image={item.image}
          />
        ))}
      </div>
    );
  }
}
