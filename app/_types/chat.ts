export type MessageType = 'chat' | 'donation' | 'recommend';
export type TabType = 'chat' | 'viewers';
export type Message = ChatMessage | DonationMessage | RecommendMessage;
export type UserRole = 'broadcaster' | 'manager' | 'member' | 'viewer' | 'guest';

interface BaseMessage {
  type: MessageType;
}

export interface ChatMessage extends BaseMessage {
  type: 'chat';
  user_idx: number;
  user_id: string;
  nickname: string;
  message: string;
  role: 'broadcaster' | 'manager' | 'member' | 'viewer' | 'guest';
  grade: string;
  color: string;
}

export interface DonationMessage extends BaseMessage {
  type: 'donation';
  amount: number;
  donor_nickname: string;
  message?: string;
}

export interface RecommendMessage extends BaseMessage {
  type: 'recommend';
  recommender_nickname: string;
}

export interface JwtDecode {
  idx: number;
  user_id: string;
  nickname: string;
  role: UserRole;
  profile_img: string;
  is_guest: boolean;
  guest_id?: string;
}

export interface Viewer {
  user_idx: number;
  user_id: string;
  nickname: string;
  role: UserRole;
}

export interface MyRole {
  user_idx: number;
  user_id: string;
  nickname: string;
  role: UserRole;
}

