import api from '../auto_refresh_axios';
import type { PayoutCoin, PayoutStatus, PayoutCoinsResponse } from '../../_types/payout-coin';

export interface MatureResult {
  total: number;
  matured: number;
  blocked: number;
}

/**
 * WAITING → AVAILABLE/BLOCKED 가용성 갱신 트리거 (수동 실행)
 * POST /api/admin/payout-coin/refresh-availability
 */
export const refreshPayoutAvailability = async (): Promise<MatureResult> => {
  const response = await api.post<{ success: boolean; data: MatureResult }>(
    '/api/admin/payout-coin/refresh-availability',
  );
  return response.data.data;
};

/**
 * 특정 스트리머의 PayoutCoin 목록 조회
 * GET /payout-coin/admin/streamers/:streamerIdx
 */
export const getStreamerPayoutCoins = async (
  streamerIdx: number,
  params?: { status?: PayoutStatus; limit?: number; offset?: number },
): Promise<PayoutCoinsResponse> => {
  const response = await api.get<PayoutCoinsResponse>(
    `/api/payout-coin/admin/streamers/${streamerIdx}`,
    { params },
  );
  return response.data;
};

/**
 * BLOCKED 상태 해제
 * POST /payout-coin/admin/:id/unblock
 */
export const unblockPayoutCoin = async (id: string): Promise<PayoutCoin> => {
  const response = await api.post<{ success: boolean; data: PayoutCoin }>(
    `/api/payout-coin/admin/${id}/unblock`,
  );
  return response.data.data;
};

/**
 * PayoutCoin 상세 조회
 * GET /payout-coin/admin/:id
 */
export const getPayoutCoinDetail = async (id: string): Promise<PayoutCoin> => {
  const response = await api.get<{ success: boolean; data: PayoutCoin }>(
    `/api/payout-coin/admin/${id}`,
  );
  return response.data.data;
};
