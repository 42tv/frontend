'use client';
// components/Toolbar.tsx
import React from 'react';
import Menu from './menu';


const LeftContainer: React.FC = () => {
  return (
    // fixed 제거, w-[200px] h-full 유지, border-r 추가
    <div className="sticky left-0 w-[200px] h-[calc(100vh-65px)] flex-shrink-0 bg-background dark:bg-background-dark border-r border-border-primary z-10"> {/* 전체 화면에서 toolbar 높이(65px)를 단 높이 */}
        <Menu />
        {/* <BookMark /> */}
        {/* <Recommend /> */}
    </div>
  );
};

export default LeftContainer;