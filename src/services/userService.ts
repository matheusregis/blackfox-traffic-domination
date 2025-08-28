import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;

export async function fetchUser(token: string) {
  const response = await axios.get(`${API_URL}/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
}
