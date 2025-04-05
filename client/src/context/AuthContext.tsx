import { createContext, useContext, useEffect, useState } from "react";
import { User } from "../@types/types";
import { isTokenExpired } from "../utils/auth";


interface AuthContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  token: string | null;
  setToken: React.Dispatch<React.SetStateAction<string | null>>;
  login: (user: User, token: string) => void;
  logout: () => void;
} 

const AuthContext  = createContext<AuthContextType | null>(null);

// Define the context and types
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const login = (user: User, token: string) => {
    setUser(user);
    setToken(token);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
  };

  useEffect(() => {
   
      if (token && isTokenExpired(token)) {
        logout();
      } 
   
  }, [token]);

  return (
    <AuthContext.Provider value={{ user, token, login, logout, setUser, setToken }}>
    {children}
  </AuthContext.Provider>
);
};

// This hook is used to access the authentication context in components
export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
};