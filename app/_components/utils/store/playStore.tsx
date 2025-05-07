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
            play_cnt: playDataResponse.play_cnt,
            like_cnt: playDataResponse.like_cnt,
            start_time: playDataResponse.start_time,
            play_token: playDataResponse.play_token,
        }
    }),
}));

export default usePlayStore;
