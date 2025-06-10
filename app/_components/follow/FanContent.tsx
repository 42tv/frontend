'use client';
import React, { useState, useEffect } from 'react';
import CardGrid from './CardGrid';
// import { requestFanList } from '../../_apis/user'; // 팬 목록 API 호출 함수 (필요시 구현)
import { CardData } from '../utils/interfaces';
import ToggleSwitch from './ToggleSwitch'; // ToggleSwitch 임포트 추가

export default function FanContent() {
  const [fanCards, setFanCards] = useState<CardData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showLiveOnly, setShowLiveOnly] = useState(false); // showLiveOnly 상태 추가

  // API 호출 함수 (팬 데이터용)
  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // TODO: 팬 목록 API 호출 구현
      // const response = await requestFanList();
      // setFanCards(response.lists);
      setFanCards([]); // 임시로 빈 배열 설정
      console.log("Fan data fetched (implement API call)");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      console.error("Failed to fetch fan data:", e);
      setError(`팬 데이터를 불러오는 데 실패했습니다: ${e.message}`);
      setFanCards([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 필터링 로직
  const filteredFanCards = showLiveOnly
    ? fanCards.filter(item => item.is_live)
    : fanCards;

  return (
    <div>
       {/* 통계 & 토글 스위치 */}
       <div className="flex items-center justify-between mt-4">
        <div className='flex flex-row space-x-2 items-center'>
          {!isLoading && <span>전체 {fanCards.length} | </span>} {/* 팬 통계 */}
          {/* 팬 탭에서는 편집 버튼이 없을 수 있음 */}
        </div>
         {/* ToggleSwitch 추가 */}
         <div className="flex items-center">
           <ToggleSwitch checked={showLiveOnly} onChange={setShowLiveOnly} />
         </div>
      </div>

      {/* 로딩 및 에러 처리 */}
      {isLoading ? (
        <div className="text-center mt-8">팬 로딩 중...</div>
      ) : error ? (
        <div className="text-center mt-8 text-error dark:text-error-dark">{error}</div>
      ) : (
        <CardGrid
          items={filteredFanCards}
          isEditing={false} // 팬 탭에서는 편집 모드 비활성화 (필요시 수정)
          selectedItems={[]}
          onItemSelect={() => {}} // 팬 탭에서는 선택 기능 비활성화 (필요시 수정)
        />
      )}
    </div>
  );
}
