'use client';
import { Suspense, useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import LiveStreamCard from '@/app/live/components/LiveStreamCard';
import LiveStreamGridSkeleton, { liveGridClassName } from '@/app/live/components/LiveStreamGridSkeleton';
import { getLiveList } from '@/app/_apis/live';
import { Live } from '@/app/_types';

/** 닉네임 / 아이디 / 방송 제목 중 검색어가 포함되는지 검사 (대소문자 무시) */
function matchesQuery(live: Live, query: string): boolean {
  const q = query.toLowerCase();
  return (
    live.broadcaster.nickname.toLowerCase().includes(q) ||
    live.broadcaster.user_id.toLowerCase().includes(q) ||
    live.broadcaster.broadcastSetting.title.toLowerCase().includes(q)
  );
}

function LivePageContent() {
  const [lives, setLives] = useState<Live[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get('q')?.trim() ?? '';

  useEffect(() => {
    async function fetchLiveList() {
      try { const res = await getLiveList(); setLives(res.data); }
      catch (e) { console.error(e); }
      finally { setLoading(false); }
    }
    fetchLiveList();
  }, []);

  const filteredLives = useMemo<Live[]>(
    () => (query ? lives.filter((live) => matchesQuery(live, query)) : lives),
    [lives, query],
  );

  return (
    <div className="flex flex-col min-h-screen bg-[#0d0d10]">
      <div className="p-5">
        {query && !loading && (
          <div className="flex items-center gap-2.5 mb-4">
            <h2 className="text-[15px] font-bold text-[#e2e2ea]">
              <span className="text-accent">&lsquo;{query}&rsquo;</span> 검색 결과
            </h2>
            <span className="text-[12px] text-[#72728a]">{filteredLives.length}개</span>
            <button
              type="button"
              onClick={() => router.push('/live')}
              className="ml-auto text-[12px] text-[#72728a] hover:text-[#e2e2ea] transition-colors"
            >
              전체 목록 보기
            </button>
          </div>
        )}
        {loading ? (
          <LiveStreamGridSkeleton />
        ) : filteredLives.length > 0 ? (
          <div className={liveGridClassName}>
            {filteredLives.map((live, i) => <LiveStreamCard key={live.broadcaster.user_id} live={live} index={i} />)}
          </div>
        ) : (
          <p className="text-center text-[#72728a] mt-20">
            {query ? `'${query}'에 대한 검색 결과가 없습니다` : '현재 진행 중인 라이브가 없습니다'}
          </p>
        )}
      </div>
    </div>
  );
}

export default function LivePage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col min-h-screen bg-[#0d0d10]">
          <div className="p-5"><LiveStreamGridSkeleton /></div>
        </div>
      }
    >
      <LivePageContent />
    </Suspense>
  );
}
