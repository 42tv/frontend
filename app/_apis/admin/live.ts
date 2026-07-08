import api from '../auto_refresh_axios';
import type { AdminLiveStream } from '../../_types/admin-console';

/**
 * 관리자 전체 라이브 목록 조회 (비공개 방송 포함)
 * GET /admin/live
 */
export const getAdminLiveList = async (): Promise<AdminLiveStream[]> => {
  const response = await api.get<{ success: boolean; data: AdminLiveStream[] }>(
    '/api/admin/live',
  );
  return response.data.data ?? [];
};

/**
 * 방송 강제 종료 — 시청자 전원에게 종료 이벤트 전파
 * POST /admin/live/:broadcasterIdx/end
 */
export const forceEndBroadcast = async (
  broadcasterIdx: number,
  reason?: string,
): Promise<void> => {
  await api.post(`/api/admin/live/${broadcasterIdx}/end`, { reason });
};

/**
 * 방송별 관리자 공지 — 해당 방송 채팅방에만 시스템 메시지 전파
 * POST /admin/live/:broadcasterIdx/notice
 */
export const sendLiveNotice = async (
  broadcasterIdx: number,
  message: string,
): Promise<void> => {
  await api.post(`/api/admin/live/${broadcasterIdx}/notice`, { message });
};

/**
 * 블라인드(NCP 라이브 커튼) 시작 — 시청자 화면을 커튼 콘텐츠로 가림 (최대 10분 유지)
 * POST /admin/live/:broadcasterIdx/curtain/start
 */
export const startCurtain = async (
  broadcasterIdx: number,
  reason?: string,
): Promise<void> => {
  await api.post(`/api/admin/live/${broadcasterIdx}/curtain/start`, { reason });
};

/**
 * 블라인드(NCP 라이브 커튼) 해제 — 원 송출 화면으로 즉시 복귀
 * POST /admin/live/:broadcasterIdx/curtain/stop
 */
export const stopCurtain = async (broadcasterIdx: number): Promise<void> => {
  await api.post(`/api/admin/live/${broadcasterIdx}/curtain/stop`, {});
};
