'use client';
import React, { useState, useEffect } from 'react';
import CardGrid from './CardGrid';
import { FiEdit } from 'react-icons/fi';
import { deleteMultiBookmakrs, requestBookmarkList } from '../../_apis/user';
import { CardData } from '@/app/_types';
import ToggleSwitch from './ToggleSwitch';
import { getApiErrorMessage } from '@/app/_lib/api';
import { openModal } from '@/app/_components/utils/overlay/overlayHelpers';
import ErrorMessage from '@/app/_components/modals/error_component';
import ContentSkeleton from './ContentSkeleton';

export default function BookmarkContent() {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [cards, setCards] = useState<CardData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showLiveOnly, setShowLiveOnly] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await requestBookmarkList();
      setCards(response.data.lists);
    } catch (e) {
      setError(`북마크 데이터를 불러오는 데 실패했습니다: ${getApiErrorMessage(e)}`);
      setCards([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredBookmarkedCards = showLiveOnly
    ? cards.filter(item => item.is_live)
    : cards;
  const liveCount = cards.filter(item => item.is_live).length;

  const handleItemSelect = (id: number) => {
    setSelectedItems(prevSelected =>
      prevSelected.includes(id)
        ? prevSelected.filter(itemId => itemId !== id)
        : [...prevSelected, id]
    );
  };

  const handleEditToggle = async () => {
    if (isEditing) {
      if (selectedItems.length === 0) {
        setIsEditing(false);
        return;
      }

      try {
        await deleteMultiBookmakrs(selectedItems);
        setCards(cards.filter(item => !selectedItems.includes(item.id)));
      }
      catch (e) {
        const message = getApiErrorMessage(e);
        openModal(<ErrorMessage message={message} />, { closeButtonSize: "w-[16px] h-[16px]" });
      }
      setIsEditing(false);
      setSelectedItems([]);
    } else {
      setSelectedItems([]);
      setIsEditing(true);
    }
  };

  if (isLoading) {
    return <ContentSkeleton showEditAction />;
  }

  return (
    <div className="rounded-2xl border border-[#2c2c38] bg-[#17171c] p-4">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-[#20202a] px-3 py-1.5 text-[12px] font-semibold text-[#e2e2ea]">
            전체 {cards.length}
          </span>
          <span className="rounded-full border border-accent/30 bg-accent/10 px-3 py-1.5 text-[12px] font-semibold text-accent">
            LIVE {liveCount}
          </span>
          <button
            className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-semibold transition-colors ${
              isEditing ? 'bg-accent text-white hover:bg-accent-light' : 'bg-[#20202a] text-[#a0a0b0] hover:text-[#e2e2ea]'
            }`}
            onClick={handleEditToggle}
          >
            <FiEdit />
            <span>{isEditing ? (selectedItems.length > 0 ? `${selectedItems.length}개 삭제` : '편집 종료') : '편집'}</span>
          </button>
        </div>
        <ToggleSwitch checked={showLiveOnly} onChange={setShowLiveOnly} />
      </div>

      {error ? (
        <StatusMessage title="북마크를 불러오지 못했습니다" description={error} />
      ) : filteredBookmarkedCards.length === 0 ? (
        <StatusMessage
          title={showLiveOnly ? '방송 중인 북마크가 없습니다' : '북마크한 BJ가 없습니다'}
          description={showLiveOnly ? '전체 보기로 전환하면 오프라인 BJ까지 확인할 수 있습니다.' : '마음에 드는 방송자를 북마크하면 이곳에 표시됩니다.'}
        />
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

function StatusMessage({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex min-h-[260px] flex-col items-center justify-center rounded-xl border border-dashed border-[#3e3e50] bg-[#141419] px-6 text-center">
      <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-accent/10 text-accent">★</div>
      <h3 className="text-[15px] font-bold text-[#e2e2ea]">{title}</h3>
      <p className="mt-2 max-w-sm text-[13px] leading-6 text-[#72728a]">{description}</p>
    </div>
  );
}
