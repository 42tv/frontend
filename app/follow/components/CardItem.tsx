'use client';

import React from 'react';
import { FaCheck } from 'react-icons/fa';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface CardItemProps {
  broadcasterId: string;
  imageUrl: string;
  title: string;
  isLive?: boolean;
  isEditing: boolean;
  isSelected: boolean;
  onClick: () => void;
}

const CardItem: React.FC<CardItemProps> = ({
  broadcasterId,
  imageUrl,
  title,
  isLive = false,
  isEditing,
  isSelected,
  onClick,
}) => {
  const router = useRouter();

  const handleClick = () => {
    if (isEditing) {
      onClick();
    } else {
      router.push(`/live/${broadcasterId}`);
    }
  };

  return (
    <div
      className="group relative flex cursor-pointer flex-col overflow-hidden rounded-xl border border-[#2c2c38] bg-[#20202a] transition-all duration-150 hover:-translate-y-0.5 hover:border-[#3e3e50] hover:shadow-lg"
      onClick={handleClick}
    >
      {isEditing && (
        <div className={`absolute inset-0 z-20 flex items-center justify-center bg-black/55 transition-opacity duration-200 ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
          <div className={`flex h-10 w-10 items-center justify-center rounded-full border transition-colors ${
            isSelected ? 'border-accent bg-accent text-white' : 'border-white/30 bg-white/10 text-white/60'
          }`}>
            <FaCheck className="text-base" />
          </div>
        </div>
      )}

      <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#17171c]">
        <Image
          src={imageUrl || '/icons/anonymouse1.svg'}
          alt={title}
          fill
          className="object-cover transition-transform duration-200 group-hover:scale-[1.03]"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/10" />
        {!isEditing && (
          <span className={`absolute left-2 top-2 rounded-sm px-2 py-1 text-[10px] font-bold tracking-wide ${
            isLive ? 'bg-accent text-white' : 'bg-black/60 text-white/70'
          }`}>
            {isLive ? 'LIVE' : 'OFF'}
          </span>
        )}
      </div>

      <div className="flex items-center gap-3 px-3 py-3">
        <div className={`h-2.5 w-2.5 rounded-full ${isLive ? 'bg-accent shadow-[0_0_10px_rgba(59,130,246,0.7)]' : 'bg-[#4b5563]'}`} />
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-[14px] font-semibold text-[#e2e2ea]">{title}</h3>
          <p className="truncate text-[11px] text-[#72728a]">@{broadcasterId}</p>
        </div>
        <span className="rounded-full border border-[#3e3e50] px-2 py-1 text-[10px] font-medium text-[#a0a0b0]">
          보기
        </span>
      </div>
    </div>
  );
};

export default CardItem;
