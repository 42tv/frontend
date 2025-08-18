import axios from "axios";
import api from "../auto_refresh_axios";

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