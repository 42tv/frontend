import React from 'react';

interface PostIconProps {
  size?: number;
  className?: string;
  strokeWidth?: number;
}

export const PostIcon: React.FC<PostIconProps> = ({
  size = 24,
  className = '',
  strokeWidth = 2,
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      role="img"
      className={className}
    >
      <rect
        x="2.5"
        y="4.5"
        width="19"
        height="15"
        rx="2.5"
        stroke="currentColor"
        strokeWidth={strokeWidth}
      />
      <path
        d="M3.5 6.5L12 12.25L20.5 6.5"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default PostIcon;
