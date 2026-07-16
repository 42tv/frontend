'use client';
import { useCallback, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { getAdminPendingCounts } from '@/app/_apis/admin/dashboard';

/**
 * 관리자 미처리 건수 즉시 갱신 이벤트.
 * 문의 답변/신고 처리 직후 폴링을 기다리지 않고 뱃지를 갱신할 때 사용한다.
 */
export const ADMIN_PENDING_REFRESH_EVENT = 'admin-pending-refresh';

export function notifyAdminPendingRefresh(): void {
  window.dispatchEvent(new Event(ADMIN_PENDING_REFRESH_EVENT));
}

export interface AdminPendingCounts {
  pendingReports: number;
  pendingInquiries: number;
  pendingRefundRequests: number;
}

/**
 * 관리자 미처리 건수(신고/문의/환불 요청) 훅.
 * 경량 pending-counts API로 대기 건수만 조회하며,
 * 라우트 변경·갱신 이벤트로 재조회해 사이드바 뱃지를 최신 상태로 유지한다.
 */
export function useAdminPendingCounts(): AdminPendingCounts {
  const pathname = usePathname();
  const [pendingInquiries, setPendingInquiries] = useState<number>(0);
  const [pendingReports, setPendingReports] = useState<number>(0);
  const [pendingRefundRequests, setPendingRefundRequests] = useState<number>(0);

  const refresh = useCallback((): void => {
    getAdminPendingCounts()
      .then((counts) => {
        setPendingReports(counts.reports.pending);
        setPendingInquiries(counts.inquiries.pending);
        setPendingRefundRequests(counts.refundRequests?.pending ?? 0);
      })
      .catch(() => {
        setPendingReports(0);
        setPendingInquiries(0);
        setPendingRefundRequests(0);
      });
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh, pathname]);

  useEffect(() => {
    window.addEventListener(ADMIN_PENDING_REFRESH_EVENT, refresh);
    return () => window.removeEventListener(ADMIN_PENDING_REFRESH_EVENT, refresh);
  }, [refresh]);

  return { pendingReports, pendingInquiries, pendingRefundRequests };
}
