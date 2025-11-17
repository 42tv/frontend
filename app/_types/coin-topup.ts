// CoinTopup 관련 타입 정의

export type TopupStatus = 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED' | 'FROZEN';

export interface CoinTopup {
  id: string;
  transaction_id: string;
  user_idx: number;
  product_id: number;
  product_name: string;
  base_coins: number;
  bonus_coins: number;
  total_coins: number;
  remaining_coins: number;
  paid_amount: number;
  coin_unit_price: number;
  status: TopupStatus;
  topped_up_at: string;
}

// 코인 충전 내역 목록 응답
export interface CoinTopupsResponse {
  success: true;
  data: {
    topups: CoinTopup[];
  };
  message: string;
}
