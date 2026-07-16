import api from '../auto_refresh_axios';
import { ApiSuccessResponse } from '@/app/_types/api';
import type {
  ReportAction,
  ReportDetail,
  ReportListItem,
  ReportStatus,
  ReportTargetType,
} from '../../_types/admin-console';

export interface AdminReportsPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface AdminReportsParams {
  status?: ReportStatus;
  targetType?: ReportTargetType;
  reportedIdx?: number;
  page?: number;
  limit?: number;
}

export interface AdminReportsResult {
  reports: ReportListItem[];
  pagination: AdminReportsPagination;
}

/**
 * 신고 목록 조회 (status/targetType/reportedIdx 필터 + 페이지네이션)
 * GET /admin/reports
 */
export const getAdminReports = async (
  params: AdminReportsParams,
): Promise<AdminReportsResult> => {
  const response = await api.get<
    ApiSuccessResponse<{ reports: ReportListItem[] }> & {
      pagination?: AdminReportsPagination;
    }
  >('/api/admin/reports', { params });
  return {
    reports: response.data.data?.reports ?? [],
    pagination:
      response.data.pagination ?? {
        page: 1,
        limit: params.limit ?? 20,
        total: 0,
        totalPages: 1,
      },
  };
};

/**
 * 미처리(접수) 신고 건수 조회 — 목록 API의 pagination.total 활용
 */
export const getPendingReportCount = async (): Promise<number> => {
  const result = await getAdminReports({
    status: 'PENDING',
    page: 1,
    limit: 1,
  });
  return result.pagination.total;
};

/**
 * 신고 상세 조회 (피신고자 제재 이력 포함)
 * GET /admin/reports/:id
 */
export const getAdminReport = async (id: number): Promise<ReportDetail> => {
  const response = await api.get<ApiSuccessResponse<ReportDetail>>(
    `/api/admin/reports/${id}`,
  );
  return response.data.data;
};

/**
 * 신고 처리 — 기각 외 액션은 제재 이력에 자동 기록, END_BROADCAST는 방송 즉시 종료
 * POST /admin/reports/:id/resolve
 */
export const resolveReport = async (
  id: number,
  action: ReportAction,
  reason: string,
): Promise<void> => {
  await api.post(`/api/admin/reports/${id}/resolve`, { action, reason });
};
