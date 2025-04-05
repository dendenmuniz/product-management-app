import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";
import { isTokenExpired } from "../utils/auth";

export const useAuthGuard = () => {
  const { user, token, logout } = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token || isTokenExpired(token)) {
      logout();
      navigate("/login");
    }
  }, [token, logout, navigate, user]);
};
