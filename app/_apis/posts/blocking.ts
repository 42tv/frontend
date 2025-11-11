import api from "../auto_refresh_axios";
import { ApiSuccessResponse } from "@/app/_types/api";

/**
 * userIdx 유저의 쪽지 차단
 * @param userIdx
 * @returns 전체 응답 객체 { success, data, message }
 */
export async function blockPostUser(userIdx: number) {
  const response = await api.post<ApiSuccessResponse<any>>(`/api/post/block/user/${userIdx}`, {
    data: {},
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
}

/**
 * 자신의 쪽지 차단 리스트 가져오기
 * @returns
 */
export async function getBlockedPostUser() {
  const response = await api.get<ApiSuccessResponse<any[]>>(`/api/post/block/user`, {
    data: {},
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data.data;
}

/**
 * 차단된 유저 쪽지 차단 해제
 * @param userIdx
 * @returns 전체 응답 객체 { success, data, message }
 */
export async function unblockPostUser(userIdx: number) {
  const response = await api.delete<ApiSuccessResponse<any>>(`/api/post/block/user/${userIdx}`, {
    data: {},
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
}

/**
 * 여러 유저 쪽지 차단 해제
 * @param userIdxs
 * @returns 전체 응답 객체 { success, data, message }
 */
export async function unblockPostUsers(userIdxs: number[]) {
  const response = await api.delete<ApiSuccessResponse<any>>(`/api/post/block/user`, {
    data: {
      blockedUserIdxs: userIdxs,
    },
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
}