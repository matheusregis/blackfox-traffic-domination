import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";

export const AuthRedirect = () => {
  const { token, loading } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && token) {
      navigate("/dashboard");
    }
  }, [token, loading, navigate]);

  return null;
};
