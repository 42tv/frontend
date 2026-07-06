import api from '../auto_refresh_axios';

export interface AdminCoinTopupActionResponse {
  success: boolean;
  message: string;
}

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
 * 충전 환불 (Bootpay 취소 연동, 멱등성 보장)
 * POST /admin/coin-topup/:topup_id/refund
 */
export const refundCoinTopup = async (
  topupId: number,
  reason: string,
): Promise<AdminCoinTopupActionResponse> => {
  const response = await api.post<AdminCoinTopupActionResponse>(
    `/api/admin/coin-topup/${topupId}/refund`,
    { reason },
  );
  return response.data;
};
