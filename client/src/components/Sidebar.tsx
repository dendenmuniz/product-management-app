import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  HomeIcon,
  ArchiveBoxIcon,
  UserIcon,
} from "@heroicons/react/24/outline";

export const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const iconClass = "w-5 h-5 text-gray-500 dark:text-gray-400";

  return (
    <aside
      className={`h-screen transition-all duration-300 bg-gray-50 dark:bg-gray-800 shadow-md ${
        isCollapsed ? "w-20" : "w-64"
      }`}
    >
      <div className="h-full px-3 py-4 overflow-y-auto flex flex-col">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 text-gray-500 rounded-lg hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 mb-4"
        >
          {isCollapsed ? "➡" : "⬅"}
        </button>

        <ul className="space-y-2 font-medium">
          <li>
            <NavLink
              to="/"
              className={({ isActive }) =>
                `flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 ${
                  isActive
                    ? "text-pink-500 font-semibold"
                    : "text-gray-900 dark:text-white"
                }`
              }
            >
              <HomeIcon className={iconClass} />
              {!isCollapsed && <span>Dashboard</span>}
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/products"
              className={({ isActive }) =>
                `flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 ${
                  isActive
                    ? "text-pink-500 font-semibold"
                    : "text-gray-900 dark:text-white"
                }`
              }
            >
              <ArchiveBoxIcon className={iconClass} />
              {!isCollapsed && <span>Products</span>}
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/login"
              className={({ isActive }) =>
                `flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 ${
                  isActive
                    ? "text-pink-500 font-semibold"
                    : "text-gray-900 dark:text-white"
                }`
              }
            >
              <UserIcon className={iconClass} />
              {!isCollapsed && <span>Login</span>}
            </NavLink>
          </li>
        </ul>
      </div>
    </aside>
  );
};
