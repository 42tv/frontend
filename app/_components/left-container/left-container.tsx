'use client';
// components/Toolbar.tsx
import React from 'react';
import Menu from './menu';


const LeftContainer: React.FC = () => {
  return (
    <div className="fixed w-[200px] h-full top-[65px] z-0 border-r border-[#2b2b2b]">
        <Menu />
        {/* <BookMark /> */}
        {/* <Recommend /> */}
    </div>
  );
};

export default LeftContainer;