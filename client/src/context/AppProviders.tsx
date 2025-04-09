import { ReactNode } from "react";
import { ProductsProvider } from "./ProductsContext";
import { AuthProvider } from "./AuthContext";
import { ThemeProvider } from "./ThemeContext";

export const AppProviders = ({ children }: { children: ReactNode }) => {
  return (
    <AuthProvider>
      <ThemeProvider>
        <ProductsProvider>{children}</ProductsProvider>
      </ThemeProvider>
    </AuthProvider>
  );
};
