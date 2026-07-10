// Notification badge summary types

/**
 * 개인 뱃지 요약 응답 (GET /api/user/me/notification)
 * 관리자 미처리 건수는 별도 대시보드 API(GET /api/admin/dashboard/summary)에서 조회한다.
 */
export interface NotificationSummary {
  unread_posts: number;
  unread_inquiries: number;
}
