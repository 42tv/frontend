import api from "../auto_refresh_axios";
import axios from "axios";
import { PlayData } from "@/app/_types";

/**
 * 스트림 재생 요청 (인증 필요)
 * @param streamId 
 * @param password 
 * @returns 
 */
export async function requestPlay(streamId: string, password?: string): Promise<PlayData> {
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
 * 로비에서 스트림 재생 요청 (인증 없음)
 * @param streamId 
 * @param password 
 * @returns 
 */
export async function requestLobyPlay(streamId: string, password?: string) {
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