// Card and general UI interfaces
export interface CardData {
  id: number;
  user_idx: number;
  user_id: string;
  profile_img: string;
  nickname: string;
  hidden: boolean;
  is_live: boolean;
}

export interface FanLevel {
  id: number;
  name: string;
  min_donation: number;
  color: string;
  count?: number;
}
