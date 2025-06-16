import { Navigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";
import { isTokenExpired } from "../utils/auth";

export const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const { token } = useAuthContext();

  if (!token || isTokenExpired(token)) {
    return <Navigate to="/login" replace />;
  }

  return children;
};