import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { Navbar } from "../components/Navbar";
import { Sidebar } from "../components/Sidebar";
import { Header } from "../components/Header";

// TODO: Replace with actual auth check
const isLoggedIn = true; // ou useContext(AuthContext) no futuro

export const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <div className="flex min-h-screen relative">
        {/* Sidebar */}
        <div className="z-50">
          <Sidebar />
        </div>

        {/* Conteúdo principal */}
        <div className="flex flex-1 flex-col">
          <Header />
          <main className="flex-1 p-6 overflow-x-hidden z-0">
            <Outlet />
            {children}
          </main>
        </div>

        <ToastContainer position="top-center" />
      </div>
    </>
  );
};
