'use client';
import { useEffect, useState } from 'react';
import LiveStreamCard from '@/app/live/components/LiveStreamCard';
import LiveStreamGridSkeleton, { liveGridClassName } from '@/app/live/components/LiveStreamGridSkeleton';
import { getLiveList } from '@/app/_apis/live';
import { Live } from '@/app/_types';

export default function LivePage() {
  const [lives, setLives] = useState<Live[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLiveList() {
      try { const res = await getLiveList(); setLives(res.data); }
      catch (e) { console.error(e); }
      finally { setLoading(false); }
    }
    fetchLiveList();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-[#0d0d10]">
      <div className="p-5">
        {loading ? (
          <LiveStreamGridSkeleton />
        ) : lives.length > 0 ? (
          <div className={liveGridClassName}>
            {lives.map((live, i) => <LiveStreamCard key={i} live={live} index={i} />)}
          </div>
        ) : (
          <p className="text-center text-[#72728a] mt-20">현재 진행 중인 라이브가 없습니다</p>
        )}
      </div>
    </div>
  );
}
