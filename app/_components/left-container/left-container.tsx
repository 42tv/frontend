'use client';
// components/Toolbar.tsx
import React from 'react';
import Menu from './menu';


const LeftContainer: React.FC = () => {
  return (
    // fixed 제거, w-[200px] h-full 유지, border-r 추가
    <div className="w-[200px] h-full border-r border-contentBg flex-shrink-0 bg-background dark:bg-background-dark"> {/* flex-shrink-0 추가 */}
        <Menu />
        {/* <BookMark /> */}
        {/* <Recommend /> */}
    </div>
  );
};

export default LeftContainer;