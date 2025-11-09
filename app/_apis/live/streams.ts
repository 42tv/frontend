import api from "../auto_refresh_axios";

/**
 * 방송 설정 정보 타입
 */
interface BroadcastSettingInfo {
  is_adult: boolean;
  is_fan: boolean;
  is_pw: boolean;
  title: string;
  fan_level: number;
}

/**
 * 방송자 정보 타입
 */
interface BroadcasterInfo {
  idx: number;
  user_id: string;
  nickname: string;
  profile_img: string;
  broadcastSetting: BroadcastSettingInfo;
}

/**
 * 실시간 방송 항목 타입
 */
export interface LiveStreamItem {
  thumbnail: string;
  start_time: string;
  play_cnt: number;
  recommend_cnt: number;
  viewerCount: number;
  broadcaster: BroadcasterInfo;
}

/**
 * 라이브 스트림 목록 조회 응답 타입
 */
interface GetLiveListResponse {
  success: boolean;
  data: LiveStreamItem[];
  message: string;
}

/**
 * 라이브 스트림 목록 조회
 * @returns 실시간 방송 목록
 */
export async function getLiveList(): Promise<GetLiveListResponse> {
  const response = await api.get("/api/live", {
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
    },
  });
  return response.data;
}