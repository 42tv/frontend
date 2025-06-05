// Define interfaces for the data structure (moved from page.tsx)
export interface User {
  idx: number | null;
  user_id: string | null;
  nickname: string | null;
  profile_img: string | null;
  is_guest: boolean;
}

export interface Channel {
  title: string | null;
  bookmark: number | null;
  like: number | null;
  watch: number | null;
  month_time: number | null;
  total_time: number | null;
}

export interface BroadcastSetting {
  title: string | null;
  is_adult: boolean | null;
  is_pw: boolean | null;
  is_fan: boolean | null;
  fan_level: number | null;
  password: string | null;
}

export interface IVSChannel {
  channel_id: string | null;
  ingest_endpoint: string | null;
  playback_url: string | null;
  stream_key: string | null;
}

export interface Stream {
  request_id: string | null;
  stream_id: string | null;
  title: string | null;
  start_time: string | null;
  play_cnt: number | null;
  recommend_cnt: number | null;
}

export interface Post {
  id: number | null;
  content: string | null;
  is_read: boolean | null;
  send_at: string | null;
  read_at: string | null;
  sender: User | null;
  receiver: User | null;
}

export interface Live {
  // Export the interface
  thumbnail: string;
  start_time: string;
  play_cnt: number;
  recommend_cnt: number;
  user: {
    idx: number;
    user_id: string;
    nickname: string;
    profile_img: string;
    broadcastSetting: BroadcastSetting;
  };
  viewerCount: number;
}

export interface PlayData {
  broadcaster_idx: string;
  broadcaster_id: string;
  broadcaster_nickname: string;
  playback_url: string;
  title: string;
  is_bookmarked: boolean;
  profile_img: string;
  nickname: string;
  viewer_cnt: number;
  play_cnt: number;
  recommend_cnt: number;
  start_time: string;
  play_token: string;
}

export interface CardData {
  id: number;
  user_idx: number;
  profile_img: string; // imageUrl 추가
  user_id: string;
  hidden: boolean;
  is_live: boolean;
}
