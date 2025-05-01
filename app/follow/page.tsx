'use client';
import React, { useState } from 'react'; // useEffect 제거 (자식 컴포넌트에서 처리)
import TabNav from '../_components/follow/TabNav';
import BookmarkContent from '../_components/follow/BookmarkContent'; // BookmarkContent 임포트
import FanContent from '../_components/follow/FanContent'; // FanContent 임포트

const TABS = ['FAN', 'BOOKMARK'];

export default function FollowPage() {
  const [activeTab, setActiveTab] = useState(TABS[0]);

  return (
    <div className="p-6 dark:bg-contentbg min-h-screen">
      <h1 className="text-2xl font-bold mb-4">PICK</h1>
      <TabNav tabs={TABS} active={activeTab} onChange={setActiveTab} />

      {/* 선택된 탭에 따라 다른 컴포넌트 렌더링 */}
      {activeTab === 'BOOKMARK' ? (
        <BookmarkContent />
      ) : (
        <FanContent />
      )}
    </div>
  );
}
