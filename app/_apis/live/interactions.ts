import api from "../auto_refresh_axios";

/**
 * 시청자 정보 타입 (백엔드 ViewerInfo와 일치)
 */
export interface ViewerInfo {
  user_id: string;
  user_idx: number;
  nickname: string;
  role: 'broadcaster' | 'manager' | 'member' | 'viewer' | 'guest';
  profile_img: string;
  grade: string;
  color: string;
}

/**
 * 스트리머 추천 응답 타입
 */
interface RecommendLiveStreamResponse {
  success: boolean;
  data: null;
  message: string;
}

/**
 * 시청자 목록 조회 응답 타입
 */
interface GetViewersListResponse {
  success: boolean;
  data: ViewerInfo[];
  message: string;
}

/**
 * 시청자 강퇴 응답 타입
 */
interface KickViewerResponse {
  success: boolean;
  data: null;
  message: string;
}

/**
 * 스트리머 추천하기
 * @param broadcasterIdx 방송자 인덱스
 * @returns 추천 성공 응답
 */
export async function requestLike(broadcasterIdx: number): Promise<RecommendLiveStreamResponse> {
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
 * @param broadcasterId 방송자 ID
 * @returns 시청자 목록
 */
export async function getViewersList(broadcasterId: string): Promise<GetViewersListResponse> {
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
 * @param broadcasterId 방송자 ID
 * @param viewerId 시청자 ID
 * @param reason 강퇴 사유
 * @returns 강퇴 성공 응답
 */
export async function kickViewer(broadcasterId: string, viewerId: string, reason?: string): Promise<KickViewerResponse> {
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