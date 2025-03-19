import api from "./auto_refresh_axios";

/**
 * 받은 쪽지 가져오기
 * @returns
 */
export async function getPosts() {
  const response = await api.get("/api/post?kind=receive", {
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
}

/**
 * 보낸 쪽지 가져오기
 * @returns
 */
export async function getSendPosts() {
  const response = await api.get("/api/post?kind=send", {
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
}

/**
 * 쪽지 읽기
 * @param postId
 * @returns
 */
export async function readPost(postId: number) {
  const response = await api.put(`/api/post/${postId}`, {
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
}

/**
 * 쪽지 삭제
 * @param postId
 * @returns
 */
export async function deletePost(postId: number) {
  const response = await api.delete(`/api/post/${postId}`, {
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
}

/**
 * 쪽지 여러개 삭제
 * @param postIds
 * @returns
 */
export async function deletePosts(postIds: number[]) {
  const response = await api.delete(`/api/post`, {
    data: {
      postIds: postIds,
    },
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
}

export async function sendPost(userId: string, message: string) {
  const response = await api.post("/api/post", {
    userId: userId,
    message: message,
  });
  return response.data;
}
