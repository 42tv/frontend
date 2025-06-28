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
  role: string;
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

interface Viewer {
  user_idx: number;
  user_id: string;
  nickname: string;
  type: 'viewer' | 'broadcaster' | 'manager';
}



