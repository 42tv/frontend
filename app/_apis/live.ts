import api from "./auto_refresh_axios";

export async function getLiveList() {
  const response = await api.get("/api/live", {
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
}

export async function requestPlay(streamId: string, password?: string) {
  const requestBody = {
    stream_id: streamId,
    password: password,
  };
  const response = await api.post("/api/play", requestBody, {
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
}
