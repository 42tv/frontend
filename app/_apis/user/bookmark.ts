import api from "../auto_refresh_axios";

/**
 * 북마크 요청
 * @param user_id
 * @returns
 */
export async function requestCreateBookMark(user_id: string) {
  const response = await api.post(
    `/api/user/bookmark`,
    {
      user_id: user_id,
    },
    {
      withCredentials: true,
    }
  );
  return response.data;
}

/**
 * 북마크 제거 요청
 * @param user_id
 * @returns
 */
export async function requestDeleteBookMark(user_id: string) {
  const response = await api.delete(`/api/user/bookmark/${user_id}`, {
    withCredentials: true,
  });
  return response.data;
}

/**
 * 북마크리스트 요청
 * @returns
 */
export async function requestBookmarkList() {
  const response = await api.get("/api/user/bookmark", {
    withCredentials: true,
  });
  return response.data;
}

/**
 * 북마크 배열로 삭제
 * @param ids
 * @returns
 */
export async function deleteMultiBookmakrs(ids: number[]) {
  const response = await api.delete("/api/user/bookmarks", {
    withCredentials: true,
    data: { ids: ids },
  });
  return response.data;
}