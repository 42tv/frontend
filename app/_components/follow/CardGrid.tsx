import React from 'react';
import CardItem from './CardItem';

interface CardData {
  id: number;
  title: string;
  subtitle: string;
  isLive?: boolean;
}

interface CardGridProps {
  items: CardData[];
}

const CardGrid: React.FC<CardGridProps> = ({ items }) => (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
    {items.map(item => (
      <CardItem
        key={item.id}
        imageUrl="https://via.placeholder.com/300x200"
        title={item.title}
        subtitle={item.subtitle}
        isLive={item.isLive}
      />
    ))}
  </div>
);

export default CardGrid;
