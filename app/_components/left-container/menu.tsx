'use client';
import { useEffect, useState } from 'react';
import AuthNavItem from './AuthNavItem';
import NavItem from './nav-item';
import { BsBroadcastPin } from 'react-icons/bs';
import { RiHeartLine } from 'react-icons/ri';
import Link from 'next/link';
import { useUserStore } from '@/app/_lib/stores';
import { requestBookmarkList } from '@/app/_apis/user';
import { CardData } from '@/app/_types';

/** 좌측 메뉴에 노출할 팔로우 BJ 최대 개수 (스크롤 방지) */
const MAX_FOLLOW_BJS = 5;

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
  const [followBJs, setFollowBJs] = useState<CardData[]>([]);

  useEffect(() => {
    if (!nickname) {
      setFollowBJs([]);
      return;
    }
    async function fetchFollowBJs(): Promise<void> {
      try {
        const bookmarkRes = await requestBookmarkList();
        const bookmarks: CardData[] = bookmarkRes.data.lists ?? [];
        setFollowBJs(bookmarks.slice(0, MAX_FOLLOW_BJS));
      } catch {
        setFollowBJs([]);
      }
    }
    fetchFollowBJs();
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

      {/* 팔로우 BJ - 라이브 우선 + 후원액 순 상위 5명만 고정 노출 */}
      {nickname && followBJs.length > 0 && (
        <>
          <div className="my-2 border-t border-[#2c2c38]" />
          <p className="px-4 py-1.5 text-[11px] font-semibold text-[#72728a] uppercase tracking-wider">팔로우 BJ</p>
          {followBJs.map((bj) => (
            <Link
              key={bj.user_id}
              href={`/live/${bj.user_id}`}
              className="flex items-center gap-2.5 px-4 py-1.5 text-[13px] text-[#72728a] hover:bg-[#20202a] hover:text-[#e2e2ea] transition-colors"
            >
              <div className="relative flex-shrink-0">
                <div
                  className={`w-6 h-6 rounded-full ${bj.is_live ? 'border-2 border-accent' : 'border border-[#3e3e50] opacity-60'}`}
                  style={{ background: getAvatarColor(bj.nickname) }}
                />
                {bj.is_live && (
                  <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-accent border-[1.5px] border-[#17171c]" />
                )}
              </div>
              <span className={`flex-1 truncate ${bj.is_live ? '' : 'opacity-60'}`}>{bj.nickname}</span>
              {bj.is_live && (
                <span className="text-[10px] text-accent font-bold flex-shrink-0">LIVE</span>
              )}
            </Link>
          ))}
          <div className="h-4" />
        </>
      )}
    </div>
  );
}
