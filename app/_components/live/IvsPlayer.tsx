'use client';

import { useRef, useState, useEffect } from 'react';
import { useIVSPlayer } from './hooks/useIVSPlayer';
import { PlayerControls } from './components/PlayerControls';

type Props = {
  streamUrl: string;
};

const IvsPlayer = ({ streamUrl }: Props) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [showControls, setShowControls] = useState(false);
  
  const { playerState, handlePlayPause, handleMuteToggle, handleVolumeChange } = useIVSPlayer({
    streamUrl,
    videoRef,
  });

  const handleMouseEnter = () => {
    setShowControls(true);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  const handleMouseMove = () => {
    setShowControls(true);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setShowControls(false);
    }, 3000);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setShowControls(false);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div
      className="relative w-full h-full bg-black"
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <video
        ref={videoRef}
        playsInline
        className="w-full h-full rounded-lg block object-cover"
      />
      {showControls && (
        <PlayerControls
          playerState={playerState}
          onPlayPause={handlePlayPause}
          onMuteToggle={handleMuteToggle}
          onVolumeChange={handleVolumeChange}
        />
      )}
    </div>
  );
};

export default IvsPlayer;
