import api from './auto_refresh_axios';
import type {
  PayoutSummaryResponse,
  PayoutCoinsResponse,
  PayoutStatus,
} from '../_types/payout-coin';

/**
 * 정산 요약 조회 (상태별 금액 합계)
 * GET /api/payout-coin/my/summary
 */
export const getPayoutSummary = async (): Promise<PayoutSummaryResponse> => {
  const response = await api.get<PayoutSummaryResponse>('/api/payout-coin/my/summary');
  return response.data;
};

/**
 * 정산 가능한 PayoutCoin 목록 조회 (MATURED)
 * GET /api/payout-coin/my/matured
 */
export const getMaturedPayoutCoins = async (params?: {
  limit?: number;
  offset?: number;
}): Promise<PayoutCoinsResponse> => {
  const response = await api.get<PayoutCoinsResponse>('/api/payout-coin/my/matured', {
    params,
  });
  return response.data;
};

/**
 * PayoutCoin 목록 조회 (상태 필터 가능)
 * GET /api/payout-coin/my
 */
export const getMyPayoutCoins = async (params?: {
  status?: PayoutStatus;
  limit?: number;
  offset?: number;
}): Promise<PayoutCoinsResponse> => {
  const response = await api.get<PayoutCoinsResponse>('/api/payout-coin/my', {
    params,
  });
  return response.data;
};
