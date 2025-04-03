import { ThemeToggle } from "./ThemeToogle";
import { Link } from "react-router-dom";

// Simulando estado de login (substitua por auth real depois)
const user = {
  name: "Denise",
  avatar:
    "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp",
};

export const Header = () => {
  const isLoggedIn = Boolean(user); // substitua por lógica real de auth

  return (
    <header className="bg-base-300 shadow-md px-6 py-4 flex justify-between items-center">
      <Link to="/" className="text-lg font-bold text-primary">
        Product Manager
      </Link>

      <div className="flex items-center gap-4">
        <ThemeToggle />

        {isLoggedIn ? (
          <div className="dropdown dropdown-end">
            <div tabIndex={0} className="avatar cursor-pointer">
              <div className="w-8 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                <img
                  src={user.avatar}
                  alt={user.name}
                  loading="lazy"
                />
              </div>
            </div>
            <ul
              tabIndex={0}
              className="menu dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-40"
            >
              <li>
                <span className="text-sm font-semibold text-gray-700">
                  {user.name}
                </span>
              </li>
              <li>
                <button className="text-error hover:text-error-content">
                  Logout
                </button>
              </li>
            </ul>
          </div>
        ) : (
          <Link to="/login" className="btn btn-sm btn-outline">
            Login
          </Link>
        )}
      </div>
    </header>
  );
};
