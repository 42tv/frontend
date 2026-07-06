import api from '../auto_refresh_axios';
import type { SanctionType } from '../../_types/admin-console';

export interface CreateSanctionParams {
  userIdx: number;
  type: SanctionType;
  reason: string;
}

/**
 * 제재 등록 — 감사 로그 기록, 활성 세션 강제 종료 포함
 * 만료 개념 없음: 관리자가 해제하기 전까지 유지된다
 * POST /admin/sanctions
 */
export const createSanction = async (params: CreateSanctionParams): Promise<void> => {
  await api.post('/api/admin/sanctions', params);
};

/**
 * 제재 해제 — 해제 사유 필수
 * POST /admin/sanctions/:id/release
 */
export const releaseSanction = async (id: number, reason: string): Promise<void> => {
  await api.post(`/api/admin/sanctions/${id}/release`, { reason });
};
