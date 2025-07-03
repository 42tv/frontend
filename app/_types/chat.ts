import { Socket } from 'socket.io-client';

export type MessageType = 'chat' | 'donation' | 'recommend';
export type TabType = 'chat' | 'viewers';
export type Message = ChatMessage | DonationMessage | RecommendMessage;

export interface BaseMessage {
  id?: string;
  type: MessageType;
  timestamp?: number;
}

export interface ChatMessage extends BaseMessage {
  type: 'chat';
  chatter_idx: number;
  chatter_user_id: string;
  chatter_nickname: string;
  chatter_message: string;
  grade: string;
  role: string;
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

export interface Viewer {
  user_idx: number;
  user_id: string;
  nickname: string;
  type: 'viewer' | 'broadcaster' | 'manager';
}

export interface ChatProps {
  broadcasterId: string;
  socket: Socket | null;
  myRole: 'broadcaster' | 'manager' | 'member' | 'guest';
  broadcasterIdx: number;
}
