import api from "./auto_refresh_axios";

/**
 * NCP 방송 채널 준비 (ensure)
 * 현재 채널이 살아있으면 그대로 반환, 없거나 30일 회수됐으면 재생성한다.
 * 방송 설정 페이지 조회/재발급 버튼에서 사용.
 * @returns { channelId, streamKey, publishUrl, playbackUrl }
 */
export async function ensureNcpStreamKey() {
  const response = await api.post(
    "/api/ncp/stream-key",
    {},
    {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  // 백엔드 응답 구조: { success: true, data: { streamKey, publishUrl, ... }, message }
  return response.data?.data || response.data;
}

/**
 * NCP 스트림키 재발급 (진짜 재발급 = 기존 채널 반납 후 새 채널 생성).
 * 새 streamKey/publishUrl 이 반환된다. 방송 중에는 거부된다.
 * @returns { channelId, streamKey, publishUrl, playbackUrl }
 */
export async function reissueNcpStreamKey() {
  const response = await api.put(
    "/api/ncp/stream-key",
    {},
    {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return response.data?.data || response.data;
}
