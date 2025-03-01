import axios, { AxiosError, AxiosResponse } from "axios";

// Axios 인스턴스 생성
const api = axios.create({
  withCredentials: true, // 쿠키 포함 요청
});

// Refresh Token을 이용한 Access Token 갱신 함수
const refreshToken = async () => {
  try {
    const response: AxiosResponse<{ accessToken: string }> = await axios.post(
      "/api/auth/refresh",
      {},
      { withCredentials: true }
    );
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("토큰 갱신 실패:", error);
    throw error;
  }
};

// 응답 인터셉터: JWT 만료 시 자동 갱신 처리
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config;

    // 401 오류 (토큰 만료) 발생 시
    if (error.response?.status === 401 && originalRequest) {
      try {
        await refreshToken();
        delete originalRequest.headers["cookie"];
        return api(originalRequest);
      } catch (error) {
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
