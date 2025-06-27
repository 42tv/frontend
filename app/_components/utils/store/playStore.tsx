import { create } from 'zustand';
import { PlayData } from '../interfaces';

interface PlayState {
  playData: PlayData | null;
  setPlayData: (playData: PlayData) => void;
}

const usePlayStore = create<PlayState>((set) => ({
    playData: null,
    setPlayData: (playDataResponse: PlayData) => set({
        playData: playDataResponse
    }),
}));

export default usePlayStore;
