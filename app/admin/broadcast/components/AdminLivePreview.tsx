'use client';
import { useRef } from 'react';
import { FiVolume2, FiVolumeX } from 'react-icons/fi';
import { useHlsPlayer } from '@/app/live/components/hooks/useHlsPlayer';

interface AdminLivePreviewProps {
  playbackUrl: string;
  title: string;
}

/**
 * 관리자 방송 상세 모달용 LL-HLS 실시간 미리보기.
 * 모달이 열려 선택한 방송 1개만 재생하므로 그리드 썸네일 방식 대비 트래픽 부담이 없다.
 */
export default function AdminLivePreview({ playbackUrl, title }: AdminLivePreviewProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const { playerState, handleMuteToggle } = useHlsPlayer({
    streamUrl: playbackUrl,
    videoRef,
  });

  return (
    <div className="relative aspect-video rounded-md overflow-hidden bg-black border border-border">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted={playerState.isMuted}
        className="w-full h-full object-contain"
        aria-label={title}
      />
      <span className="absolute top-2 left-2 bg-destructive text-destructive-foreground text-[10px] font-bold px-1.5 py-0.5 rounded-sm tracking-wide">
        LIVE
      </span>
      <button
        onClick={handleMuteToggle}
        className="absolute bottom-2 right-2 p-2 rounded-md bg-black/70 text-white hover:bg-black/90 transition-colors"
        aria-label={playerState.isMuted ? '음소거 해제' : '음소거'}
      >
        {playerState.isMuted ? <FiVolumeX className="w-4 h-4" /> : <FiVolume2 className="w-4 h-4" />}
      </button>
    </div>
  );
}
