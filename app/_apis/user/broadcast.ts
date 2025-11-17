import axios from "axios";
import api from "../auto_refresh_axios";

/**
 * 방송 설정 업데이트
 * @param title
 * @param isAdult
 * @param isPrivate
 * @param isFanClub
 * @param fanLevel
 * @param password
 * @returns
 */
export async function updateBroadcastSetting(
  title: string,
  isAdult: boolean,
  isPrivate: boolean,
  isFanClub: boolean,
  fanLevel: number,
  password: string
) {
  const response = await axios.put(
    "/api/user/broadcast-setting",
    {
      title: title,
      isAdult: isAdult,
      isPrivate: isPrivate,
      isFanClub: isFanClub,
      fanLevel: fanLevel,
      password: password,
    },
    {
      withCredentials: true,
    }
  );
  // 백엔드 응답 구조: { success: true, data: null, message: string }
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