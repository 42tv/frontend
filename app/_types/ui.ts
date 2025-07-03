// Card and general UI interfaces
export interface CardData {
  id: number;
  user_idx: number;
  profile_img: string; // imageUrl 추가
  user_id: string;
  hidden: boolean;
  is_live: boolean;
}

export interface FanLevel {
  id: number;
  name: string;
  min_donation: number;
  color: string;
}
