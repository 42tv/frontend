'use client';
import React, { useState, useEffect } from 'react';
import CardGrid from './CardGrid';
import { FiEdit } from 'react-icons/fi';
import { deleteMultiBookmakrs, requestBookmarkList } from '../../_apis/user';
import { CardData } from '../utils/interfaces';
import ToggleSwitch from './ToggleSwitch'; // ToggleSwitch 임포트 추가
import { getApiErrorMessage } from '@/app/_apis/interfaces';
import errorModalStore from '../utils/store/errorModalStore';
import ErrorMessage from '../modals/error_component';

export default function BookmarkContent() {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [cards, setCards] = useState<CardData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showLiveOnly, setShowLiveOnly] = useState(false); // showLiveOnly 상태 추가
  const { openError } = errorModalStore();

  // API 호출 함수
  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await requestBookmarkList();
      setCards(response.lists);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      setError(`북마크 데이터를 불러오는 데 실패했습니다: ${e.message}`);
      setCards([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 필터링 로직
  const filteredBookmarkedCards = showLiveOnly
    ? cards.filter(item => item.is_live)
    : cards;

  // 아이템 선택/해제 핸들러
  const handleItemSelect = (id: number) => {
    setSelectedItems(prevSelected =>
      prevSelected.includes(id)
        ? prevSelected.filter(itemId => itemId !== id)
        : [...prevSelected, id]
    );
  };

  // 편집 모드 토글 핸들러
  const handleEditToggle = async () => {
    if (isEditing) {
      console.log('Selected bookmark items:', selectedItems);
      try {
        await deleteMultiBookmakrs(selectedItems);
        const removedItems = cards.filter(item => !selectedItems.includes(item.id));
        setCards(removedItems);
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      catch (e) {
        const message = getApiErrorMessage(e);
        openError(<ErrorMessage message={message} />);
      }
      // TODO: 선택된 아이템 삭제 API 호출 등
      setIsEditing(false);
      setSelectedItems([]);
    } else {
      setSelectedItems([]);
      setIsEditing(true);
    }
  };

  return (
    <div>
      {/* 통계 & 편집 버튼 & 토글 스위치 */}
      <div className="flex items-center justify-between mt-4">
        <div className='flex flex-row space-x-2 items-center'>
          {!isLoading && <span>전체 {cards.length}</span>} {/* 숨김 개수는 예시 */}
          <button
            className='flex flex-row items-center space-x-1 dark:text-textBase-dark dark:hover:text-text-primary-dark'
            onClick={handleEditToggle}
            disabled={isLoading}
          >
            <FiEdit />
            <span>{isEditing ? '삭제' : '편집'}</span>
          </button>
        </div>
        {/* ToggleSwitch 추가 */}
        <div className="flex items-center">
          <ToggleSwitch checked={showLiveOnly} onChange={setShowLiveOnly} />
        </div>
      </div>

      {/* 로딩 및 에러 처리 */}
      {isLoading ? (
        <div className="text-center mt-8">북마크 로딩 중...</div>
      ) : error ? (
        <div className="text-center mt-8 text-error dark:text-error-dark">{error}</div>
      ) : (
        <CardGrid
          items={filteredBookmarkedCards}
          isEditing={isEditing}
          selectedItems={selectedItems}
          onItemSelect={handleItemSelect}
        />
      )}
    </div>
  );
}
