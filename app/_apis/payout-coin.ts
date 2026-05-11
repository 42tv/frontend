import api from './auto_refresh_axios';
import type {
  PayoutSummaryResponse,
  PayoutCoinsResponse,
  PayoutStatus,
} from '../_types/payout-coin';

/**
 * 정산 요약 조회 (상태별 금액 합계)
 * GET /api/payout-coin/summary
 */
export async function getPayoutSummary(): Promise<PayoutSummaryResponse> {
  const response = await api.get<PayoutSummaryResponse>('/api/payout-coin/summary');
  return response.data;
}

/**
 * 정산 신청 가능한 PayoutCoin 목록 조회 (AVAILABLE)
 * GET /api/payout-coin/available
 */
export async function getAvailablePayoutCoins(params?: {
  limit?: number;
  offset?: number;
}): Promise<PayoutCoinsResponse> {
  const response = await api.get<PayoutCoinsResponse>('/api/payout-coin/available', {
    params,
  });
  return response.data;
}

/**
 * PayoutCoin 목록 조회 (상태 필터 가능)
 * GET /api/payout-coin
 */
export async function getMyPayoutCoins(params?: {
  status?: PayoutStatus;
  limit?: number;
  offset?: number;
}): Promise<PayoutCoinsResponse> {
  const response = await api.get<PayoutCoinsResponse>('/api/payout-coin', {
    params,
  });
  return response.data;
}
