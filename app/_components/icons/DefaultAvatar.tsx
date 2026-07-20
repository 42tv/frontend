'use client';

import React, { useId } from 'react';

interface DefaultAvatarProps {
  size?: number;
  className?: string;
}

export const DefaultAvatar: React.FC<DefaultAvatarProps> = ({
  size = 40,
  className = '',
}) => {
  const clipId = useId();

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 40 40"
      width={size}
      height={size}
      className={`rounded-full ${className}`}
      role="img"
      aria-label="기본 프로필 이미지"
    >
      <clipPath id={clipId}>
        <circle cx="20" cy="20" r="20" />
      </clipPath>
      <circle cx="20" cy="20" r="20" fill="var(--avatar-bg)" />
      <g clipPath={`url(#${clipId})`} fill="var(--avatar-fg)">
        <circle cx="20" cy="15.2" r="6.6" />
        <path d="M20 24.6c-7.4 0-12.4 4.5-12.4 10.1V42h24.8v-7.3c0-5.6-5-10.1-12.4-10.1z" />
      </g>
    </svg>
  );
};

export default DefaultAvatar;
