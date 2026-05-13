export type SettlementStatus = 'PENDING' | 'APPROVED' | 'PAID' | 'REJECTED';

export interface PayoutCoinBrief {
  id: string;
  coin_value: number;
  status: string;
}

export interface Settlement {
  id: string;
  streamer_idx: number;
  total_value: number;
  fee_amount: number;
  payout_amount: number;
  status: SettlementStatus;
  reject_reason: string | null;
  requested_at: string;
  approved_at: string | null;
  paid_at: string | null;
  rejected_at: string | null;
  created_at: string;
  payoutCoins?: PayoutCoinBrief[];
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
  message: string;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface SettlementStatsResponse {
  success: true;
  data: SettlementStats;
  message: string;
}

export interface SettlementDetailResponse {
  success: true;
  data: Settlement;
  message: string;
}

export interface CreateSettlementRequest {
  amount: number;
}

export interface CreateSettlementResponse {
  success: true;
  data: Settlement;
  message: string;
}

// ── 정산 계좌 ──────────────────────────────────────────────────────────────

export type SettlementAccountVerificationStatus = 'UNVERIFIED' | 'PENDING' | 'VERIFIED' | 'FAILED';

export interface SettlementAccount {
  id: string;
  bank_code: string;
  bank_name: string;
  account_number_masked: string;
  holder_name_masked: string | null;
  verification_status: SettlementAccountVerificationStatus;
  verified_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface SettlementAccountResponse {
  success: true;
  data: SettlementAccount;
  message: string;
}

export interface UpsertSettlementAccountRequest {
  bank_code: string;
  bank_name: string;
  account_number: string;
  holder_name?: string;
}

export interface VerifySettlementAccountResponse {
  success: true;
  data: {
    verification_status: string;
    failure_reason: string | null;
  };
  message: string;
}
