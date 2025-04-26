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
  const [isEditing, setIsEditing] = useState(false); // 편집 모드 상태 추가
  const [selectedItems, setSelectedItems] = useState<number[]>([]); // 선택된 아이템 ID 배열 상태 추가

  const filtered = showLiveOnly
    ? dummyData.filter(item => item.isLive)
    : dummyData;

  // 아이템 선택/해제 핸들러
  const handleItemSelect = (id: number) => {
    setSelectedItems(prevSelected =>
      prevSelected.includes(id)
        ? prevSelected.filter(itemId => itemId !== id) // 이미 선택된 경우 제거
        : [...prevSelected, id] // 선택되지 않은 경우 추가
    );
  };

  const handleEditToggle = () => {
    if (isEditing) {
      // 편집 완료 시 로직
      console.log('Selected items:', selectedItems);
      // TODO: 백엔드 API 호출 로직 추가
      // 예시:
      // try {
      //   await fetch('/api/follow/edit', {
      //     method: 'POST',
      //     headers: { 'Content-Type': 'application/json' },
      //     body: JSON.stringify({ selectedIds: selectedItems, tab: activeTab }),
      //   });
      //   // 성공 처리
      // } catch (error) {
      //   // 에러 처리
      // }
      setIsEditing(false);
    } else {
      // 편집 시작 시 로직
      setSelectedItems([]); // 편집 시작 시 선택 상태 초기화
      setIsEditing(true);
    }
  };

  return (
    <div className="p-6 dark:bg-contentbg min-h-screen">
      <h1 className="text-2xl font-bold mb-4">PICK</h1>
      <TabNav tabs={TABS} active={activeTab} onChange={setActiveTab} />
      {/* 통계 & 토글 */}
      <div className="flex items-center justify-between mt-4">
        <div className='flex flex-row space-x-2 items-center'> {/* items-center 추가 */}
            <span>전체 {dummyData.length} | 숨김 86 | </span>
            {/* 편집 버튼 클릭 핸들러 및 텍스트 변경 */}
            <button
              className='flex flex-row items-center space-x-1 dark:text-textBase-dark dark:hover:text-white' // 아이콘과 텍스트 간격 조정 및 스타일 추가
              onClick={handleEditToggle}
            >
              <FiEdit/>
              <span>{isEditing ? '완료' : '편집'}</span>
            </button>
        </div>
        <ToggleSwitch checked={showLiveOnly} onChange={setShowLiveOnly} />
      </div>

      {/* 카드 그리드 - isEditing, selectedItems, onItemSelect props 전달 */}
      <CardGrid
        items={filtered}
        isEditing={isEditing}
        selectedItems={selectedItems}
        onItemSelect={handleItemSelect}
      />
    </div>
  );
}
