import React from 'react';
import CardItem from './CardItem';
import { CardData } from '@/app/_components/utils/interfaces';

interface CardGridProps {
  items: CardData[];
  isEditing: boolean;
  selectedItems: number[];
  onItemSelect: (id: number) => void;
}

const CardGrid: React.FC<CardGridProps> = ({ items, isEditing, selectedItems, onItemSelect }) => (
  <div className="grid grid-cols-[repeat(auto-fill,250px)] gap-4 mt-4">
    {items.map((item, index) => (
      <CardItem
        key={index}
        imageUrl={item.profile_img} // item에서 imageUrl 전달
        title={item.user_id}
        isLive={item.is_live}
        isEditing={isEditing}
        isSelected={selectedItems.includes(item.id)}
        onClick={() => onItemSelect(item.id)}
      />
    ))}
  </div>
);

export default CardGrid;
