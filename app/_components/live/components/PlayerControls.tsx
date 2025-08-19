'use client';

import { FaPlay, FaPause, FaVolumeMute, FaVolumeUp } from 'react-icons/fa';
import type { PlayerState } from '../types/ivs';

interface PlayerControlsProps {
  playerState: PlayerState;
  onPlayPause: () => void;
  onMuteToggle: () => void;
  onVolumeChange: (volume: number) => void;
}

export const PlayerControls = ({
  playerState,
  onPlayPause,
  onMuteToggle,
  onVolumeChange
}: PlayerControlsProps) => {
  const { isPlaying, isMuted, volume, currentQuality } = playerState;

  const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(event.target.value);
    onVolumeChange(newVolume);
  };

  return (
    <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-2.5 flex items-center justify-between text-white animate-in fade-in duration-300">
      <div className="flex items-center gap-4">
        <button 
          onClick={onPlayPause} 
          className="bg-transparent border-none text-white cursor-pointer p-1 text-xl"
        >
          {isPlaying ? <FaPause /> : <FaPlay />}
        </button>
        <button 
          onClick={onMuteToggle} 
          className="bg-transparent border-none text-white cursor-pointer p-1 text-xl"
        >
          {isMuted || volume === 0 ? <FaVolumeMute /> : <FaVolumeUp />}
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
      {currentQuality && (
        <div>
          <span className="text-sm">{currentQuality}</span>
        </div>
      )}
    </div>
  );
};