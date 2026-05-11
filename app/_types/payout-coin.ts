export const PAYOUT_STATUS_LABEL = {
  WAITING: '정산 대기',
  AVAILABLE: '정산 신청 가능',
  BLOCKED: '정산 보류',
  IN_SETTLEMENT: '정산중',
  COMPLETED: '정산완료',
} as const;

export type PayoutStatus = keyof typeof PAYOUT_STATUS_LABEL;

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
  available_amount: number;
  waiting_amount: number;
  blocked_amount: number;
  in_settlement_amount: number;
  completed_amount: number;
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
