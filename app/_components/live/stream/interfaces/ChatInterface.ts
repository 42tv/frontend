type MessageType = 'chat' | 'donation' | 'recommend';
type TabType = 'chat' | 'viewers';
type Message = ChatMessage | DonationMessage | RecommendMessage;

interface BaseMessage {
  id?: string;
  type: MessageType;
  timestamp?: number;
}

interface ChatMessage extends BaseMessage {
  type: 'chat';
  chatter_idx: number;
  chatter_user_id: string;
  chatter_nickname: string;
  chatter_message: string;
  grade: string;
  role:  'broadcaster' | 'manager' | 'member' | 'viewer' | 'guest';
  color: string;
}

interface DonationMessage extends BaseMessage {
  type: 'donation';
  amount: number;
  donor_nickname: string;
  message?: string;
}

interface RecommendMessage extends BaseMessage {
  type: 'recommend';
  recommender_nickname: string;
}

export interface JwtDecode {
  idx: number;
  user_id: string;
  nickname: string;
  role: 'broadcaster' | 'manager' | 'member' | 'viewer' | 'guest';
  profile_img: string;
  is_guest: boolean;
  guest_id?: string;
}

export interface Viewer {
  user_idx: number;
  user_id: string;
  nickname: string;
  role: JwtDecode;
}


