import api from './auto_refresh_axios';
import { CoinTopupsResponse } from '../_types/coin-topup';

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
