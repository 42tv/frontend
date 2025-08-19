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
  const [playerState, setPlayerState] = useState<PlayerState>({
    isPlaying: true,
    isMuted: true,
    volume: 1,
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
    }
  };

  const handleVolumeChange = (newVolume: number) => {
    if (playerRef.current) {
      playerRef.current.setVolume(newVolume);
      setPlayerState(prev => ({ ...prev, volume: newVolume }));
      if (newVolume > 0 && playerState.isMuted) {
        playerRef.current.setMuted(false);
        setPlayerState(prev => ({ ...prev, isMuted: false }));
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