/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';
import type { PlayerState } from '../types/ivs';

interface UseHlsPlayerProps {
  streamUrl: string;
  videoRef: React.RefObject<HTMLVideoElement>;
}

/**
 * NCP Live Station(표준 HLS) 재생용 훅.
 * hls.js를 사용하며, HLS 네이티브 지원 브라우저(Safari 등)에서는 video 태그에 직접 로드한다.
 * 재생/음소거/볼륨 제어는 video 엘리먼트를 직접 조작한다.
 */
export const useHlsPlayer = ({ streamUrl, videoRef }: UseHlsPlayerProps) => {
  const hlsRef = useRef<Hls | null>(null);

  // 로컬스토리지에서 저장된 설정 불러오기
  const getStoredSettings = () => {
    if (typeof window === 'undefined') return { isMuted: true, volume: 1 };

    try {
      const storedVolume = localStorage.getItem('ivs-player-volume');
      const storedMuted = localStorage.getItem('ivs-player-muted');

      return {
        isMuted: storedMuted ? JSON.parse(storedMuted) : true,
        volume: storedVolume ? parseFloat(storedVolume) : 1,
      };
    } catch (error) {
      console.error('Failed to load player settings:', error);
      return { isMuted: true, volume: 1 };
    }
  };

  const { isMuted: initialMuted, volume: initialVolume } = getStoredSettings();

  const [playerState, setPlayerState] = useState<PlayerState>({
    isPlaying: true,
    isMuted: initialMuted,
    volume: initialVolume,
    currentQuality: null,
  });

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement || !streamUrl) return;

    // 초기 볼륨/음소거 설정
    videoElement.volume = initialVolume;
    videoElement.muted = initialMuted;

    const handlePlaying = () => setPlayerState(prev => ({ ...prev, isPlaying: true }));
    const handlePause = () => setPlayerState(prev => ({ ...prev, isPlaying: false }));
    const handleEnded = () => setPlayerState(prev => ({ ...prev, isPlaying: false }));

    videoElement.addEventListener('playing', handlePlaying);
    videoElement.addEventListener('pause', handlePause);
    videoElement.addEventListener('ended', handleEnded);

    let hls: Hls | null = null;

    if (Hls.isSupported()) {
      // hls.js 사용 (Chrome, Firefox, Edge 등)
      // NCP Live Station LL-HLS 채널 대응: 저지연 모드 활성화 + 라이브 엣지 동기화
      // liveSyncDurationCount를 명시하면 hls.js가 서버의 PART-HOLD-BACK(3초) 지시를
      // 무시하고 count×세그먼트길이(2s)=6초를 목표로 잡으므로 설정하지 않는다.
      hls = new Hls({
        lowLatencyMode: true, // #EXT-X-PART / PRELOAD-HINT 부분 세그먼트 재생
        backBufferLength: 30, // 지난 버퍼를 짧게 유지해 메모리 절약
        maxLiveSyncPlaybackRate: 1.5, // 지연 누적 시 1.5배속으로 라이브 엣지 추격
      });
      hlsRef.current = hls;
      hls.loadSource(streamUrl);
      hls.attachMedia(videoElement);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        videoElement.play().catch(err => console.warn('Autoplay blocked:', err));
      });

      hls.on(Hls.Events.LEVEL_SWITCHED, (_event, data) => {
        const level = hls?.levels[data.level];
        if (level?.height) {
          setPlayerState(prev => ({ ...prev, currentQuality: `${level.height}p` }));
        }
      });

      hls.on(Hls.Events.ERROR, (_event, data) => {
        console.error('HLS Player Event - ERROR:', data);
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              hls?.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              hls?.recoverMediaError();
              break;
            default:
              hls?.destroy();
              break;
          }
        }
      });
    } else if (videoElement.canPlayType('application/vnd.apple.mpegurl')) {
      // 네이티브 HLS 지원 (Safari, iOS)
      videoElement.src = streamUrl;
      videoElement.addEventListener('loadedmetadata', () => {
        videoElement.play().catch(err => console.warn('Autoplay blocked:', err));
      });
    } else {
      console.warn('HLS is not supported in this browser.');
    }

    return () => {
      videoElement.removeEventListener('playing', handlePlaying);
      videoElement.removeEventListener('pause', handlePause);
      videoElement.removeEventListener('ended', handleEnded);
      if (hls) {
        hls.destroy();
      }
      hlsRef.current = null;
      videoElement.removeAttribute('src');
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [streamUrl]);

  const handlePlayPause = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play().catch(err => console.warn('Play failed:', err));
    } else {
      video.pause();
    }
  };

  const handleMuteToggle = () => {
    const video = videoRef.current;
    if (!video) return;
    const newMuted = !video.muted;
    video.muted = newMuted;
    setPlayerState(prev => ({ ...prev, isMuted: newMuted }));

    try {
      localStorage.setItem('ivs-player-muted', JSON.stringify(newMuted));
    } catch (error) {
      console.error('Failed to save mute setting:', error);
    }
  };

  const handleVolumeChange = (newVolume: number) => {
    const video = videoRef.current;
    if (!video) return;
    video.volume = newVolume;
    setPlayerState(prev => ({ ...prev, volume: newVolume }));

    // 볼륨을 올리면 음소거 해제
    if (newVolume > 0 && video.muted) {
      video.muted = false;
      setPlayerState(prev => ({ ...prev, isMuted: false }));
      try {
        localStorage.setItem('ivs-player-muted', JSON.stringify(false));
      } catch (error) {
        console.error('Failed to save mute setting:', error);
      }
    }

    try {
      localStorage.setItem('ivs-player-volume', newVolume.toString());
    } catch (error) {
      console.error('Failed to save volume setting:', error);
    }
  };

  return {
    playerState,
    handlePlayPause,
    handleMuteToggle,
    handleVolumeChange,
  };
};
