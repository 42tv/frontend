import api from "../auto_refresh_axios";

/**
 * 블랙리스트에 사용자 추가
 * @param user_id
 * @returns
 */
export async function addToBlacklist(user_id: string) {
  const response = await api.post(
    `/api/user/blacklist`,
    {
      blocked_user_id: user_id,
    },
    {
      withCredentials: true,
    }
  );
  return response.data;
}

/**
 * 블랙리스트에서 사용자 제거
 * @param user_id
 * @returns
 */
export async function removeFromBlacklist(user_id: string) {
  const response = await api.delete(`/api/user/blacklist`,
    {
      withCredentials: true,
      data: { blocked_user_id: user_id },
    });
  return response.data;
}

/**
 * 여러 사용자를 블랙리스트에서 한 번에 제거
 * @param user_ids 제거할 사용자 ID 배열
 * @returns
 */
export async function removeMultipleFromBlacklist(user_ids: string[]) {
  const response = await api.delete(`/api/user/blacklists`,
    {
      withCredentials: true,
      data: { blocked_user_ids: user_ids },
    });
  return response.data;
}

/**
 * 블랙리스트 목록 조회
 * @returns
 */
export async function getBlacklist() {
  const response = await api.get("/api/user/blacklist", {
    withCredentials: true,
  });
  return response.data;
}