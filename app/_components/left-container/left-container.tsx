'use client';
// components/Toolbar.tsx
import React from 'react';
import Menu from './menu';


const LeftContainer: React.FC = () => {
  return (
    <div className="fixed w-[200px] h-full top-[60px] bg-gray-700 z-0">
        <Menu />
        {/* <BookMark /> */}
        {/* <Recommend /> */}
    </div>
  );
};

export default LeftContainer;