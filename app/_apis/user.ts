import axios from "axios";
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

export async function getInfo() {
  const response = await axios.get("/api/user", {
    withCredentials: true,
  });
  return response.data;
}
