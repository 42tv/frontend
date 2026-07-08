'use client';
import { useEffect, useState } from 'react';
import LiveStreamCard from '@/app/live/components/LiveStreamCard';
import LiveStreamGridSkeleton, { liveGridClassName } from '@/app/live/components/LiveStreamGridSkeleton';
import { getLiveList } from '@/app/_apis/live';
import { Live } from '@/app/_types';

function SectionHeader({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <h2 className="text-[15px] font-bold text-[#e2e2ea]">{title}</h2>
    </div>
  );
}

function SectionHeaderSkeleton() {
  return (
    <div className="mb-3 flex items-center gap-2" aria-hidden="true">
      <div className="h-5 w-20 animate-pulse rounded bg-[#20202a]" />
    </div>
  );
}

export default function Home() {
  const [lives, setLives] = useState<Live[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLives() {
      try { const res = await getLiveList(); setLives(res.data); }
      catch (e) { console.error(e); }
      finally { setLoading(false); }
    }
    fetchLives();
  }, []);

  return (
    <div className="min-h-screen bg-[#0d0d10] px-5 py-5 flex flex-col gap-6">
      {loading ? (
        <section>
          <SectionHeaderSkeleton />
          <LiveStreamGridSkeleton />
        </section>
      ) : lives.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 gap-3">
          <div className="text-3xl">📡</div>
          <div className="text-[#72728a] text-[14px]">현재 진행 중인 라이브가 없습니다</div>
        </div>
      ) : (
        <section>
          <SectionHeader title="라이브 목록" />
          <div className={liveGridClassName}>
            {lives.map((live, i) => <LiveStreamCard key={live.broadcaster.user_id} live={live} index={i} />)}
          </div>
        </section>
      )}
    </div>
  );
}
