import axios from "axios";
// import { getCookie } from "cookies-next";
// import { headers } from "next/headers";

export async function singUp(id: string, password: string, nickname: string) {
  const response = await axios.post(`/api/user`, {
    id: id,
    password: password,
    nickname: nickname,
  });
  // const response = await axios.get(`/api/user/info`, {
  //   headers: {
  //     Authorization: `Bearer ${getCookie("jwt")}`,
  //   },
  // });
  return response.data;
}
