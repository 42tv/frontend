'use client';
import React, { useState, useEffect } from 'react';
import CardGrid from './CardGrid';
import { CardData } from '@/app/_types';
import ToggleSwitch from './ToggleSwitch';
import ContentSkeleton from './ContentSkeleton';

export default function FanContent() {
  const [fanCards, setFanCards] = useState<CardData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showLiveOnly, setShowLiveOnly] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setFanCards([]);
      setIsLoading(false);
    }, 150);

    return () => window.clearTimeout(timer);
  }, []);

  const filteredFanCards = showLiveOnly
    ? fanCards.filter(item => item.is_live)
    : fanCards;
  const liveCount = fanCards.filter(item => item.is_live).length;

  if (isLoading) {
    return <ContentSkeleton />;
  }

  return (
    <div className="rounded-2xl border border-[#2c2c38] bg-[#17171c] p-4">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-[#20202a] px-3 py-1.5 text-[12px] font-semibold text-[#e2e2ea]">
            전체 {fanCards.length}
          </span>
          <span className="rounded-full border border-accent/30 bg-accent/10 px-3 py-1.5 text-[12px] font-semibold text-accent">
            LIVE {liveCount}
          </span>
        </div>
        <ToggleSwitch checked={showLiveOnly} onChange={setShowLiveOnly} />
      </div>

      {filteredFanCards.length === 0 ? (
        <StatusMessage
          title={showLiveOnly ? '방송 중인 팬클럽 BJ가 없습니다' : '팬클럽 목록이 비어 있습니다'}
          description={showLiveOnly ? '전체 보기로 전환하면 오프라인 BJ까지 확인할 수 있습니다.' : '팬클럽 데이터가 연결되면 이곳에서 확인할 수 있습니다.'}
        />
      ) : (
        <CardGrid
          items={filteredFanCards}
          isEditing={false}
          selectedItems={[]}
          onItemSelect={() => {}}
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
