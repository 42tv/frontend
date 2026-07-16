// CoinTopup 관련 타입 정의

export type TopupStatus =
  | 'PENDING'
  | 'COMPLETED'
  | 'FAILED'
  | 'REFUNDED'
  | 'REFUND_REQUESTED'
  | 'FROZEN';

/** 환불 요청 상태 — 접수(PENDING) 후 관리자 승인/거절 또는 사용자 취소 */
export type RefundRequestStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELED';

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

/** 환불 요청 (POST /api/coin-topups/me/:topup_id/refund-request 응답 data) */
export interface RefundRequest {
  id: string;
  topup_id: string;
  user_idx: number;
  status: RefundRequestStatus;
  /** 접수 시점 잔여 코인 (환불 대상) */
  remaining_coins: number;
  /** 예상 환불액 (원) — 잔여코인 × 단가, 실결제액 상한 */
  expected_amount: number;
  user_reason: string | null;
  /** REJECTED일 때 거절 사유 — 사용자에게 노출 */
  reject_reason: string | null;
  processed_admin_idx: number | null;
  requested_at: string;
  /** 승인/거절/취소 처리 시각 */
  processed_at: string | null;
}

// 환불 요청 접수 응답
export interface RefundRequestResponse {
  success: true;
  data: RefundRequest;
  message: string;
}

/** 내 환불 요청 목록의 충전 건 요약 */
export interface RefundRequestTopupSummary {
  id: string;
  product_name: string;
  total_coins: number;
  paid_amount: number;
  topped_up_at: string;
}

/** 내 환불 요청 행 (GET /api/coin-topups/me/refund-requests) */
export interface MyRefundRequest extends RefundRequest {
  topup: RefundRequestTopupSummary;
}

// 내 환불 요청 목록 응답 — requested_at 내림차순(최신순)
export interface MyRefundRequestsResponse {
  success: true;
  data: {
    requests: MyRefundRequest[];
  };
  message: string;
}

/** 환불 요청 취소 결과 (POST /api/coin-topups/me/refund-requests/:request_id/cancel) */
export interface RefundRequestCancelResult {
  request_id: string;
  topup_id: string;
  status: RefundRequestStatus;
}

// 환불 요청 취소 응답
export interface RefundRequestCancelResponse {
  success: true;
  data: RefundRequestCancelResult;
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

/** 관리자 환불 요청 행의 충전 건 요약 */
export interface AdminRefundRequestTopupSummary {
  id: string;
  product_name: string;
  total_coins: number;
  remaining_coins: number;
  paid_amount: number;
  status: TopupStatus;
  topped_up_at: string;
}

/** 관리자 환불 요청 행 (GET /admin/coin-topup/refund-requests) */
export interface AdminRefundRequest extends RefundRequest {
  user: AdminTopupUser | null;
  topup: AdminRefundRequestTopupSummary;
}

export interface AdminRefundRequestListQuery {
  status?: RefundRequestStatus;
  page?: number;
  limit?: number;
}

// 관리자 환불 요청 목록 응답 — requested_at 오름차순(오래 대기한 요청 우선)
export interface AdminRefundRequestsResponse {
  success: true;
  data: {
    requests: AdminRefundRequest[];
  };
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  message: string;
}

/** 환불 요청 승인 결과 — 실제 환불(PG 취소) 실행 (POST /admin/coin-topup/refund-requests/:request_id/approve) */
export interface AdminRefundApproveResult {
  topup_id: string;
  refunded_coins: number;
  refunded_amount: number;
  status: TopupStatus;
  request_id: string;
}

/** 환불 요청 거절 결과 (POST /admin/coin-topup/refund-requests/:request_id/reject) */
export interface AdminRefundRejectResult {
  request_id: string;
  topup_id: string;
  status: RefundRequestStatus;
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
