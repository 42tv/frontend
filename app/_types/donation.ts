export interface DonationStatsData {
  total_coin_amount: number;
  total_coin_value: number;
  donation_count: number;
  average_coin_amount: number;
}

export interface DonationRankingItem {
  rank: number;
  donor: {
    idx: number;
    nickname: string;
    user_id: string;
    profile_img: string;
  };
  total_coin_amount: number;
  total_coin_value: number;
  donation_count: number;
}

export interface DonationTrendItem {
  period: string;
  total_coin_amount: number;
  total_coin_value: number;
  donation_count: number;
}

export type DonationTrendUnit = 'day' | 'week' | 'month';
