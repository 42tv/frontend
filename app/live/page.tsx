'use client';
import { useEffect, useState } from 'react';
import LiveStreamCard from '@/app/live/components/LiveStreamCard';
import { getLiveList } from '@/app/_apis/live';
import { Live } from '@/app/_types';

type SortType = '인기순' | '최신순' | '추천순';

export default function LivePage() {
  const [lives, setLives] = useState<Live[]>([]);
  const [sort, setSort] = useState<SortType>('인기순');

  useEffect(() => {
    async function fetchLiveList() {
      try { const res = await getLiveList(); setLives(res.data); }
      catch (e) { console.error(e); }
    }
    fetchLiveList();
  }, []);

  const sorted = [...lives].sort((a, b) => {
    if (sort === '인기순') return b.viewerCount - a.viewerCount;
    if (sort === '추천순') return b.recommend_cnt - a.recommend_cnt;
    return new Date(b.start_time).getTime() - new Date(a.start_time).getTime();
  });

  return (
    <div className="flex flex-col min-h-screen bg-[#0d0d10]">
      <div className="sticky top-[65px] z-10 flex items-center h-11 bg-[#17171c] border-b border-[#2c2c38] px-5 gap-3 flex-shrink-0">
        <span className="text-[13px] text-[#72728a]">총 <b className="text-[#e2e2ea]">{lives.length}</b>개 방송 중</span>
        <div className="ml-auto flex gap-1">
          {(['인기순', '최신순', '추천순'] as SortType[]).map((s) => (
            <button key={s} onClick={() => setSort(s)}
              className={`h-[30px] px-3 rounded-md text-[13px] transition-colors ${sort === s ? 'bg-[#2a2a36] text-[#e2e2ea] border border-[#3e3e50]' : 'text-[#72728a] hover:text-[#e2e2ea]'}`}>
              {s}
            </button>
          ))}
        </div>
      </div>
      <div className="p-5">
        {sorted.length > 0 ? (
          <div className="grid grid-cols-4 gap-3">
            {sorted.map((live, i) => <LiveStreamCard key={i} live={live} index={i} />)}
          </div>
        ) : (
          <p className="text-center text-[#72728a] mt-20">현재 진행 중인 라이브가 없습니다</p>
        )}
      </div>
    </div>
  );
}
