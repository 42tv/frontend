import api from './auto_refresh_axios';
import { ApiSuccessResponse } from '@/app/_types/api';
import type { NotificationSummary } from '@/app/_types/notification';

/**
 * 개인 뱃지 요약 조회 — 미읽음 쪽지/문의 답변 개수
 * GET /user/me/notification
 */
export const getNotificationSummary = async (): Promise<NotificationSummary> => {
  const response = await api.get<ApiSuccessResponse<NotificationSummary>>(
    '/api/user/me/notification',
  );
  return {
    unread_posts: response.data.data?.unread_posts ?? 0,
    unread_inquiries: response.data.data?.unread_inquiries ?? 0,
  };
};
