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
export async function deletePosts(postIds: number[], type: "receive" | "sent") {
  const response = await api.delete(`/api/post`, {
    data: {
      postIds: postIds,
      type: type,
    },
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
}

/**
 * 쪽지 보내기
 * @param userId
 * @param message
 * @returns
 */
export async function sendPost(userId: string, message: string) {
  const requestBody = {
    userId: userId,
    message: message,
  };
  const response = await api.post("/api/post", requestBody, {
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
}

/**
 * userIdx 유저의 쪽지 차단
 * @param userIdx
 * @returns
 */
export async function blockPostUser(userIdx: number) {
  const response = await api.post(`/api/post/block/user/${userIdx}`, {
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
  const response = await api.get(`/api/post/block/user`, {
    data: {},
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
}

/**
 * 차단된 유저 쪽지 차단 해제
 * @param userIdx
 * @returns
 */
export async function unblockPostUser(userIdx: number) {
  const response = await api.delete(`/api/post/block/user/${userIdx}`, {
    data: {},
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
}

export async function unblockPostUsers(userIdxs: number[]) {
  const response = await api.delete(`/api/post/block/user`, {
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

/**
 * 쪽지 설정 가져오기
 * @returns
 */
export async function getPostSetting() {
  const response = await api.get("/api/post/setting", {
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
}

export async function updatePostSetting(minFanLevel: number | null | undefined) {
  if (minFanLevel == -1) {
    minFanLevel = null; // -1은 제한없음으로 처리
  }
  const requestBody = {
    minFanLevel: minFanLevel,
  };
  const response = await api.put("/api/post/setting/level", requestBody, {
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
}