import { User } from './user';
import { Post } from './post';

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

export interface Stream {
  title: string;
  playback_url: string;
  play_cnt: number;
  recommend_cnt: number;
  bookmark_cnt: number;
  start_time: string;
}

export interface PlayData {
  broadcaster: {
    idx: number;
    user_id: string;
    nickname: string;
    profile_img: string;
  };
  stream: {
    title: string;
    playback_url: string;
    play_cnt: number;
    recommend_cnt: number;
    bookmark_cnt: number;
    start_time: string;
  };
  user: {
    user_idx: number;
    user_id: string;
    nickname: string;
    profile_img: string;
    is_bookmarked: boolean;
    role: 'broadcaster' | 'manager' | 'member' | 'viewer' | 'guest';
    play_token: string;
    is_guest: boolean;
    guest_id?: string;
  };
  viewer_cnt: number;
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

export interface LiveStreamCardProps {
  live: Live;
  index: number;
}

export interface LivePageProps {
  broadcasterId: string;
}

export interface StreamData {
  streamUrl: string;
  title: string;
  description: string;
}

export interface UserData {
  nickname: string;
  profileImageUrl: string;
}

export interface StreamPlayerProps {
  streamData: StreamData;
  userData: UserData;
}

export interface StreamInfoProps {
  playDataState: PlayData | null | undefined;
  onToggleBookmark: () => void;
  onSendPost: () => void;
  onRecommend: () => void;
}

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
