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
      <div className="flex min-h-screen">
        {/* Sidebar is only visible after login */}
        {/* {isLoggedIn && <Sidebar />} */}
        <Sidebar />
        <div className="flex flex-1 flex-col">
          <Header />

          <main className="flex-1 p-6 overflow-x-hidden">
            <Outlet />
            {children}
          </main>
        </div>
        <ToastContainer position="top-center" />
      </div>
    </>
  );
};
