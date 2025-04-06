import { Link, useNavigate } from "react-router-dom";
import { ThemeToggle } from "./ThemeToogle";
import { useAuthContext } from "../context/AuthContext";



export const Header = () => {
  const { user, logout } = useAuthContext();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="bg-base-300 shadow-md px-6 py-4 flex justify-between items-center">
      <div className="flex items-center gap-4">
      <img src="/queenbee.png" className="size-10" />
      <Link to="/" className="text-lg font-bold text-primary">
        Queen Bee Product Management
      </Link>
      </div>
      <div className="flex items-center gap-4">
        <ThemeToggle />

        {user  ? (
          <div className="dropdown dropdown-end">
            <div tabIndex={0} className="avatar cursor-pointer">
              <div className="w-8 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
              <img
                  src={
                    user.avatar ||
                    "https://avatars.dicebear.com/api/initials/user.svg"
                  }
                  alt={user.name || "User"}
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
              <button
                  onClick={handleLogout}
                  className="text-error hover:text-error-content"
                >
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
