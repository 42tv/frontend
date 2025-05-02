import { create } from 'zustand';
import { PlayData } from '../interfaces';

interface PlayState {
  playData: PlayData | null;
  setPlayData: (playData: PlayData) => void;
}

const usePlayStore = create<PlayState>((set) => ({
    playData: null,
    setPlayData: (playDataResponse: PlayData) => set({
        playData: {
            playback_url: playDataResponse.playback_url,
            title: playDataResponse.title,
            is_bookmarked: playDataResponse.is_bookmarked,
            profile_img: playDataResponse.profile_img,
            nickname: playDataResponse.nickname,
        }
    }),
}));

export default usePlayStore;
