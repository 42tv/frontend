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
  /** 환불된 코인 수 (REFUNDED 시 환불 시점 잔여분이 이관됨) */
  refunded_coins: number;
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

// ── 관리자 결제/정산 콘솔 ──────────────────────────────────────────────────

export interface AdminTopupUser {
  idx: number;
  user_id: string;
  nickname: string;
}

/** 관리자 충전 내역 행 — 유저 정보 포함 (탈퇴 유저는 null) */
export interface AdminCoinTopup extends CoinTopup {
  user: AdminTopupUser | null;
}

export interface AdminCoinTopupListQuery {
  status?: TopupStatus;
  /** user_id / 닉네임 검색 */
  search?: string;
  page?: number;
  limit?: number;
}

// 관리자 충전 내역 목록 응답 (GET /admin/coin-topup)
export interface AdminCoinTopupsResponse {
  success: true;
  data: {
    topups: AdminCoinTopup[];
  };
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  message: string;
}

/** 잔여 코인 부분 환불 결과 (POST /admin/coin-topup/:topup_id/refund) */
export interface AdminCoinTopupRefundResult {
  topup_id: string;
  refunded_coins: number;
  refunded_amount: number;
  status: TopupStatus;
}

/** 결제/정산 통계 (GET /admin/coin-topup/stats) */
export interface AdminPaymentStats {
  payments: {
    total_paid_amount: number;
    total_paid_count: number;
    refunded_amount: number;
    refunded_count: number;
  };
  coins: {
    total_charged_coins: number;
    total_used_coins: number;
    total_remaining_coins: number;
    total_refunded_coins: number;
  };
  payout: {
    waiting_coins: number;
    available_coins: number;
    blocked_coins: number;
    in_settlement_coins: number;
    completed_coins: number;
  };
  settlements: {
    pending_count: number;
    pending_amount: number;
    paid_count: number;
    paid_amount: number;
  };
}
