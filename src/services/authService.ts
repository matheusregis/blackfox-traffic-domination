import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;

export const loginService = async (email: string, password: string) => {
  const response = await axios.post(`${API_URL}/auth/login`, {
    email,
    password,
  });
  return response.data.access_token;
};
