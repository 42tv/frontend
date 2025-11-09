import axios from "axios";
import api from "../auto_refresh_axios";

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
 * 로그인 정보 조회 응답 타입 정의
 */
interface CoinInfo {
  balance: number;
  charged: number;
  used: number;
  received: number;
}

interface UserInfo {
  idx: number;
  user_id: string;
  profile_img: string;
  nickname: string;
  coin: CoinInfo;
}

interface GuestLoginInfo {
  is_guest: true;
  guest_id?: string;
}

interface AuthenticatedLoginInfo {
  is_guest: false;
  is_admin: boolean;
  user: UserInfo;
}

export type LoginInfo = GuestLoginInfo | AuthenticatedLoginInfo;

interface LoginInfoResponse {
  success: boolean;
  data: LoginInfo;
  message: string;
}

/**
 * 로그인 정보 조회
 * 현재 사용자의 로그인 정보를 조회하거나 게스트 정보를 반환
 * @returns 로그인 정보 (인증된 사용자 또는 게스트)
 */
export async function getLoginInfo(): Promise<LoginInfoResponse> {
  const response = await api.get("/api/auth/login_info", {
    withCredentials: true,
  });
  return response.data;
}