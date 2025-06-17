import axios from "axios";
import { toast } from "react-toastify";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
let isAlreadyHandled = false;
let interceptorsSet = false;

export const reset401Handler = () => {
  isAlreadyHandled = false;
};

// create an axios instance with a base URL
const api = axios.create({
  baseURL: "/api",
});

//Interceptor configuration with token management including logout on 401 status
export const setupInterceptors = (
  getToken: () => string | null,
  logout: () => void
) => {
  if (interceptorsSet) return;
  interceptorsSet = true;

  api.interceptors.request.use((config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  api.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401 && !isAlreadyHandled) {
        isAlreadyHandled = true;
        logout();
        toast.error("Session expired. Please log in again.");
      }
      return Promise.reject(error);
    }
  );
};

export default api;
