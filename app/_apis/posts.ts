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
  console.log(response.data);
  return response.data;
}
