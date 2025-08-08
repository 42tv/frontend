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
  title: string;
  fan_level: number | null;
  is_adult: boolean;
  is_pw: boolean;
  is_fan: boolean;
}

export interface IVSChannel {
  channel_id: string | null;
  ingest_endpoint: string | null;
  playback_url: string | null;
  stream_key: string | null;
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
  broadcaster: {
    idx: number;
    user_id: string;
    nickname: string;
    profile_img: string;
    broadcastSetting: BroadcastSetting;
  };
  viewerCount: number;
}

export interface MyInfo {
    user_idx: number;
    user_id: string;
    nickname: string;
    profile_img: string;
    is_bookmarked: boolean;
    role: 'broadcaster' | 'manager' | 'member' | 'viewer' | 'guest';
    play_token: string;
    is_guest: boolean;
    guest_id?: string; // 게스트 ID (게스트인 경우에만 존재)
}

export interface Broadcaster {
  idx: number;
  user_id: string;
  nickname: string;
  profile_img: string;
}

export interface Stream {
  title: string;
  playback_url: string;
  play_cnt: number;
  recommend_cnt: number;
  bookmark_cnt: number;
  start_time: string;
}

export interface PlayData {
  broadcaster: Broadcaster;
  stream: {
    title: string;
    playback_url: string;
    play_cnt: number;
    recommend_cnt: number;
    bookmark_cnt: number;
    start_time: string;
  };
  user: MyInfo;
  viewer_cnt: number;
}

export interface CardData {
  id: number;
  user_idx: number;
  profile_img: string; // imageUrl 추가
  user_id: string;
  hidden: boolean;
  is_live: boolean;
}

export interface FanLevel {
  id: number;
  name: string;
  min_donation: number;
  color: string;
}
