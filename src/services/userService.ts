import axios from "axios";

export async function fetchUser(token: string) {
  const response = await axios.get("http://localhost:3000/auth/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
}
