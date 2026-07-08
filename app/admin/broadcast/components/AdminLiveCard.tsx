'use client';
import { FiUser } from 'react-icons/fi';
import StatusBadge from '../../components-shared/ui/StatusBadge';
import type { AdminLiveStream, BroadcastCategory } from '@/app/_types/admin-console';

const DEFAULT_PLACEHOLDER = '/placeholder.png';

const categoryLabels: Record<BroadcastCategory, string> = {
  GAME: '게임',
  MUKBANG: '먹방',
  TALK_DAILY: '토크/일상',
  ADULT: '성인',
  MUSIC: '음악',
};

const formatDuration = (startTime: string): string => {
  const minutes = Math.floor((Date.now() - new Date(startTime).getTime()) / 60000);
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h > 0 ? `${h}시간 ${m}분` : `${m}분`;
};

interface AdminLiveCardProps {
  stream: AdminLiveStream;
  refreshTick: number;
  onClick: (stream: AdminLiveStream) => void;
}

export default function AdminLiveCard({ stream, refreshTick, onClick }: AdminLiveCardProps) {
  const setting = stream.broadcaster.broadcastSetting;
  const thumbnailSrc: string = stream.thumbnail
    ? `${stream.thumbnail}${stream.thumbnail.includes('?') ? '&' : '?'}t=${refreshTick}`
    : DEFAULT_PLACEHOLDER;

  return (
    <div
      onClick={() => onClick(stream)}
      className="group flex flex-col rounded-lg overflow-hidden cursor-pointer bg-card border border-border hover:border-primary/50 hover:shadow-lg transition-all duration-150"
    >
      {/* 썸네일 — NCP 고정 URL + cache-busting으로 5초마다 최신 화면 갱신 */}
      <div className="relative w-full aspect-video overflow-hidden bg-muted">
        {/* next/image 미사용: t 파라미터마다 새 URL로 인식되어 이미지 최적화 캐시가 증식함 */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={thumbnailSrc}
          alt={setting.title || '라이브'}
          className="w-full h-full object-cover"
        />
        <span className="absolute top-1.5 left-1.5 bg-destructive text-destructive-foreground text-[10px] font-bold px-1.5 py-0.5 rounded-sm tracking-wide">
          LIVE
        </span>
        <span className="absolute bottom-1.5 right-1.5 bg-black/70 text-white text-[11px] px-1.5 py-0.5 rounded-sm backdrop-blur-sm flex items-center gap-0.5">
          <FiUser className="w-2.5 h-2.5" /> {stream.viewerCount.toLocaleString()}
        </span>
        <span className="absolute bottom-1.5 left-1.5 bg-black/70 text-white text-[11px] px-1.5 py-0.5 rounded-sm backdrop-blur-sm">
          {formatDuration(stream.start_time)}
        </span>
      </div>

      {/* 카드 정보 */}
      <div className="px-3 py-2.5 space-y-1.5">
        <p className="text-sm font-medium text-foreground truncate">{setting.title || '(제목 없음)'}</p>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <span className="truncate">{stream.broadcaster.nickname}</span>
          <span className="font-mono truncate">({stream.broadcaster.user_id})</span>
        </div>
        <div className="flex flex-wrap gap-1">
          <StatusBadge label={categoryLabels[setting.category]} tone="blue" />
          {setting.is_adult && <StatusBadge label="성인" tone="red" />}
          {setting.is_fan && <StatusBadge label="팬전용" tone="purple" />}
          {setting.is_pw && <StatusBadge label="비밀번호" tone="gray" />}
          {!setting.is_adult && !setting.is_fan && !setting.is_pw && (
            <StatusBadge label="공개" tone="green" />
          )}
        </div>
      </div>
    </div>
  );
}
