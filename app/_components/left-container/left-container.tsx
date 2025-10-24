'use client';
// components/Toolbar.tsx
import React from 'react';
import Menu from './menu';


const LeftContainer: React.FC = () => {
  return (
    // fixed 포지션으로 스크롤에 영향받지 않고 고정, min-h로 전체 높이 확보하여 border가 끊기지 않도록 처리
    <div className="fixed left-0 top-[65px] w-[200px] min-h-[calc(100vh-65px)] flex-shrink-0 bg-background dark:bg-background-dark border-r border-border-primary z-10">
        <Menu />
        {/* <BookMark /> */}
        {/* <Recommend /> */}
    </div>
  );
};

export default LeftContainer;