import api from "../auto_refresh_axios";

/**
 * 스트리머 추천하기
 * @param broadcasterIdx 
 * @returns 
 */
export async function requestLike(broadcasterIdx: number) {
  const requestBody = {
    broadcaster_idx: broadcasterIdx,
  };
  const response = await api.post("/api/live/recommend", requestBody, {
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
}

/**
 * 시청자 목록 조회
 * @param broadcasterId 
 * @returns 
 */
export async function getViewersList(broadcasterId: string) {
  const response = await api.get(`/api/live/${broadcasterId}/viewers`, {
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
}

/**
 * 시청자 강퇴
 * @param broadcasterId 
 * @param viewerId 
 * @param reason 
 * @returns 
 */
export async function kickViewer(broadcasterId: string, viewerId: string, reason?: string) {
  const requestBody = {
    viewer_id: viewerId,
    reason: reason,
  };
  const response = await api.post(`/api/live/${broadcasterId}/kick`, requestBody, {
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
}