import React from 'react';

interface StarCoinIconProps {
  size?: number;
  className?: string;
  primaryColor?: string;
  secondaryColor?: string;
  strokeColor?: string;
}

export const StarCoinIcon: React.FC<StarCoinIconProps> = ({
  size = 24,
  className = '',
  primaryColor = '#FFD83B',
  secondaryColor = '#FFC107',
  strokeColor = '#E09E00',
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      width={size}
      height={size}
      className={className}
    >
      <defs>
        <linearGradient id={`flatGold-${size}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={primaryColor} />
          <stop offset="100%" stopColor={secondaryColor} />
        </linearGradient>
      </defs>
      {/* coin base */}
      <circle
        cx="256"
        cy="256"
        r="200"
        fill={`url(#flatGold-${size})`}
        stroke={strokeColor}
        strokeWidth="12"
      />
      {/* inner ring */}
      <circle
        cx="256"
        cy="256"
        r="165"
        fill={primaryColor}
        stroke={strokeColor}
        strokeWidth="8"
      />
      {/* star symbol */}
      <path
        d="M256 146
           l35.5 72.1 79.6 11.6
           -57.6 56.1 13.6 79.2
           -71.1 -37.4 -71.1 37.4
           13.6 -79.2 -57.6 -56.1
           79.6 -11.6z"
        fill="#FFEB3B"
        stroke={strokeColor}
        strokeWidth="10"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default StarCoinIcon;
