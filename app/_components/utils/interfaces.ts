export interface UserResponse {
  idx: number;
  user_id: string;
  nickname: string;
  profile_img: string;
}

export interface PlayResponse {
  playback_url: string | null;
}

export interface CardData {
  id: number;
  user_idx: number;
  profile_img: string; // imageUrl 추가
  user_id: string;
  hidden: boolean;
  is_live: boolean;
}
