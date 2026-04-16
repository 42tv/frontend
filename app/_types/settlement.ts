export type SettlementStatus = 'PENDING' | 'APPROVED' | 'PAID' | 'REJECTED';

export interface Settlement {
  id: string;
  streamer_idx: number;
  period_start: string;
  period_end: string;
  total_value: number;
  fee_amount: number;
  payout_amount: number;
  status: SettlementStatus;
  payout_method: string | null;
  payout_account: string | null;
  admin_memo: string | null;
  reject_reason: string | null;
  approved_at: string | null;
  paid_at: string | null;
  rejected_at: string | null;
  created_at: string;
}

export interface SettlementStats {
  total_paid_amount: number;
  total_paid_count: number;
  pending_amount: number;
  pending_count: number;
  approved_amount: number;
  approved_count: number;
}

export interface SettlementsResponse {
  success: true;
  data: {
    settlements: Settlement[];
  };
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  message: string;
}

export interface SettlementStatsResponse {
  success: true;
  data: SettlementStats;
  message: string;
}

export interface CreateSettlementRequest {
  payout_coin_ids: string[];
  payout_method?: string;
  payout_account?: string;
}

export interface CreateSettlementResponse {
  success: true;
  data: Settlement;
  message: string;
}
