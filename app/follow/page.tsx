'use client';
import React, { useState, useEffect } from 'react'; // useEffect 임포트
import TabNav from '../_components/follow/TabNav';
import ToggleSwitch from '../_components/follow/ToggleSwitch';
import CardGrid from '../_components/follow/CardGrid';
import { FiEdit } from 'react-icons/fi';
import { requestBookmarkList } from '../_apis/user';
import { CardData } from '../_components/utils/interfaces';

const TABS = ['FAN', 'BOOKMARK'];

// CardData 인터페이스 정의 (CardGrid와 일치시키거나 공유)


export default function FollowPage() {
  const [activeTab, setActiveTab] = useState(TABS[0]);
  const [showLiveOnly, setShowLiveOnly] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [cardData, setCardData] = useState<CardData[]>([]); // API 데이터 상태
  const [isLoading, setIsLoading] = useState(true); // 로딩 상태 추가
  const [error, setError] = useState<string | null>(null); // 에러 상태 추가

  // API 호출 함수
  const fetchData = async (tab: string) => {
    setIsLoading(true);
    setError(null); // 이전 에러 초기화
    try {
      if (tab == "BOOKMARK") {
        const response = await requestBookmarkList();
        const multipledLives = Array.from({length: 20}).flatMap(() => response.lists);
        setCardData(multipledLives); // API 응답 데이터 설정
        console.log(response);
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      console.error("Failed to fetch data:", e);
      setError(`데이터를 불러오는 데 실패했습니다: ${e.message}`);
      setCardData([]); // 에러 발생 시 데이터 초기화
    } finally {
      setIsLoading(false);
    }
  };

  // activeTab이 변경될 때 데이터 다시 불러오기
  useEffect(() => {
    fetchData(activeTab);
  }, [activeTab]);

  // 필터링 로직 (cardData 사용)
  const filteredData = showLiveOnly
    ? cardData.filter(item => item.is_live)
    : cardData;

  // 아이템 선택/해제 핸들러
  const handleItemSelect = (id: number) => {
    setSelectedItems(prevSelected =>
      prevSelected.includes(id)
        ? prevSelected.filter(itemId => itemId !== id) // 이미 선택된 경우 제거
        : [...prevSelected, id] // 선택되지 않은 경우 추가
    );
  };

  const handleEditToggle = async () => { // async 추가
    if (isEditing) {
      console.log('Selected items:', selectedItems);
      setIsEditing(false);
      setSelectedItems([]); // 완료 후 선택 해제
    } else {
      setSelectedItems([]);
      setIsEditing(true);
    }
  };

  return (
    <div className="p-6 dark:bg-contentbg min-h-screen">
      <h1 className="text-2xl font-bold mb-4">PICK</h1>
      <TabNav tabs={TABS} active={activeTab} onChange={setActiveTab} />
      {/* 통계 & 토글 */}
      <div className="flex items-center justify-between mt-4">
        <div className='flex flex-row space-x-2 items-center'>
            {/* 로딩 상태 아닐 때만 전체 개수 표시 */}
            {!isLoading && <span>전체 {cardData.length} | 숨김 86 | </span>}
            {/* 편집 버튼 */}
            <button
              className='flex flex-row items-center space-x-1 dark:text-textBase-dark dark:hover:text-white'
              onClick={handleEditToggle}
              disabled={isLoading} // 로딩 중 비활성화
            >
              <FiEdit/>
              <span>{isEditing ? '완료' : '편집'}</span>
            </button>
        </div>
        <ToggleSwitch checked={showLiveOnly} onChange={setShowLiveOnly} />
      </div>

      {/* 로딩 및 에러 처리 */}
      {isLoading ? (
        <div className="text-center mt-8">로딩 중...</div>
      ) : error ? (
        <div className="text-center mt-8 text-red-500">{error}</div>
      ) : (
        /* 카드 그리드 - filteredData 전달 */
        <CardGrid
          items={filteredData}
          isEditing={isEditing}
          selectedItems={selectedItems}
          onItemSelect={handleItemSelect}
        />
      )}
    </div>
  );
}
