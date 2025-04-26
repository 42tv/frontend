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
  isEditing: boolean; // isEditing prop 추가
  selectedItems: number[]; // 선택된 아이템 ID 배열 prop 추가
  onItemSelect: (id: number) => void; // 아이템 선택 핸들러 prop 추가
}

const CardGrid: React.FC<CardGridProps> = ({ items, isEditing, selectedItems, onItemSelect }) => ( // props 받기
  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
    {items.map(item => (
      <CardItem
        key={item.id}
        imageUrl="https://d398h708xjw6pv.cloudfront.net/thumbnails/N5EFdGm0JpSu.jpg" // 실제 이미지 URL로 교체 필요
        title={item.title}
        subtitle={item.subtitle}
        isLive={item.isLive}
        isEditing={isEditing} // isEditing prop 전달
        isSelected={selectedItems.includes(item.id)} // 선택 여부 전달
        onClick={() => onItemSelect(item.id)} // 클릭 핸들러 전달
      />
    ))}
  </div>
);

export default CardGrid;
