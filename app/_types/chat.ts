export type MessageType = 'chat' | 'donation' | 'recommend';
export type TabType = 'chat' | 'viewers';
export type Message = ChatMessage | DonationMessage | RecommendMessage;
export type UserRole = 'broadcaster' | 'manager' | 'member' | 'viewer' | 'guest';

export enum OpCode {
  CHAT = 'chat',
  KICK = 'kick',
  KICKED = 'kicked',
  BAN = 'ban',
  RECOMMEND = 'recommend',
  BOOKMARK = 'bookmark',
  USER_JOIN = 'join',
  USER_LEAVE = 'leave',
  ROLE_CHANGE = 'role_change',
  VIEWER_COUNT = 'viewer_count',
  VIEWER_LIST = 'viewer_list',
}

export enum RoleChangeType {
  MANAGER_GRANT = 'manager_grant',
  MANAGER_REVOKE = 'manager_revoke',
}

export interface RoleChangePayload {
  type: RoleChangeType;
  user_idx: number;
  user_id: string;
  nickname: string;
  from_role: 'manager' | 'member' | 'viewer';
  to_role: 'manager' | 'member' | 'viewer';
  to_color: string;
}

export interface KickPayload {
  user_id: string;
  user_idx: number;
  nickname: string;
  kicked_by: {
    idx: number;
    user_id: string;
    nickname: string;
  };
}

export interface KickedPayload {
  user_id: string;
  user_idx: number;
  nickname: string;
  kicked_by: {
    idx: number;
    user_id: string;
    nickname: string;
  };
  reason?: string;
}

interface BaseMessage {
  type: MessageType;
}

export interface ChatMessage extends BaseMessage {
  type: 'chat';
  user_idx: number;
  user_id: string;
  nickname: string;
  message: string;
  profile_img: string;
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

