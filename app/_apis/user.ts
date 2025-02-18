export async function singUp() {
  const response = await axios.get(`/api/user/info`, {
    headers: {
      Authorization: `Bearer ${getCookie("jwt")}`,
    },
  });
  return response.data;
}
