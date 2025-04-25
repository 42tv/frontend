import { create } from 'zustand';
import { PlayResponse } from '../interfaces';

interface PlayState extends PlayResponse {
  setPlaybackUrl: (playBack_url: string | null) => void;
}

const usePlayStore = create<PlayState>((set) => ({
    playback_url: null, // Add the missing playback_url property
    setPlaybackUrl: (playback_url: string | null) => set(() => ({ playback_url  })), // Set the playback URL
}));

export default usePlayStore;
