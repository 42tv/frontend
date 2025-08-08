export interface User {
  idx: number | null;
  user_id: string | null;
  nickname: string | null;
  profile_img: string | null;
  is_guest: boolean;
}

export interface UserInfo {
  user_idx?: number;
  user_id: string;
  nickname: string;
  profile_img: string;
  type?: 'viewer' | 'broadcaster' | 'manager';
}

export interface CurrentUser {
  idx: number;
  role?: 'broadcaster' | 'manager' | 'viewer';
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

export interface PasswordState {
  password: string;
  setPassword: React.Dispatch<React.SetStateAction<string>>;
  newPassword: string;
  setNewPassword: React.Dispatch<React.SetStateAction<string>>;
  passwordCheck: string;
  setPasswordCheck: React.Dispatch<React.SetStateAction<string>>;
}
