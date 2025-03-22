import { Outlet } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { ToastContainer } from "react-toastify";
import { Sidebar } from "../components/Sidebar";

export const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex flex-1 flex-col">
          <main className="flex-1 overflow-x-hidden">
            <Outlet />
            <ToastContainer position="top-center" />
          </main>
        </div>
      </div>
    </>
  );
};
