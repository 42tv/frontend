import React from 'react';
import CardItem from './CardItem';
import { CardData } from '@/app/_types';

interface CardGridProps {
  items: CardData[];
  isEditing: boolean;
  selectedItems: number[];
  onItemSelect: (id: number) => void;
}

const CardGrid: React.FC<CardGridProps> = ({ items, isEditing, selectedItems, onItemSelect }) => (
  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
    {items.map((item, index) => (
      <CardItem
        key={index}
        broadcasterId={item.user_id}
        imageUrl={item.profile_img}
        title={item.nickname}
        isLive={item.is_live}
        isEditing={isEditing}
        isSelected={selectedItems.includes(item.id)}
        onClick={() => onItemSelect(item.id)}
      />
    ))}
  </div>
);

export default CardGrid;
