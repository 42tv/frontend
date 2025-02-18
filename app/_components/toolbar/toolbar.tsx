'use client';
// components/Toolbar.tsx
import React from 'react';
import ToggleTheme from './buttons/ToggleTheme';
import Login from './buttons/loginButton';
import Search from './search/serach';
import Logo from '../logo/logo';


const Toolbar: React.FC = () => {
  
  return (
    <div>
      <div className="fixed flex w-full h-[65px] items-center justify-between px-4 shadow-md z-50 border-white border-b-[1px]">
        <Logo />
        <div className="font-bold text-lg sm:text-xl"></div>
        <div className="flex h-full gap-4 text-center items-center">
          <Search />
          <ToggleTheme />
          <Login />
        </div>
        <div className="sm:hidden">
          <button className="">☰</button>
        </div>
      </div>
    </div>
    
  );
};

export default Toolbar;