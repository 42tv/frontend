import api from "../auto_refresh_axios";

/**
 * 채팅 메시지 전송
 * @param broadcastId 
 * @param message 
 * @returns 
 */
export async function reqeustChat(broadcastId: string, message: string) {
  const requestBody = {
    broadcaster_id: broadcastId,
    message: message,
  };
  const response = await api.post("/api/chat", requestBody, {
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
}