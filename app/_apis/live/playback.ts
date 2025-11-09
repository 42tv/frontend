import api from "../auto_refresh_axios";
import axios from "axios";
import { PlayData } from "@/app/_types";

/**
 * 방송 시청 응답 타입
 */
interface PlayResponse {
  success: boolean;
  data: PlayData;
  message: string;
}

/**
 * 스트림 재생 요청 (인증 필요)
 * @param streamId 스트림 ID
 * @param password 비밀번호 (선택)
 * @returns 방송 시청 정보
 */
export async function requestPlay(streamId: string, password?: string): Promise<PlayResponse> {
  const requestBody = {
    stream_id: streamId,
    password: password,
  };
  const response = await api.post("/api/play", requestBody, {
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
}

/**
 * 로비에서 스트림 재생 요청 (게스트 포함)
 * @param streamId 스트림 ID
 * @param password 비밀번호 (선택)
 * @returns 방송 시청 정보
 */
export async function requestLobyPlay(streamId: string, password?: string): Promise<PlayResponse> {
  const requestBody = {
    stream_id: streamId,
    password: password,
  };
  const response = await axios.post("/api/play", requestBody, {
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
}