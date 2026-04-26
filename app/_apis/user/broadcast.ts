import axios from "axios";
import api from "../auto_refresh_axios";
import { BroadcastCategory } from "@/app/_types/user";

export async function updateBroadcastSetting(
  title: string,
  isAdult: boolean,
  isPrivate: boolean,
  isFanClub: boolean,
  fanLevel: number,
  password: string,
  category: BroadcastCategory
) {
  const response = await axios.put(
    "/api/user/broadcast-setting",
    {
      title,
      isAdult,
      isPrivate,
      isFanClub,
      fanLevel,
      password,
      category,
    },
    {
      withCredentials: true,
    }
  );
  return response.data;
}

/**
 * 방송 설정 가져오기
 * @returns
 */
export async function getBroadcastSetting() {
  const response = await api.get("/api/user/broadcast-setting", {
    withCredentials: true,
  });
  // 백엔드 응답 구조: { success: true, data: { ivs: {...}, broadcastSetting: {...} }, message: string }
  return response.data?.data || response.data;
}