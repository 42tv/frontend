import axios from "axios";
import api from "../auto_refresh_axios";
import { DeleteAccountRequest } from "@/app/_types/user";

/**
 * 회원가입 시 필수 동의 항목 (셋 다 true여야 서버가 가입을 허용)
 */
export interface SignUpAgreements {
  termsAgreed: boolean;
  privacyAgreed: boolean;
  isOver14: boolean;
}

/**
 * 회원가입 함수
 * @param id
 * @param password
 * @param nickname
 * @param agreements 필수 약관 동의 여부 (이용약관·개인정보·만14세)
 * @returns
 */
export async function singUp(
  id: string,
  password: string,
  nickname: string,
  agreements: SignUpAgreements
) {
  const requestBody = {
    id: id,
    password: password,
    nickname: nickname,
    ...agreements,
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
 * 회원 탈퇴
 * 일반 계정은 { password }, OAuth 계정은 { confirm: true }로 요청.
 * 성공 시 서버가 jwt/refresh 쿠키를 만료시킨다.
 * 방송 중·잔여 코인·미정산 등 차단 조건은 400 메시지로 내려온다.
 * @param data 탈퇴 요청 본문
 */
export async function deleteAccount(data: DeleteAccountRequest): Promise<void> {
  await api.delete("/api/user/me", {
    data,
    withCredentials: true,
  });
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
  identity_verified: boolean;
  adult_verified: boolean;
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