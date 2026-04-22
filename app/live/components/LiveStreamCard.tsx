'use client';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { requestLobyPlay } from '@/app/_apis/live';
import { usePlayStore } from '@/app/_lib';
import { openModal } from '@/app/_components/utils/overlay/overlayHelpers';
import ErrorMessage from '@/app/_components/modals/error_component';
import { getApiErrorMessage } from '@/app/_lib/api';
import { useRouter } from 'next/navigation';
import { Live } from '@/app/_types';
import { formatElapsedTime } from '@/app/_lib/utils';

const DEFAULT_PLACEHOLDER = '/placeholder.png';
interface LiveStreamCardProps { live: Live; index: number; }

function formatCount(count: number): string {
  if (count >= 10000) return (count / 10000).toFixed(1) + '만';
  if (count >= 1000) return (count / 1000).toFixed(1) + '천';
  return count.toString();
}

function getAvatarColor(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash) % 360;
  return `hsl(${hue}, 40%, 38%)`;
}

export default function LiveStreamCard({ live, index }: LiveStreamCardProps) {
  const [elapsedTime, setElapsedTime] = useState('');
  const { setPlayData } = usePlayStore();
  const router = useRouter();

  async function handlePlay() {
    try {
      const res = await requestLobyPlay(live.broadcaster.user_id);
      setPlayData(res.data);
      router.push(`/live/${live.broadcaster.user_id}`);
    } catch (e) {
      openModal(<ErrorMessage message={getApiErrorMessage(e)} />, { closeButtonSize: 'w-[16px] h-[16px]' });
    }
  }

  useEffect(() => { setElapsedTime(formatElapsedTime(live.start_time)); }, [live.start_time]);

  const avatarColor = getAvatarColor(live.broadcaster.nickname);

  return (
    <div
      className="group flex flex-col rounded-md overflow-hidden cursor-pointer bg-[#20202a] border border-[#2c2c38] hover:border-[#3e3e50] hover:shadow-lg transition-all duration-150"
      onClick={handlePlay}
    >
      {/* 썸네일 */}
      <div className="relative w-full aspect-video overflow-hidden">
        {live.broadcaster.broadcastSetting.is_adult ? (
          <div className="w-full h-full bg-[#1a1520] flex flex-col items-center justify-center gap-1">
            <span className="text-[22px]">🔞</span>
            <span className="text-[11px] text-[#72728a]">성인 인증 필요</span>
          </div>
        ) : (
          <Image
            src={live.thumbnail || DEFAULT_PLACEHOLDER}
            alt={live.broadcaster.broadcastSetting.title || '라이브'}
            fill
            className="object-cover group-hover:scale-[1.02] transition-transform duration-200"
            priority={index < 8}
            sizes="(max-width:1280px) 25vw, 20vw"
          />
        )}
        <span className="absolute top-1.5 left-1.5 bg-[#ff3535] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-sm tracking-wide">LIVE</span>
        <span className="absolute bottom-1.5 right-1.5 bg-black/70 text-[#ddd] text-[11px] px-1.5 py-0.5 rounded-sm backdrop-blur-sm">👁 {formatCount(live.viewerCount)}</span>
      </div>

      {/* 카드 정보 */}
      <div className="px-2.5 py-2">
        <p className="text-[13px] font-medium text-[#e2e2ea] truncate mb-1.5">
          {live.broadcaster.broadcastSetting.title}
        </p>
        <div className="flex items-center gap-1.5">
          {/* BJ 미니 아바타 */}
          <div
            className="w-4 h-4 rounded-full flex-shrink-0"
            style={{ background: avatarColor }}
          />
          <span className="text-[12px] text-[#72728a] truncate flex-1">{live.broadcaster.nickname}</span>
          <span className="text-[10px] text-[#72728a] bg-[#2a2a36] px-1.5 py-0.5 rounded-sm flex-shrink-0">
            {live.broadcaster.broadcastSetting.is_adult ? '🔞 성인' : elapsedTime}
          </span>
        </div>
      </div>
    </div>
  );
}
