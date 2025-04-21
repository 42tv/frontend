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
