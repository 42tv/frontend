export interface UserResponse {
  idx: number;
  user_id: string;
  nickname: string;
  profile_img: string;
}

export interface PlayResponse {
  playback_url: string | null;
}
