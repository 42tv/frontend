'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import { MdStorefront } from 'react-icons/md';

const ChargeButton: React.FC = () => {
  const router = useRouter();
  const { theme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const handleClick = () => {
    router.push('/charge');
  };

  return (
    <div>
      {theme !== 'dark' ? (
        <div
          onClick={handleClick}
          className="w-[36px] h-[36px] flex items-center justify-center cursor-pointer rounded-full hover:bg-bg-hover transition-colors"
        >
          <MdStorefront className="w-full h-full p-1 text-icon-primary animate-bounce-slow" />
        </div>
      ) : (
        <div
          onClick={handleClick}
          className="w-[36px] h-[36px] flex items-center justify-center cursor-pointer rounded-full hover:bg-bg-hover-dark transition-colors"
        >
          <MdStorefront className="w-full h-full p-1 text-icon-primary-dark animate-bounce-slow" />
        </div>
      )}
      <style jsx>{`
        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-3px);
          }
        }
        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }
        .animate-bounce-slow:hover {
          animation: none;
          transform: scale(1.1) rotate(3deg);
          transition: transform 0.3s ease;
        }
        .animate-bounce-slow:active {
          transform: scale(0.95);
        }
      `}</style>
    </div>
  );
};

export default ChargeButton;
