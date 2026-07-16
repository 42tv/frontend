import api from './auto_refresh_axios';
import {
  CoinTopupsResponse,
  RefundRequestResponse,
  MyRefundRequestsResponse,
  RefundRequestCancelResponse,
} from '../_types/coin-topup';

/**
 * 내 코인 충전(구매) 내역 조회
 * GET /api/coin-topups/me
 * @param limit 조회할 내역 개수 (기본값: 20)
 */
export const getMyCoinTopups = async (limit: number = 20): Promise<CoinTopupsResponse> => {
  const response = await api.get<CoinTopupsResponse>('/api/coin-topups/me', {
    params: { limit },
  });
  return response.data;
};

/**
 * 청약철회(환불) 요청 접수 — 즉시 환불이 아니라 관리자 승인 후 환불이 진행됨.
 * 접수 중인 충전 건의 코인은 사용 불가 상태(REFUND_REQUESTED)가 된다.
 * POST /api/coin-topups/me/:topup_id/refund-request
 * @param topupId 충전 건 ID
 * @param userReason 환불 사유 (선택, 최대 500자)
 */
export const createTopupRefundRequest = async (
  topupId: string,
  userReason?: string,
): Promise<RefundRequestResponse> => {
  const response = await api.post<RefundRequestResponse>(
    `/api/coin-topups/me/${topupId}/refund-request`,
    userReason ? { user_reason: userReason } : {},
  );
  return response.data;
};

/**
 * 내 환불 요청 목록 조회 — requested_at 내림차순(최신순)
 * GET /api/coin-topups/me/refund-requests
 * @param limit 조회할 내역 개수 (기본값: 20)
 */
export const getMyRefundRequests = async (limit: number = 20): Promise<MyRefundRequestsResponse> => {
  const response = await api.get<MyRefundRequestsResponse>('/api/coin-topups/me/refund-requests', {
    params: { limit },
  });
  return response.data;
};

/**
 * 환불 요청 취소 — 승인 전(PENDING)에만 가능, 취소 시 코인 다시 사용 가능
 * POST /api/coin-topups/me/refund-requests/:request_id/cancel
 * @param requestId 환불 요청 ID
 */
export const cancelRefundRequest = async (requestId: string): Promise<RefundRequestCancelResponse> => {
  const response = await api.post<RefundRequestCancelResponse>(
    `/api/coin-topups/me/refund-requests/${requestId}/cancel`,
  );
  return response.data;
};
