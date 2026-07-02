'use client';
import React from 'react';
import Menu from './menu';

const LeftContainer: React.FC = () => (
  <div
    className="sticky top-[65px] w-[200px] h-[calc(100vh-65px)] flex-shrink-0 border-r border-[#2c2c38] z-10 overflow-y-auto"
    style={{ background: '#17171c' }}
  >
    <Menu />
  </div>
);
export default LeftContainer;
