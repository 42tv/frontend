import axios from "axios";
import api from "./auto_refresh_axios";
// import { getCookie } from "cookies-next";
// import { headers } from "next/headers";

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

export async function getLoginInfo() {
  const response = await api.get("/api/auth/login_info", {
    withCredentials: true,
  });
  return response.data;
}

// /**
//  * 기본 User 정보 가져오기
//  * @returns
//  */
// export async function getInfo() {
//   const response = await api.get("/api/user", {
//     withCredentials: true,
//   });
//   return response.data;
// }

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
 * Upload a profile image to the server
 * @param imageFile The image file to upload
 * @returns A promise that resolves with the uploaded image URL
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
