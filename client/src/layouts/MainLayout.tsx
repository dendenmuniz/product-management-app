import { Outlet } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { ToastContainer } from "react-toastify";

export const MainLayout = () => {
  return (
    <>
      <div className="min-h-full">
        <Navbar />
        <Outlet />
        <ToastContainer position="top-center" />
      </div>
    </>
  );
};
