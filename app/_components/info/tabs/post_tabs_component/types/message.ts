export interface Post {
  id: number;
  message: string;
  sender: {
    idx: number;
    userId: string;
    nickname: string;
  };
  recipient: {
    idx: number;
    userId: string;
    nickname: string;
  }
  is_read: boolean;
  sentAt: string;
  readAt: string;
}

export interface PostSetting {
  fanLevels: FanLevel[];
  minFanLevel: number | null;
}

export interface FanLevel {
  id: number;
  name: string;
  min_donation: number;
}