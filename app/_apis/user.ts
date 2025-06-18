import axios from "axios";
import api from "./auto_refresh_axios";
// import { getCookie } from "cookies-next";
// import { headers } from "next/headers";

/**
 * 팬 레벨 아이템 인터페이스
 */
export interface FanLevelItem {
  name: string;
  min_donation: number;
  color: string;
}

/**
 * 사용자 프로필 인터페이스
 */
export interface UserProfile {
  idx: number;
  user_id: string;
  nickname: string;
  profile_img: string;
  created_at: string;
  updated_at: string;
}

/**
 * 회원가입 함수
 * @param id
 * @param password
 * @param nickname
 * @returns
 */
export async function singUp(id: string, password: string, nickname: string) {
  const requestBody = {
    id: id,
    password: password,
    nickname: nickname,
  };
  const response = await axios.post("/api/user", requestBody, {
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
    },
  });
  console.log(response.data);
  return response.data;
}

/**
 * 로그인 함수. 성공시 jwt, refresh 쿠키에 세팅
 * @param id
 * @param password
 * @returns
 */
export async function login(id: string, password: string) {
  const response = await axios.post(
    `/api/auth/login`,
    {
      username: id,
      password: password,
    },
    {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
}

/**
 * 로그아웃
 * @returns
 */
export async function logout() {
  const response = await axios.post(
    "/api/auth/logout",
    {},
    {
      withCredentials: true,
    }
  );
  return response.data;
}

/**
 * login_info
 * @returns
 */
export async function getLoginInfo() {
  const response = await api.get("/api/auth/login_info", {
    withCredentials: true,
  });
  return response.data;
}

/**
 * 기본 User 정보 가져오기
 * @returns
 */
export async function getInfo() {
  const response = await api.get("/api/user", {
    withCredentials: true,
  });
  return response.data;
}

/**
 * 닉네임 업데이트
 * @param nickname
 * @returns
 */
export async function updateNickname(nickname: string) {
  const response = await axios.patch(
    "/api/user/nickname",
    {
      nickname: nickname,
    },
    {
      withCredentials: true,
    }
  );
  return response.data;
}

/**
 * 비밀번호 변경
 * @param password
 * @param newPassword
 * @returns
 */
export async function updatePassword(password: string, newPassword: string) {
  const response = await axios.patch(
    "/api/user/password",
    {
      password: password,
      new_password: newPassword,
    },
    {
      withCredentials: true,
    }
  );
  return response.data;
}

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
  return response.data;
}

/**
 * 프로필 이미지 업로드
 * @param imageFile
 * @returns
 */
export async function uploadProfileImage(
  imageFile: File
): Promise<{ imageUrl: string }> {
  const formData = new FormData();
  formData.append("image", imageFile);

  const response = await api.post("/api/user/profile", formData, {
    withCredentials: true,
  });
  return response.data;
}

/**
 * 북마크 요청
 * @param user_id
 * @returns
 */
export async function requestCreateBookMark(user_id: string) {
  const response = await api.post(
    `/api/user/bookmark`,
    {
      user_id: user_id,
    },
    {
      withCredentials: true,
    }
  );
  return response.data;
}

/**
 * 북마크 제거 요청
 * @param user_id
 * @returns
 */
export async function requestDeleteBookMark(user_id: string) {
  const response = await api.delete(`/api/user/bookmark/${user_id}`, {
    withCredentials: true,
  });
  return response.data;
}

/**
 * 북마크리스트 요청
 * @returns
 */
export async function requestBookmarkList() {
  const response = await api.get("/api/user/bookmark", {
    withCredentials: true,
  });
  return response.data;
}

/**
 * 북마크 배열로 삭제
 * @param ids
 * @returns
 */
export async function deleteMultiBookmakrs(ids: number[]) {
  const response = await api.delete("/api/user/bookmarks", {
    withCredentials: true,
    data: { ids: ids },
  });
  return response.data;
}

/**
 * 블랙리스트에 사용자 추가
 * @param user_id
 * @returns
 */
export async function addToBlacklist(user_id: string) {
  const response = await api.post(
    `/api/user/blacklist`,
    {
      blocked_user_id: user_id,
    },
    {
      withCredentials: true,
    }
  );
  return response.data;
}

/**
 * 블랙리스트에서 사용자 제거
 * @param user_id
 * @returns
 */
export async function removeFromBlacklist(user_id: string) {
  const response = await api.delete(`/api/user/blacklist`,
    {
      withCredentials: true,
      data: { blocked_user_id: user_id },
    });
  return response.data;
}

/**
 * 여러 사용자를 블랙리스트에서 한 번에 제거
 * @param user_ids 제거할 사용자 ID 배열
 * @returns
 */
export async function removeMultipleFromBlacklist(user_ids: string[]) {
  const response = await api.delete(`/api/user/blacklists`,
    {
      withCredentials: true,
      data: { blocked_user_ids: user_ids },
    });
  return response.data;
}

/**
 * 블랙리스트 목록 조회
 * @returns
 */
export async function getBlacklist() {
  const response = await api.get("/api/user/blacklist", {
    withCredentials: true,
  });
  return response.data;
}

/**
 * 팬 레벨 목록 조회
 * @returns
 */
export async function getFanLevels() {
  const response = await api.get("/api/fan-level/", {
    withCredentials: true,
  });
  return response.data;
}

/**
 * 팬 레벨 정보 업데이트 (여러 레벨 한 번에 업데이트)
 * @param levels 팬 레벨 정보 배열
 * @returns
 */
export async function updateFanLevel(levels: FanLevelItem[]) {
  const requestBody = {
    levels: levels,
  };

  const response = await api.put("/api/fan-level", requestBody, {
    withCredentials: true,
  });
  return response.data;
}

/**
 * 개별 팬 레벨 수정 (단일 레벨 업데이트)
 * @param id 레벨 ID
 * @param name 레벨 이름
 * @param min_donation 최소 후원 금액
 * @param color 배경 색상
 * @returns
 */
export async function updateSingleFanLevel(id: number, name: string, min_donation: number, color: string) {
  const requestBody = {
    name: name,
    min_donation: min_donation,
    color: color,
  };

  const response = await api.put(`/api/fan-level/${id}`, requestBody, {
    withCredentials: true,
  });
  return response.data;
}

/**
 * 팬 레벨 삭제
 * @param id 레벨 ID
 * @returns
 */
export async function deleteFanLevel(id: number) {
  const response = await api.delete(`/api/fan-level/${id}`, {
    withCredentials: true,
  });
  return response.data;
}

/**
 * 사용자 프로필 검색 (닉네임으로)
 * @param nickname 검색할 닉네임
 * @returns UserProfile 정보
 */
export async function searchUserProfile(nickname: string): Promise<UserProfile> {
  const response = await api.get(`/api/user/profile/${nickname}`, {
    withCredentials: true,
  });
  return response.data;
}
