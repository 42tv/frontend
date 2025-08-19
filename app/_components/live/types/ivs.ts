/* eslint-disable @typescript-eslint/no-explicit-any */

// IVS Player 타입 정의
export interface IVSPlayer {
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
    READY: string;
  };
}

export interface IVSPlayerInstance {
  attachHTMLVideoElement(element: HTMLVideoElement): void;
  addEventListener(event: string, callback: (...args: any[]) => void): void;
  load(url: string): void;
  play(): void;
  pause(): void;
  delete(): void;
  setVolume(volume: number): void;
  setMuted(muted: boolean): void;
  getQuality(): { height: number } | null;
}

export interface PlayerState {
  isPlaying: boolean;
  isMuted: boolean;
  volume: number;
  currentQuality: string | null;
}