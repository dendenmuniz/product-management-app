import { ThemeToggle } from "./ThemeToogle";
import { Link } from "react-router-dom";

export const Header = () => {
  return (
    <header className="bg-base-300 shadow-md px-6 py-4 flex justify-between items-center">
      <Link to="/" className="text-lg font-bold text-primary">
        Product Manager
      </Link>

      <div className="flex items-center gap-4">
      
        <ThemeToggle />
        <div className="avatar avatar-online">
        <div className="w-8 rounded-full">
            <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
          </div>
        </div>
       
        <Link to="/login" className="btn btn-sm btn-outline">
          Login
        </Link>
      </div>
    </header>
  );
};
