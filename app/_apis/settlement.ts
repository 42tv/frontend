import api from './auto_refresh_axios';
import type {
  SettlementsResponse,
  SettlementStatsResponse,
  CreateSettlementRequest,
  CreateSettlementResponse,
  SettlementStatus,
} from '../_types/settlement';

/**
 * 정산 요청
 * POST /api/settlement
 */
export const createSettlement = async (
  data: CreateSettlementRequest,
): Promise<CreateSettlementResponse> => {
  const response = await api.post<CreateSettlementResponse>('/api/settlement', data);
  return response.data;
};

/**
 * 내 정산 내역 조회
 * GET /api/settlement
 */
export const getMySettlements = async (params?: {
  status?: SettlementStatus;
  limit?: number;
  offset?: number;
}): Promise<SettlementsResponse> => {
  const response = await api.get<SettlementsResponse>('/api/settlement', {
    params,
  });
  return response.data;
};

/**
 * 내 정산 통계 조회
 * GET /api/settlement/stats
 */
export const getMySettlementStats = async (): Promise<SettlementStatsResponse> => {
  const response = await api.get<SettlementStatsResponse>('/api/settlement/stats');
  return response.data;
};
