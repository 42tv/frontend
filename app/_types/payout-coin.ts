export type PayoutStatus = 'PENDING' | 'MATURED' | 'BLOCKED' | 'IN_SETTLEMENT' | 'SETTLED';

export interface PayoutCoin {
  id: string;
  streamer_idx: number;
  donation_id: string;
  usage_id: string;
  topup_id: string;
  settlement_id: string | null;
  coin_amount: number;
  coin_value: number;
  status: PayoutStatus;
  settlement_ready_at: string;
  created_at: string;
}

export interface PayoutSummary {
  matured_amount: number;
  pending_amount: number;
  blocked_amount: number;
  in_settlement_amount: number;
  settled_amount: number;
  total_received: number;
}

export interface PayoutSummaryResponse {
  success: true;
  data: PayoutSummary;
  message: string;
}

export interface PayoutCoinsResponse {
  success: true;
  data: {
    payoutCoins: PayoutCoin[];
  };
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  message: string;
}
