'use client';
import React, { useState } from 'react';
import TabNav from '../_components/follow/TabNav';
import ToggleSwitch from '../_components/follow/ToggleSwitch';
import CardGrid from '../_components/follow/CardGrid';
import { FiEdit } from 'react-icons/fi';

const TABS = ['FAN','BOOKMARK'];

const dummyData = [
  { id: 1, title: '열혈팬 11위', subtitle: '리나∙', isLive: false },
  { id: 2, title: '열혈팬 100위', subtitle: '퀸도희♡', isLive: false },
  { id: 3, title: '열혈팬 117위', subtitle: '다락♡', isLive: false },
  { id: 4, title: '열혈팬 120위', subtitle: '홈초콜ↄ', isLive: true },
  // ... 더미 아이템 추가
];

export default function HomePage() {
  const [activeTab, setActiveTab] = useState(TABS[0]);
  const [showLiveOnly, setShowLiveOnly] = useState(false);

  const filtered = showLiveOnly
    ? dummyData.filter(item => item.isLive)
    : dummyData;

  return (
    <div className="p-6 dark:bg-contentbg min-h-screen">
      <h1 className="text-2xl font-bold mb-4">PICK</h1>
      <TabNav tabs={TABS} active={activeTab} onChange={setActiveTab} />
      {/* 통계 & 토글 */}
      <div className="flex items-center justify-between mt-4">
        <div className='flex flex-row space-x-2'>
            <span>전체 {dummyData.length} | 숨김 86 | </span>
            <button className='flex flex-row items-center space-x-2'><FiEdit/><span>편집</span></button>
            
        </div>
        <ToggleSwitch checked={showLiveOnly} onChange={setShowLiveOnly} />
      </div>

      {/* 카드 그리드 */}
      <CardGrid items={filtered} />
    </div>
  );
}
