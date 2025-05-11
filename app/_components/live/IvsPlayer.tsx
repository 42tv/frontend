/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useRef, useState } from 'react';
import { FaPlay, FaPause, FaVolumeMute, FaVolumeUp } from 'react-icons/fa'; // 아이콘 가져오기

type Props = {
  streamUrl: string;
};

// IVS Player 타입 정의 (필요한 경우 더 구체적으로 정의)
interface IVSPlayer {
  create(options: any): any;
  isPlayerSupported: boolean;
  PlayerEventType: {
    ERROR: string;
    QUALITY_CHANGED: string;
  };
  PlayerState: {
    PLAYING: string;
    PAUSED: string;
    ENDED: string;
    READY: string; // READY 상태 추가
  };
}

const IvsPlayer = ({ streamUrl }: Props) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const playerRef = useRef<any | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [volume, setVolume] = useState(1); // 볼륨 상태 (0 ~ 1)
  const [currentQuality, setCurrentQuality] = useState<string | null>(null); // 현재 화질 상태

  useEffect(() => {
    const videoElement = videoRef.current;
    let playerInstance: any = null;

    if (videoElement && streamUrl) { // streamUrl 유효성 검사 추가
      const initPlayer = async () => {
        try {
          const IVSPlayerModule = (await import('amazon-ivs-player')) as unknown as IVSPlayer;
          const { create, isPlayerSupported, PlayerEventType, PlayerState } = IVSPlayerModule;

          if (isPlayerSupported && videoRef.current) {
            playerInstance = create({
              wasmWorker: '/ivs/amazon-ivs-wasmworker.min.js',
              wasmBinary: '/ivs/amazon-ivs-wasmworker.min.wasm',
            });
            playerRef.current = playerInstance;

            playerInstance.attachHTMLVideoElement(videoRef.current);

            // 이벤트 리스너 먼저 등록
            const onReady = () => {
              console.log('Player State - READY');
              // 플레이어가 준비되면 재생 시도
              if (playerRef.current) {
                playerRef.current.play();
              }
            };
            const onPlaying = () => {
              console.log('Player State - PLAYING');
              setIsPlaying(true);
            };
            const onPaused = () => {
              console.log('Player State - PAUSED');
              setIsPlaying(false);
            };
            const onEnded = () => {
              console.log('Player State - ENDED');
              setIsPlaying(false);
            };
            const onError = (err: any) => {
              console.error('Player Event - ERROR:', err);
            };
            const onQualityChanged = (quality: any) => {
              console.log('Player Event - QUALITY_CHANGED:', quality);
              setCurrentQuality(`${quality.height}p`);
            };

            playerInstance.addEventListener(PlayerState.READY, onReady); // READY 이벤트 리스너 추가
            playerInstance.addEventListener(PlayerState.PLAYING, onPlaying);
            playerInstance.addEventListener(PlayerState.PAUSED, onPaused);
            playerInstance.addEventListener(PlayerState.ENDED, onEnded);
            playerInstance.addEventListener(PlayerEventType.ERROR, onError);
            playerInstance.addEventListener(PlayerEventType.QUALITY_CHANGED, onQualityChanged);

            // 스트림 로드
            playerInstance.load(streamUrl);
            playerInstance.setVolume(volume); // 볼륨 설정
            playerInstance.setMuted(isMuted); // 초기 음소거 상태 설정

            const initialQuality = playerInstance.getQuality();
            if (initialQuality) {
              setCurrentQuality(`${initialQuality.height}p`);
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
        setIsPlaying(false);
        setCurrentQuality(null);
      }
    };
  }, []);

  const handlePlayPause = () => {
    if (playerRef.current) {
      if (isPlaying) {
        playerRef.current.pause();
        setIsPlaying(false);
      } else {
        playerRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const handleMuteToggle = () => {
    if (playerRef.current) {
      const newMuted = !isMuted;
      playerRef.current.setMuted(newMuted);
      setIsMuted(newMuted);
    }
  };

  const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (playerRef.current) {
      const newVolume = parseFloat(event.target.value);
      playerRef.current.setVolume(newVolume);
      setVolume(newVolume);
      if (newVolume > 0 && isMuted) {
        playerRef.current.setMuted(false);
        setIsMuted(false);
      }
    }
  };

  return (
    <div className="relative w-full bg-black">
      <video
        ref={videoRef}
        playsInline
        className="w-full rounded-lg block"
      />
      <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-2.5 flex items-center justify-between text-white opacity-100 transition-opacity duration-300 ease-in-out">
        <div className="flex items-center gap-4">
          <button onClick={handlePlayPause} className="bg-transparent border-none text-white cursor-pointer p-1 text-xl"> {/* 아이콘 크기 조절을 위해 text-xl 추가 */}
            {isPlaying ? <FaPause /> : <FaPlay />}
          </button>
          <button onClick={handleMuteToggle} className="bg-transparent border-none text-white cursor-pointer p-1 text-xl"> {/* 아이콘 크기 조절을 위해 text-xl 추가 */}
            {isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={isMuted ? 0 : volume}
            onChange={handleVolumeChange}
            className="cursor-pointer w-20 accent-white disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isMuted}
          />
        </div>
        <div>
          {currentQuality && (
            <span className="text-sm">{currentQuality}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default IvsPlayer;
