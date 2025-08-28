import { useMutation } from "@tanstack/react-query";
import axios from "axios";

interface SignupData {
  name: string;
  lastName: string;
  email: string;
  password: string;
}

export function useSignup() {
  return useMutation({
    mutationFn: async (data: SignupData) => {
      const response = await axios.post(
        "http://localhost:3000/auth/register",
        data
      );
      return response.data.access_token;
    },
  });
}
