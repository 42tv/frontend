'use client';
// components/Toolbar.tsx
import React from 'react';
import Menu from './menu';


const LeftContainer: React.FC = () => {
  return (
    // fixed 제거, w-[200px] h-full 유지, border-r 추가
    <div className="sticky left-0 w-[200px] h-full flex-shrink-0 bg-background dark:bg-background-dark z-10"> {/* sticky left-0 추가로 횡스크롤 시에도 고정 */}
        <Menu />
        {/* <BookMark /> */}
        {/* <Recommend /> */}
    </div>
  );
};

export default LeftContainer;