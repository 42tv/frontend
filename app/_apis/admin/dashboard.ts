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
  /** 현재 라이브 집계 — 비공개 방송 포함, /admin/live 목록과 동일 소스 */
  live: { count: number; totalViewers: number };
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

/**
 * 관리자 미처리 건수 응답 (GET /admin/dashboard/pending-counts)
 * 사이드바 뱃지용 경량 엔드포인트 — summary와 달리 매출/후원 집계를 계산하지 않는다.
 */
export interface AdminPendingCounts {
  reports: { pending: number };
  inquiries: { pending: number };
}

/**
 * 관리자 미처리 신고·문의 건수 조회
 * GET /admin/dashboard/pending-counts
 */
export const getAdminPendingCounts = async (): Promise<AdminPendingCounts> => {
  const response = await api.get<ApiSuccessResponse<AdminPendingCounts>>(
    '/api/admin/dashboard/pending-counts',
  );
  return response.data.data;
};
