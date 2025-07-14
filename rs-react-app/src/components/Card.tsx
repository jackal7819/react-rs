import React from 'react';

interface CardProps {
  name: string;
  description: string;
  image: string;
}

export class Card extends React.Component<CardProps> {
  render() {
    return (
      <div className="flex items-center gap-4 p-4 bg-transparent border rounded-lg shadow">
        <img
          src={this.props.image}
          alt={this.props.name}
          className="w-16 h-16 rounded-full"
        />
        <div>
          <h2 className="text-lg font-bold">{this.props.name}</h2>
          <p className="text-sm">{this.props.description}</p>
        </div>
      </div>
    );
  }
}
