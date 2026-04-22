'use client';
import { useEffect, useState } from 'react';
import LiveStreamCard from '@/app/live/components/LiveStreamCard';
import { getLiveList } from '@/app/_apis/live';
import { Live } from '@/app/_types';
import { useUserStore } from '@/app/_lib/stores';

function getAvatarColor(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return `hsl(${Math.abs(hash) % 360}, 40%, 35%)`;
}

function SectionHeader({ title, count }: { title: string; count?: number }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <h2 className="text-[15px] font-bold text-[#e2e2ea]">{title}</h2>
      {count !== undefined && (
        <span className="bg-[#ff3535] text-white text-[10px] font-bold px-2 py-0.5 rounded-sm">LIVE {count}</span>
      )}
      <span className="ml-auto text-[12px] text-[#72728a] cursor-pointer hover:text-[#e2e2ea] transition-colors">더보기 →</span>
    </div>
  );
}

function FollowingStrip({ lives }: { lives: Live[] }) {
  const fanLives = lives.filter((l) => l.broadcaster.broadcastSetting.is_fan);
  if (fanLives.length === 0) return null;

  return (
    <div className="mb-6">
      <p className="text-[12px] text-[#72728a] font-medium mb-2.5">팔로우 중인 BJ</p>
      <div className="flex gap-3.5 overflow-x-auto pb-1">
        {fanLives.map((l) => (
          <div key={l.broadcaster.user_id} className="flex flex-col items-center gap-1.5 cursor-pointer flex-shrink-0">
            <div className="relative">
              <div
                className="w-[52px] h-[52px] rounded-full border-[2.5px] border-[#ff3535]"
                style={{ background: getAvatarColor(l.broadcaster.nickname) }}
              />
              <div className="absolute bottom-0.5 right-0.5 w-2.5 h-2.5 rounded-full bg-[#ff3535] border-2 border-[#0d0d10]" />
            </div>
            <span className="text-[11px] text-[#72728a] max-w-[52px] truncate">{l.broadcaster.nickname}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Home() {
  const [lives, setLives] = useState<Live[]>([]);
  const [loading, setLoading] = useState(true);
  const nickname = useUserStore((s) => s.nickname);

  useEffect(() => {
    async function fetchLives() {
      try { const res = await getLiveList(); setLives(res.data); }
      catch (e) { console.error(e); }
      finally { setLoading(false); }
    }
    fetchLives();
  }, []);

  const popular = lives.slice().sort((a, b) => b.viewerCount - a.viewerCount).slice(0, 8);
  const recommended = lives.filter((l) => !l.broadcaster.broadcastSetting.is_adult).slice(0, 4);
  const game = lives.filter((l) => !l.broadcaster.broadcastSetting.is_adult).slice(0, 4);
  const adult = lives.filter((l) => l.broadcaster.broadcastSetting.is_adult);

  return (
    <div className="min-h-screen bg-[#0d0d10] px-5 py-5 flex flex-col gap-6">
      {loading ? (
        <div className="flex items-center justify-center h-64 text-[#72728a] text-[14px]">불러오는 중...</div>
      ) : lives.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 gap-3">
          <div className="text-3xl">📡</div>
          <div className="text-[#72728a] text-[14px]">현재 진행 중인 라이브가 없습니다</div>
        </div>
      ) : (
        <>
          {nickname && <FollowingStrip lives={lives} />}
          {popular.length > 0 && (
            <section>
              <SectionHeader title="🔴 인기 라이브" count={lives.length} />
              <div className="grid grid-cols-4 gap-3">
                {popular.map((live, i) => <LiveStreamCard key={i} live={live} index={i} />)}
              </div>
            </section>
          )}
          {recommended.length > 0 && (
            <section>
              <SectionHeader title="⭐ Fairly 추천" />
              <div className="grid grid-cols-4 gap-3">
                {recommended.map((live, i) => <LiveStreamCard key={i} live={live} index={i} />)}
              </div>
            </section>
          )}
          {game.length > 0 && (
            <section>
              <SectionHeader title="🎮 게임" />
              <div className="grid grid-cols-4 gap-3">
                {game.map((live, i) => <LiveStreamCard key={i} live={live} index={i} />)}
              </div>
            </section>
          )}
          {adult.length > 0 && (
            <section>
              <SectionHeader title="🔞 성인 방송" />
              <div className="grid grid-cols-4 gap-3">
                {adult.map((live, i) => <LiveStreamCard key={i} live={live} index={i} />)}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}
