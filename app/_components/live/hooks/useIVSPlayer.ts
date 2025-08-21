/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useRef, useState } from 'react';
import type { IVSPlayer, IVSPlayerInstance, PlayerState } from '../types/ivs';

interface UseIVSPlayerProps {
  streamUrl: string;
  videoRef: React.RefObject<HTMLVideoElement>;
}

export const useIVSPlayer = ({ streamUrl, videoRef }: UseIVSPlayerProps) => {
  const playerRef = useRef<IVSPlayerInstance | null>(null);
  
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
    let playerInstance: IVSPlayerInstance | null = null;

    if (videoElement && streamUrl) {
      const initPlayer = async () => {
        try {
          const IVSPlayerModule = (await import('amazon-ivs-player')) as unknown as IVSPlayer;
          const { create, isPlayerSupported, PlayerEventType, PlayerState } = IVSPlayerModule;

          if (isPlayerSupported && videoRef.current) {
            playerInstance = create({
              wasmWorker: '/ivs/amazon-ivs-wasmworker.min.js',
              wasmBinary: '/ivs/amazon-ivs-wasmworker.min.wasm',
            });
            
            if (playerInstance) {
              playerRef.current = playerInstance;

              playerInstance.attachHTMLVideoElement(videoRef.current);

              // 이벤트 리스너 등록
              const onReady = () => {
                console.log('Player State - READY');
                if (playerRef.current) {
                  playerRef.current.play();
                }
              };

              const onPlaying = () => {
                console.log('Player State - PLAYING');
                setPlayerState(prev => ({ ...prev, isPlaying: true }));
              };

              const onPaused = () => {
                console.log('Player State - PAUSED');
                setPlayerState(prev => ({ ...prev, isPlaying: false }));
              };

              const onEnded = () => {
                console.log('Player State - ENDED');
                setPlayerState(prev => ({ ...prev, isPlaying: false }));
              };

              const onError = (err: any) => {
                console.error('Player Event - ERROR:', err);
              };

              const onQualityChanged = (quality: any) => {
                console.log('Player Event - QUALITY_CHANGED:', quality);
                setPlayerState(prev => ({ ...prev, currentQuality: `${quality.height}p` }));
              };

              playerInstance.addEventListener(PlayerState.READY, onReady);
              playerInstance.addEventListener(PlayerState.PLAYING, onPlaying);
              playerInstance.addEventListener(PlayerState.PAUSED, onPaused);
              playerInstance.addEventListener(PlayerState.ENDED, onEnded);
              playerInstance.addEventListener(PlayerEventType.ERROR, onError);
              playerInstance.addEventListener(PlayerEventType.QUALITY_CHANGED, onQualityChanged);

              // 스트림 로드 및 초기 설정
              playerInstance.load(streamUrl);
              playerInstance.setVolume(playerState.volume);
              playerInstance.setMuted(playerState.isMuted);

              const initialQuality = playerInstance.getQuality();
              if (initialQuality) {
                setPlayerState(prev => ({ ...prev, currentQuality: `${initialQuality.height}p` }));
              }
            }
          } else if (!isPlayerSupported) {
            console.warn('IVS Player is not supported in this browser.');
          }
        } catch (err) {
          console.error("Failed to load or initialize IVS Player SDK", err);
        }
      };
      initPlayer();
    }

    return () => {
      const currentPlayer = playerRef.current;
      if (currentPlayer) {
        console.log("Cleaning up IVS Player");
        currentPlayer.pause();
        currentPlayer.delete();
        playerRef.current = null;
        setPlayerState({
          isPlaying: false,
          isMuted: true,
          volume: 1,
          currentQuality: null,
        });
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [streamUrl]);

  const handlePlayPause = () => {
    if (playerRef.current) {
      if (playerState.isPlaying) {
        playerRef.current.pause();
        setPlayerState(prev => ({ ...prev, isPlaying: false }));
      } else {
        playerRef.current.play();
        setPlayerState(prev => ({ ...prev, isPlaying: true }));
      }
    }
  };

  const handleMuteToggle = () => {
    if (playerRef.current) {
      const newMuted = !playerState.isMuted;
      playerRef.current.setMuted(newMuted);
      setPlayerState(prev => ({ ...prev, isMuted: newMuted }));
      
      // 로컬스토리지에 저장
      try {
        localStorage.setItem('ivs-player-muted', JSON.stringify(newMuted));
      } catch (error) {
        console.error('Failed to save mute setting:', error);
      }
    }
  };

  const handleVolumeChange = (newVolume: number) => {
    if (playerRef.current) {
      playerRef.current.setVolume(newVolume);
      setPlayerState(prev => ({ ...prev, volume: newVolume }));
      
      // 볼륨을 올리면 음소거 해제
      if (newVolume > 0 && playerState.isMuted) {
        playerRef.current.setMuted(false);
        setPlayerState(prev => ({ ...prev, isMuted: false }));
        
        // 음소거 해제 상태도 저장
        try {
          localStorage.setItem('ivs-player-muted', JSON.stringify(false));
        } catch (error) {
          console.error('Failed to save mute setting:', error);
        }
      }
      
      // 로컬스토리지에 볼륨 저장
      try {
        localStorage.setItem('ivs-player-volume', newVolume.toString());
      } catch (error) {
        console.error('Failed to save volume setting:', error);
      }
    }
  };

  return {
    playerState,
    handlePlayPause,
    handleMuteToggle,
    handleVolumeChange,
  };
};