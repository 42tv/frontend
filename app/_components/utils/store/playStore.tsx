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
            broadcaster_idx: playDataResponse.broadcaster_idx,
            broadcaster_id: playDataResponse.broadcaster_id,
            broadcaster_nickname: playDataResponse.broadcaster_nickname,
            playback_url: playDataResponse.playback_url,
            title: playDataResponse.title,
            is_bookmarked: playDataResponse.is_bookmarked,
            profile_img: playDataResponse.profile_img,
            nickname: playDataResponse.nickname,
            viewer_cnt: playDataResponse.viewer_cnt,
            play_cnt: playDataResponse.play_cnt,
            recommend_cnt: playDataResponse.recommend_cnt,
            start_time: playDataResponse.start_time,
            play_token: playDataResponse.play_token,
        }
    }),
}));

export default usePlayStore;
