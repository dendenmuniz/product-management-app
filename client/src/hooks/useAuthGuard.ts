import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";
import { isTokenExpired } from "../utils/auth";

export const useAuthGuard = (isProtectedRoute: boolean = true) => {
  const { user, token, logout } = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isProtectedRoute) return;

    if (!token || isTokenExpired(token)) {
      logout();
      navigate("/login");
    }
  }, [isProtectedRoute, token, logout, navigate, user]);
};
