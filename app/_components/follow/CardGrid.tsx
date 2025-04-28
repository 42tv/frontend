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
  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4"> {/* 반응형 컬럼 수 조정 */}
    {items.map((item) => (
      <CardItem
        key={item.id}
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
