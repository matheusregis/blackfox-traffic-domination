import { useMutation } from "@tanstack/react-query";
import axios from "axios";

interface SignupData {
  name: string;
  lastName: string;
  email: string;
  password: string;
}
const API_URL = import.meta.env.VITE_API_URL;
export function useSignup() {
  return useMutation({
    mutationFn: async (data: SignupData) => {
      const response = await axios.post(
        `http://${API_URL}/auth/register`,
        data
      );
      return response.data.access_token;
    },
  });
}
