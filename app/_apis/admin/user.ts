import api from '../auto_refresh_axios';
import type {
  AdminPrivacyField,
  AdminUserDetailData,
  AdminUserListItem,
  AdminUserSearchParams,
} from '../../_types/admin-console';

export interface AdminPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface AdminUsersResult {
  users: AdminUserListItem[];
  pagination: AdminPagination;
}

/**
 * 회원 검색/목록 조회 (검색 + 필터 + 페이징)
 * GET /admin/users
 */
export const getAdminUsers = async (
  params: AdminUserSearchParams,
): Promise<AdminUsersResult> => {
  const response = await api.get<{
    success: boolean;
    data: { users: AdminUserListItem[] };
    pagination: AdminPagination;
  }>('/api/admin/users', { params });
  return {
    users: response.data.data?.users ?? [],
    pagination:
      response.data.pagination ?? { page: 1, limit: 20, total: 0, totalPages: 1 },
  };
};

/**
 * 회원 상세 조회 (개인정보는 마스킹 상태로 반환)
 * GET /admin/users/:idx
 */
export const getAdminUserDetail = async (idx: number): Promise<AdminUserDetailData> => {
  const response = await api.get<{ success: boolean; data: AdminUserDetailData }>(
    `/api/admin/users/${idx}`,
  );
  return response.data.data;
};

/**
 * 개인정보 원문 열람 — 사유 필수, PRIVACY_VIEW 감사 로그 기록
 * POST /admin/users/:idx/privacy-view
 */
export const viewPrivacyField = async (
  idx: number,
  field: AdminPrivacyField,
  reason: string,
): Promise<string | null> => {
  const response = await api.post<{
    success: boolean;
    data: { field: AdminPrivacyField; value: string | null };
  }>(`/api/admin/users/${idx}/privacy-view`, { field, reason });
  return response.data.data.value;
};

/**
 * 닉네임 강제 변경 (부적절 닉네임 대응)
 * PATCH /admin/users/:idx/nickname
 */
export const forceUpdateNickname = async (
  idx: number,
  nickname: string,
  reason: string,
): Promise<void> => {
  await api.patch(`/api/admin/users/${idx}/nickname`, { nickname, reason });
};

/**
 * 프로필 이미지 강제 삭제 (부적절 이미지 대응)
 * DELETE /admin/users/:idx/profile-image
 */
export const forceDeleteProfileImage = async (
  idx: number,
  reason?: string,
): Promise<void> => {
  await api.delete(`/api/admin/users/${idx}/profile-image`, { data: { reason } });
};

/**
 * 관리자 권한 부여/회수
 * PATCH /admin/users/:idx/admin-role
 */
export const toggleAdminRole = async (
  idx: number,
  isAdmin: boolean,
  reason: string,
): Promise<void> => {
  await api.patch(`/api/admin/users/${idx}/admin-role`, { isAdmin, reason });
};

/**
 * 강제 탈퇴 — 탈퇴 플로우 실행 (NCP 채널 정리 포함)
 * POST /admin/users/:idx/force-delete
 */
export const forceDeleteUser = async (idx: number, reason: string): Promise<void> => {
  await api.post(`/api/admin/users/${idx}/force-delete`, { reason });
};

/** axios 에러에서 백엔드 메시지 추출 */
export const extractAdminApiError = (error: unknown, fallback: string): string => {
  const message = (error as { response?: { data?: { message?: string } } })?.response
    ?.data?.message;
  return typeof message === 'string' && message.length > 0 ? message : fallback;
};
