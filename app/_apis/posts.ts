import api from "./auto_refresh_axios";
/**
 * 회원가입 함수
 * @param id
 * @param password
 * @param nickname
 * @returns
 */
export async function getPosts() {
  const response = await api.get("/api/post", {
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
