import api from '../auto_refresh_axios';
import type {
  Settlement,
  SettlementStatus,
  SettlementStats,
  SettlementsResponse,
  SettlementStatsResponse,
} from '../../_types/settlement';

export interface AdminSettlementQuery {
  status?: SettlementStatus;
  streamerIdx?: number;
  startDate?: string;
  endDate?: string;
  limit?: number;
  offset?: number;
}

/**
 * 승인 대기 정산 목록
 * GET /admin/settlement/pending
 */
export const getPendingSettlements = async (): Promise<SettlementsResponse> => {
  const response = await api.get<{ success: boolean; data: Settlement[]; message: string }>(
    '/api/admin/settlement/pending',
  );
  const settlements = response.data.data ?? [];
  return {
    success: true,
    data: { settlements },
    message: response.data.message,
    pagination: {
      page: 1,
      limit: settlements.length,
      total: settlements.length,
      totalPages: 1,
    },
  };
};

/**
 * 전체 정산 목록 (필터 가능)
 * GET /admin/settlement
 */
export const getAllSettlements = async (
  params?: AdminSettlementQuery,
): Promise<SettlementsResponse> => {
  const response = await api.get<SettlementsResponse>('/api/admin/settlement', { params });
  return response.data;
};

/**
 * 정산 상세 조회
 * GET /admin/settlement/:id
 */
export const getSettlementDetail = async (id: string): Promise<Settlement> => {
  const response = await api.get<{ success: boolean; data: Settlement }>(
    `/api/admin/settlement/${id}`,
  );
  return response.data.data;
};

/**
 * 정산 승인 (PENDING → APPROVED → PAID)
 * POST /admin/settlement/:id/approve
 */
export const approveSettlement = async (id: string): Promise<Settlement> => {
  const response = await api.post<{ success: boolean; data: Settlement }>(
    `/api/admin/settlement/${id}/approve`,
  );
  return response.data.data;
};

/**
 * 정산 지급 완료 처리 (APPROVED → PAID)
 * POST /admin/settlement/:id/pay
 */
export const paySettlement = async (id: string): Promise<Settlement> => {
  const response = await api.post<{ success: boolean; data: Settlement }>(
    `/api/admin/settlement/${id}/pay`,
  );
  return response.data.data;
};

/**
 * 정산 거절 (PENDING → REJECTED, PayoutCoin 롤백)
 * POST /admin/settlement/:id/reject
 */
export const rejectSettlement = async (id: string, reason: string): Promise<Settlement> => {
  const response = await api.post<{ success: boolean; data: Settlement }>(
    `/api/admin/settlement/${id}/reject`,
    { reason },
  );
  return response.data.data;
};

/**
 * 특정 스트리머 정산 내역
 * GET /admin/settlement/streamers/:streamerIdx
 */
export const getStreamerSettlements = async (
  streamerIdx: number,
  params?: { limit?: number; offset?: number },
): Promise<SettlementsResponse> => {
  const response = await api.get<SettlementsResponse>(
    `/api/admin/settlement/streamers/${streamerIdx}`,
    { params },
  );
  return response.data;
};

/**
 * 특정 스트리머 정산 통계
 * GET /admin/settlement/streamers/:streamerIdx/stats
 */
export const getStreamerSettlementStats = async (
  streamerIdx: number,
): Promise<SettlementStats> => {
  const response = await api.get<SettlementStatsResponse>(
    `/api/admin/settlement/streamers/${streamerIdx}/stats`,
  );
  return response.data.data;
};
