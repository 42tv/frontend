import api from '../auto_refresh_axios';
import type { ApiSuccessResponse } from '@/app/_types/api';
import type {
  AdminCoinTopupListQuery,
  AdminCoinTopupsResponse,
  AdminCoinTopupRefundResult,
  AdminPaymentStats,
} from '@/app/_types/coin-topup';

export interface AdminCoinTopupActionResponse {
  success: boolean;
  message: string;
}

/**
 * 관리자 충전 내역 목록 (유저 정보 포함, 상태/검색 필터 + 페이지네이션)
 * GET /admin/coin-topup
 */
export const getAdminCoinTopups = async (
  params?: AdminCoinTopupListQuery,
): Promise<AdminCoinTopupsResponse> => {
  const response = await api.get<AdminCoinTopupsResponse>('/api/admin/coin-topup', { params });
  return response.data;
};

/**
 * 결제/정산 통계 (결제 금액, 충전/사용 코인, PayoutCoin 상태별 집계, 정산 신청 집계)
 * GET /admin/coin-topup/stats
 */
export const getAdminPaymentStats = async (): Promise<AdminPaymentStats> => {
  const response = await api.get<ApiSuccessResponse<AdminPaymentStats>>(
    '/api/admin/coin-topup/stats',
  );
  return response.data.data;
};

/**
 * 결제 실패 처리
 * POST /admin/coin-topup/:transaction_id/fail
 */
export const failCoinTopup = async (transactionId: string): Promise<AdminCoinTopupActionResponse> => {
  const response = await api.post<AdminCoinTopupActionResponse>(
    `/api/admin/coin-topup/${transactionId}/fail`,
  );
  return response.data;
};

/**
 * 충전 환불 — 사용하고 남은 잔여 코인만큼 부분 환불 (Bootpay 부분 취소 연동, 멱등성 보장)
 * POST /admin/coin-topup/:topup_id/refund
 */
export const refundCoinTopup = async (
  topupId: string,
  reason: string,
): Promise<ApiSuccessResponse<AdminCoinTopupRefundResult>> => {
  const response = await api.post<ApiSuccessResponse<AdminCoinTopupRefundResult>>(
    `/api/admin/coin-topup/${topupId}/refund`,
    { reason },
  );
  return response.data;
};
