import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { useAuthContext } from "../context/AuthContext";
import { Sidebar } from "../components/Sidebar";
import { Header } from "../components/Header";

export const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuthContext();
  return (
    <>
      <div className="flex min-h-screen relative">
       
      {user && (
        <aside className="bg-base-200 z-40">
          <Sidebar />
        </aside>
      )}
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
