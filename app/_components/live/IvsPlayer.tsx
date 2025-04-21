'use client';

import { useEffect, useRef, useState } from 'react';

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
  };
}

const IvsPlayer = ({ streamUrl }: Props) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const playerRef = useRef<any | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true); // 초기값을 true로 변경
  const [volume, setVolume] = useState(1); // 볼륨 상태 (0 ~ 1)
  const [currentQuality, setCurrentQuality] = useState<string | null>(null); // 현재 화질 상태

  useEffect(() => {
    const videoElement = videoRef.current;
    let playerInstance: any = null;

    if (videoElement) {
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
            streamUrl = "https://3d26876b73d7.us-west-2.playback.live-video.net/api/video/v1/us-west-2.913157848533.channel.rkCBS9iD1eyd.m3u8"
            playerInstance.attachHTMLVideoElement(videoRef.current);
            playerInstance.load(streamUrl);
            playerInstance.play();
            setIsPlaying(true); // play() 호출 후 즉시 true로 설정

            // 볼륨 및 음소거 상태 설정 (play 이후)
            playerInstance.setVolume(volume);
            playerInstance.setMuted(false); // 음소거 해제 시도
            setIsMuted(false); // 내부 상태도 동기화

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

            playerInstance.addEventListener(PlayerState.PLAYING, onPlaying);
            playerInstance.addEventListener(PlayerState.PAUSED, onPaused);
            playerInstance.addEventListener(PlayerState.ENDED, onEnded);
            playerInstance.addEventListener(PlayerEventType.ERROR, onError);
            playerInstance.addEventListener(PlayerEventType.QUALITY_CHANGED, onQualityChanged);

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
  }, [streamUrl]);

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
    <div style={{ position: 'relative', width: '100%', backgroundColor: '#000' }}>
      <video
        ref={videoRef}
        playsInline
        muted // muted 속성 추가
        style={{ width: '100%', borderRadius: '8px', display: 'block' }}
      />
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        padding: '10px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        color: 'white',
        opacity: 1,
        transition: 'opacity 0.3s ease',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <button onClick={handlePlayPause} style={buttonStyle}>
            {isPlaying ? 'Pause' : 'Play'}
          </button>
          <button onClick={handleMuteToggle} style={buttonStyle}>
            {isMuted ? 'Unmute' : 'Mute'}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={isMuted ? 0 : volume}
            onChange={handleVolumeChange}
            style={{ cursor: 'pointer', width: '80px' }}
            disabled={isMuted}
          />
        </div>
        <div>
          {currentQuality && (
            <span style={{ fontSize: '0.9em' }}>{currentQuality}</span>
          )}
        </div>
      </div>
    </div>
  );
};

const buttonStyle: React.CSSProperties = {
  background: 'none',
  border: 'none',
  color: 'white',
  cursor: 'pointer',
  padding: '5px',
  fontSize: '1em',
};

export default IvsPlayer;
