
import {jwtDecode} from "jwt-decode";

interface DecodedToken {
  exp: number;
  [key: string]: unknown;
}

export function isTokenExpired(token: string): boolean {
  try {
    const decoded = jwtDecode<DecodedToken>(token);
    const currentTime = Date.now() / 1000; // em segundos
    return decoded.exp < currentTime;
  } catch (err) {
    console.error("Invalid token", err);
    return true;
  }
}
