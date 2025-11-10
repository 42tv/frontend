import api from "../auto_refresh_axios";

/**
 * 팬 레벨 아이템 인터페이스
 */
export interface FanLevelItem {
  name: string;
  min_donation: number;
  color: string;
}

/**
 * 팬 레벨 목록 조회
 * @returns
 */
export async function getFanLevels() {
  const response = await api.get("/api/fan-level/", {
    withCredentials: true,
  });
  // 백엔드 응답 구조: { success: true, data: [...], message: string }
  return response.data?.data || response.data;
}

/**
 * 팬 레벨 정보 업데이트 (여러 레벨 한 번에 업데이트)
 * @param levels 팬 레벨 정보 배열
 * @returns
 */
export async function updateFanLevel(levels: FanLevelItem[]) {
  const requestBody = {
    levels: levels,
  };

  const response = await api.put("/api/fan-level", requestBody, {
    withCredentials: true,
  });
  // 백엔드 응답 구조: { success: true, data: [...], message: string }
  return response.data?.data || response.data;
}

/**
 * 개별 팬 레벨 수정 (단일 레벨 업데이트)
 * @param id 레벨 ID
 * @param name 레벨 이름
 * @param min_donation 최소 후원 금액
 * @param color 배경 색상
 * @returns
 */
export async function updateSingleFanLevel(id: number, name: string, min_donation: number, color: string) {
  const requestBody = {
    name: name,
    min_donation: min_donation,
    color: color,
  };

  const response = await api.put(`/api/fan-level/${id}`, requestBody, {
    withCredentials: true,
  });
  return response.data;
}

/**
 * 팬 레벨 삭제
 * @param id 레벨 ID
 * @returns
 */
export async function deleteFanLevel(id: number) {
  const response = await api.delete(`/api/fan-level/${id}`, {
    withCredentials: true,
  });
  return response.data;
}