'use client';
// components/Toolbar.tsx
import React from 'react';
import ToggleTheme from './buttons/theme-toggle';


const Toolbar: React.FC = () => {
  return (
    <div className="fixed top-0 left-0 w-full h-14 text-white flex items-center justify-between px-4 shadow-md z-50 border-white border-b-[1px]">
      <div className="font-bold text-lg sm:text-xl">로고</div>
      <div className="hidden sm:flex gap-4">
        <button className="text-red-400 hover:text-gray-300">Home</button>
        <button className="text-red-400 hover:text-gray-300">About</button>
        <button className="text-red-400 hover:text-gray-300">Contact</button>
        <ToggleTheme />
      </div>
      <div className="sm:hidden">
        <button className="text-white">☰</button>
      </div>
    </div>
  );
};

export default Toolbar;