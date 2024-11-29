'use client';
// components/Toolbar.tsx
import React from 'react';
import ToggleTheme from './buttons/ToggleTheme';
import Login from './buttons/loginButton';
import Search from './search/serach';


const Toolbar: React.FC = () => {
  return (
    <div className="fixed top-0 left-0 w-full h-[60px] text-white flex items-center justify-between px-4 shadow-md z-50 border-white border-b-[1px]">
      <div className="font-bold text-lg sm:text-xl">로고</div>
      <div className="flex h-full gap-4 text-center items-center">
        <Search />
        <ToggleTheme />
        <Login />
      </div>
      <div className="sm:hidden">
        <button className="text-white">☰</button>
      </div>
    </div>
  );
};

export default Toolbar;