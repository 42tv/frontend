import React from 'react';

interface CardItemProps {
  imageUrl: string;
  title: string;
  subtitle: string;
  isLive?: boolean;
}

const CardItem: React.FC<CardItemProps> = ({
  imageUrl,
  title,
  subtitle,
  isLive = false,
}) => (
  <div className="relative bg-gray-800 rounded-lg overflow-hidden">
    {isLive && (
      <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
        LIVE
      </span>
    )}
    <img src={imageUrl} alt={title} className="w-full h-36 object-cover" />
    <div className="p-2">
      <h3 className="text-white text-sm font-semibold">{title}</h3>
      <p className="text-gray-400 text-xs">{subtitle}</p>
    </div>
  </div>
);

export default CardItem;
