'use client';
import { useEffect, useState } from 'react';
import AuthNavItem from './AuthNavItem';
import NavItem from './nav-item';
import { BsBroadcastPin } from 'react-icons/bs';
import { RiHeartLine } from 'react-icons/ri';
import Link from 'next/link';
import { useUserStore } from '@/app/_lib/stores';
import { getLiveList } from '@/app/_apis/live';
import { Live } from '@/app/_types';

const CATEGORIES = [
  { icon: '🎮', label: '게임',      href: '/live?cat=게임' },
  { icon: '🍖', label: '먹방',      href: '/live?cat=먹방' },
  { icon: '💬', label: '토크/일상',  href: '/live?cat=토크' },
  { icon: '🔞', label: '성인',      href: '/live?cat=성인', adult: true },
  { icon: '🎵', label: '음악',      href: '/live?cat=음악' },
  { icon: '⚽', label: '스포츠',    href: '/live?cat=스포츠' },
];

function getAvatarColor(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return `hsl(${Math.abs(hash) % 360}, 40%, 35%)`;
}

export default function Menu() {
  const nickname = useUserStore((s) => s.nickname);
  const [fanLives, setFanLives] = useState<Live[]>([]);

  useEffect(() => {
    if (!nickname) return;
    getLiveList()
      .then((res) => {
        const fans = (res.data as Live[]).filter(
          (l) => l.broadcaster.broadcastSetting.is_fan
        );
        setFanLives(fans);
      })
      .catch(() => {});
  }, [nickname]);

  return (
    <div className="flex flex-col py-2">
      <NavItem icon={BsBroadcastPin} label="전체 방송" href="/live" />
      <AuthNavItem icon={RiHeartLine} label="팔로잉" href="/follow" />
      <div className="my-2 border-t border-[#2c2c38]" />
      <p className="px-4 py-1.5 text-[11px] font-semibold text-[#72728a] uppercase tracking-wider">카테고리</p>
      {CATEGORIES.map((cat) => (
        <Link key={cat.label} href={cat.href}
          className={`flex items-center gap-2 px-4 py-[7px] text-[13px] transition-colors hover:bg-[#20202a] ${cat.adult ? 'text-orange-400 hover:text-orange-300' : 'text-[#72728a] hover:text-[#e2e2ea]'}`}>
          <span>{cat.icon}</span>
          <span>{cat.label}</span>
        </Link>
      ))}

      {/* 팔로우 BJ - 로그인 + 라이브 중인 경우만 표시 */}
      {nickname && fanLives.length > 0 && (
        <>
          <div className="my-2 border-t border-[#2c2c38]" />
          <p className="px-4 py-1.5 text-[11px] font-semibold text-[#72728a] uppercase tracking-wider">팔로우 BJ</p>
          {fanLives.map((l) => (
            <Link
              key={l.broadcaster.user_id}
              href={`/live/${l.broadcaster.user_id}`}
              className="flex items-center gap-2.5 px-4 py-1.5 text-[13px] text-[#72728a] hover:bg-[#20202a] hover:text-[#e2e2ea] transition-colors"
            >
              <div className="relative flex-shrink-0">
                <div
                  className="w-6 h-6 rounded-full border-2 border-accent"
                  style={{ background: getAvatarColor(l.broadcaster.nickname) }}
                />
                <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-accent border-[1.5px] border-[#17171c]" />
              </div>
              <span className="flex-1 truncate">{l.broadcaster.nickname}</span>
              <span className="text-[10px] text-accent font-bold flex-shrink-0">LIVE</span>
            </Link>
          ))}
          <div className="h-4" />
        </>
      )}
    </div>
  );
}
