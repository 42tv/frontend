import api from "./auto_refresh_axios";

/**
 * stream key 재생성
 * @returns
 */
export async function reCreateStreamKey() {
  const response = await api.put(
    "/api/ivs/stream-key",
    {},
    {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  console.log(response.data);
  return response.data;
}
