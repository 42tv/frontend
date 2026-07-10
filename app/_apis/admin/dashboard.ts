import api from '../auto_refresh_axios';
import { ApiSuccessResponse } from '@/app/_types/api';

/**
 * 관리자 대시보드 집계 응답 (GET /admin/dashboard/summary)
 * Cache-Control: no-store 로 항상 최신값이 내려온다.
 */
export interface AdminDashboardSummary {
  sales: { today: number; week: number; month: number; todayRefund: number };
  donations: { todayCoins: number; weekCoins: number };
  users: { todaySignups: number; todayWithdrawals: number };
  reports: { pending: number };
  inquiries: { pending: number };
}

/**
 * 관리자 대시보드 집계 조회 — 매출/후원/가입 통계 + 미처리 신고·문의 건수
 * GET /admin/dashboard/summary
 */
export const getAdminDashboardSummary = async (): Promise<AdminDashboardSummary> => {
  const response = await api.get<ApiSuccessResponse<AdminDashboardSummary>>(
    '/api/admin/dashboard/summary',
  );
  return response.data.data;
};
