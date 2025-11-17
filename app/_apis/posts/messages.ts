import api from "../auto_refresh_axios";
import { ApiSuccessResponse } from "@/app/_types/api";

/**
 * 받은 쪽지 가져오기
 * @returns
 */
export async function getPosts() {
  const response = await api.get<ApiSuccessResponse<any[]>>("/api/post?kind=receive", {
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data.data;
}

/**
 * 보낸 쪽지 가져오기
 * @returns
 */
export async function getSendPosts() {
  const response = await api.get<ApiSuccessResponse<any[]>>("/api/post?kind=send", {
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data.data;
}

/**
 * 쪽지 읽기
 * @param postId
 * @returns
 */
export async function readPost(postId: number) {
  const response = await api.put<ApiSuccessResponse<any>>(`/api/post/${postId}`, {
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data.data;
}

/**
 * 쪽지 삭제
 * @param postId
 * @returns
 */
export async function deletePost(postId: number) {
  const response = await api.delete<ApiSuccessResponse<any>>(`/api/post/${postId}?type=received`, {
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data.data;
}

/**
 * 쪽지 여러개 삭제
 * @param postIds
 * @returns
 */
export async function deletePosts(postIds: number[], type: "receive" | "sent") {
  const response = await api.delete<ApiSuccessResponse<any>>(`/api/post`, {
    data: {
      postIds: postIds,
      type: type,
    },
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data.data;
}

/**
 * 쪽지 보내기
 * @param userId
 * @param message
 * @returns 전체 응답 객체 { success, data, message }
 */
export async function sendPost(userId: string, message: string) {
  const requestBody = {
    userId: userId,
    message: message,
  };
  const response = await api.post<ApiSuccessResponse<any>>("/api/post", requestBody, {
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
}