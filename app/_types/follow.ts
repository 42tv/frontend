import { CardData } from './ui';

export interface CardGridProps {
  items: CardData[];
  isEditing: boolean;
  selectedItems: number[];
  onItemSelect: (id: number) => void;
}

export interface CardItemProps {
  imageUrl: string;
  title: string;
  isLive?: boolean;
  isEditing: boolean;
  isSelected: boolean;
  onClick: () => void;
}

export interface TabNavProps {
  tabs: string[];
  active: string;
  onChange: (tab: string) => void;
}

export interface ToggleSwitchProps {
  checked: boolean;
  onChange: (v: boolean) => void;
}
