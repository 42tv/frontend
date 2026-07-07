import api from '../auto_refresh_axios';
import type { BannedWord, BannedWordAction } from '../../_types/admin-console';

/**
 * 금칙어 목록 조회
 * GET /admin/banned-words
 */
export const getBannedWords = async (): Promise<BannedWord[]> => {
  const response = await api.get<{ success: boolean; data: BannedWord[] }>(
    '/api/admin/banned-words',
  );
  return response.data.data ?? [];
};

/**
 * 금칙어 등록 — 중복 시 400, 등록 즉시 Redis 캐시 무효화 (전 서버 반영)
 * POST /admin/banned-words
 */
export const createBannedWord = async (
  word: string,
  action: BannedWordAction,
): Promise<BannedWord> => {
  const response = await api.post<{ success: boolean; data: BannedWord }>(
    '/api/admin/banned-words',
    { word, action },
  );
  return response.data.data;
};

/**
 * 금칙어 삭제
 * DELETE /admin/banned-words/:id
 */
export const deleteBannedWord = async (id: number): Promise<void> => {
  await api.delete(`/api/admin/banned-words/${id}`);
};

/**
 * 전체 공지 — 모든 라이브 채팅방에 시스템 메시지 전파 (Redis Pub/Sub)
 * POST /admin/chat/broadcast
 */
export const broadcastGlobalNotice = async (message: string): Promise<void> => {
  await api.post('/api/admin/chat/broadcast', { message });
};
