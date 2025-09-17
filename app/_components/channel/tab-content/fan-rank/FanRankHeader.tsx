'use client';
import React from "react";

interface FanRankHeaderProps {
  title: string;
}

export const FanRankHeader: React.FC<FanRankHeaderProps> = ({ title }) => {
  return (
    <div className="flex justify-between items-center mb-4">
      <h3 className="font-bold text-xl" style={{ color: 'var(--text-100)' }}>{title}</h3>
    </div>
  );
};
