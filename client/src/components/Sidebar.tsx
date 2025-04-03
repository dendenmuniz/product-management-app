import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  HomeIcon,
  ArchiveBoxIcon,
  UserIcon,
} from "@heroicons/react/24/outline";

export const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const iconClass = "w-5 h-5";

  const menuItems = [
    { to: "/", label: "Dashboard", icon: <HomeIcon className={iconClass} /> },
    { to: "/products", label: "Products", icon: <ArchiveBoxIcon className={iconClass} /> },
    { to: "/login", label: "Login", icon: <UserIcon className={iconClass} /> },
  ];

  return (
    <aside
      className={`h-screen transition-all duration-300 bg-base-200 shadow-md ${
        isCollapsed ? "w-20" : "w-64"
      }`}
    >
      <div className="h-full px-3 py-4 overflow-y-auto flex flex-col">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          aria-label="Toggle sidebar"
          className="btn btn-sm btn-ghost mb-4"
        >
          {isCollapsed ? "➡" : "⬅"}
        </button>

        <ul className="menu space-y-2">
          {menuItems.map(({ to, label, icon }) => (
            <li key={to}>
              <NavLink
                to={to}
                className={({ isActive }) =>
                  `flex items-center gap-3 p-2 rounded-lg ${
                    isActive ? "text-primary font-semibold" : "text-base-content"
                  } hover:bg-base-100`
                }
              >
                <div
                  className={isCollapsed ? "tooltip tooltip-right z-50" : ""}
                  data-tip={isCollapsed ? label : ""}
                >
                  {icon}
                </div>
                {!isCollapsed && <span>{label}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
};
