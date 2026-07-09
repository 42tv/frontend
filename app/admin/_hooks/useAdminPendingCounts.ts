'use client';
import { useCallback, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { getPendingInquiryCount } from '@/app/_apis/admin/inquiry';
import { getPendingReportCount } from '@/app/_apis/admin/report';

/**
 * 관리자 미처리 건수 즉시 갱신 이벤트.
 * 문의 답변/신고 처리 직후 폴링을 기다리지 않고 뱃지를 갱신할 때 사용한다.
 */
export const ADMIN_PENDING_REFRESH_EVENT = 'admin-pending-refresh';

export function notifyAdminPendingRefresh(): void {
  window.dispatchEvent(new Event(ADMIN_PENDING_REFRESH_EVENT));
}

const POLL_INTERVAL_MS = 30_000;

export interface AdminPendingCounts {
  pendingReports: number;
  pendingInquiries: number;
}

/**
 * 관리자 미처리 건수(신고/문의) 훅.
 * 라우트 변경·30초 폴링·갱신 이벤트로 재조회해 사이드바 뱃지를 최신 상태로 유지한다.
 */
export function useAdminPendingCounts(): AdminPendingCounts {
  const pathname = usePathname();
  const [pendingInquiries, setPendingInquiries] = useState<number>(0);
  const [pendingReports, setPendingReports] = useState<number>(0);

  const refresh = useCallback((): void => {
    getPendingInquiryCount()
      .then(setPendingInquiries)
      .catch(() => setPendingInquiries(0));
    getPendingReportCount()
      .then(setPendingReports)
      .catch(() => setPendingReports(0));
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh, pathname]);

  useEffect(() => {
    const intervalId = window.setInterval(refresh, POLL_INTERVAL_MS);
    window.addEventListener(ADMIN_PENDING_REFRESH_EVENT, refresh);
    return () => {
      window.clearInterval(intervalId);
      window.removeEventListener(ADMIN_PENDING_REFRESH_EVENT, refresh);
    };
  }, [refresh]);

  return { pendingReports, pendingInquiries };
}
