'use client';
import { useEffect, useState } from 'react';
import LiveStreamCard from '@/app/live/components/LiveStreamCard';
import { getLiveList } from '@/app/_apis/live';
import { Live } from '@/app/_types';

export default function LivePage() {
  const [lives, setLives] = useState<Live[]>([]);

  useEffect(() => {
    async function fetchLiveList() {
      try { const res = await getLiveList(); setLives(res.data); }
      catch (e) { console.error(e); }
    }
    fetchLiveList();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-[#0d0d10]">
      <div className="p-5">
        {lives.length > 0 ? (
          <div className="grid grid-cols-4 gap-3">
            {lives.map((live, i) => <LiveStreamCard key={i} live={live} index={i} />)}
          </div>
        ) : (
          <p className="text-center text-[#72728a] mt-20">현재 진행 중인 라이브가 없습니다</p>
        )}
      </div>
    </div>
  );
}
