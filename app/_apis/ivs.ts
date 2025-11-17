import api from "./auto_refresh_axios";

/**
 * stream key 재생성
 * @returns
 */
export async function reCreateStreamKey() {
  const response = await api.put(
    "/api/ivs/stream-key",
    {},
    {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  console.log(response.data);
  // 백엔드 응답 구조: { success: true, data: { streamKey: string, ... }, message: string }
  return response.data?.data || response.data;
}
