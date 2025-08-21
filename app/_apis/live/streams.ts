import api from "../auto_refresh_axios";

/**
 * 라이브 스트림 목록 조회
 * @returns
 */
export async function getLiveList() {
  const response = await api.get("/api/live", {
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
    },
  });
  return response.data;
}