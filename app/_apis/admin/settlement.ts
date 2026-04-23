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
 * GET /settlement/admin/pending
 */
export const getPendingSettlements = async (): Promise<SettlementsResponse> => {
  const response = await api.get<SettlementsResponse>('/api/settlement/admin/pending');
  return response.data;
};

/**
 * 전체 정산 목록 (필터 가능)
 * GET /settlement/admin
 */
export const getAllSettlements = async (
  params?: AdminSettlementQuery,
): Promise<SettlementsResponse> => {
  const response = await api.get<SettlementsResponse>('/api/settlement/admin', { params });
  return response.data;
};

/**
 * 정산 상세 조회
 * GET /settlement/admin/:id
 */
export const getSettlementDetail = async (id: string): Promise<Settlement> => {
  const response = await api.get<{ success: boolean; data: Settlement }>(
    `/api/settlement/admin/${id}`,
  );
  return response.data.data;
};

/**
 * 정산 승인 (PENDING → APPROVED)
 * POST /settlement/admin/:id/approve
 */
export const approveSettlement = async (id: string): Promise<Settlement> => {
  const response = await api.post<{ success: boolean; data: Settlement }>(
    `/api/settlement/admin/${id}/approve`,
  );
  return response.data.data;
};

/**
 * 지급 완료 처리 (APPROVED → PAID)
 * POST /settlement/admin/:id/pay
 */
export const paySettlement = async (id: string): Promise<Settlement> => {
  const response = await api.post<{ success: boolean; data: Settlement }>(
    `/api/settlement/admin/${id}/pay`,
  );
  return response.data.data;
};

/**
 * 정산 거절 (PENDING → REJECTED, PayoutCoin 롤백)
 * POST /settlement/admin/:id/reject
 */
export const rejectSettlement = async (id: string, reason: string): Promise<Settlement> => {
  const response = await api.post<{ success: boolean; data: Settlement }>(
    `/api/settlement/admin/${id}/reject`,
    { reason },
  );
  return response.data.data;
};

/**
 * 특정 스트리머 정산 내역
 * GET /settlement/admin/streamers/:streamerIdx
 */
export const getStreamerSettlements = async (
  streamerIdx: number,
  params?: { limit?: number; offset?: number },
): Promise<SettlementsResponse> => {
  const response = await api.get<SettlementsResponse>(
    `/api/settlement/admin/streamers/${streamerIdx}`,
    { params },
  );
  return response.data;
};

/**
 * 특정 스트리머 정산 통계
 * GET /settlement/admin/streamers/:streamerIdx/stats
 */
export const getStreamerSettlementStats = async (
  streamerIdx: number,
): Promise<SettlementStats> => {
  const response = await api.get<SettlementStatsResponse>(
    `/api/settlement/admin/streamers/${streamerIdx}/stats`,
  );
  return response.data.data;
};
