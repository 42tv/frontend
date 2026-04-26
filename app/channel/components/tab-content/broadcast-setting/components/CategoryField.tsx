import React from 'react';
import { BroadcastCategory } from '@/app/_types/user';

const CATEGORIES: { value: BroadcastCategory; label: string }[] = [
  { value: 'TALK_DAILY', label: '토크/일상' },
  { value: 'GAME', label: '게임' },
  { value: 'MUSIC', label: '음악' },
  { value: 'MUKBANG', label: '먹방' },
  { value: 'ADULT', label: '성인' },
];

interface CategoryFieldProps {
  category: BroadcastCategory;
  onCategoryChange: (value: BroadcastCategory) => void;
}

const CategoryField: React.FC<CategoryFieldProps> = ({ category, onCategoryChange }) => {
  return (
    <div className="grid grid-cols-6 my-2">
      <div className="flex col-span-1 text-center items-center">
        <label className="w-[100px] text-text-primary">카테고리</label>
      </div>
      <div className="flex col-span-5 items-center flex-wrap gap-2">
        {CATEGORIES.map((c) => (
          <button
            key={c.value}
            type="button"
            onClick={() => onCategoryChange(c.value)}
            className={`px-3 py-1 rounded-full text-sm border transition-colors ${
              category === c.value
                ? 'bg-accent text-white border-accent'
                : 'bg-bg-tertiary text-text-primary border-border-primary hover:border-accent hover:text-accent'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryField;
