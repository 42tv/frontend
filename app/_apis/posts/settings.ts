import api from "../auto_refresh_axios";

/**
 * 쪽지 설정 가져오기
 * @returns
 */
export async function getPostSetting() {
  const response = await api.get("/api/post/setting", {
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data.data || { fanLevels: [], minFanLevel: null };
}

/**
 * 쪽지 설정 업데이트 (팬 레벨 제한)
 * @param minFanLevel
 * @returns 전체 응답 객체 { success, data, message }
 */
export async function updatePostSetting(minFanLevel: number | null | undefined) {
  if (minFanLevel == -1) {
    minFanLevel = null; // -1은 제한없음으로 처리
  }
  const requestBody = {
    minFanLevel: minFanLevel,
  };
  const response = await api.put("/api/post/setting/level", requestBody, {
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
}