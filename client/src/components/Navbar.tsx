import { Disclosure } from "@headlessui/react";
import { NavLink } from "react-router-dom";
import logo from "../assets/logo.svg";

export const Navbar = () => {
  const navigation = [
    { name: "Home", to: "/", current: false },
    { name: "About", to: "/about", current: false },
    { name: "Products", to: "/products", current: false },
    { name: "Contact", to: "/contact", current: false },
  ];

  return (
    <Disclosure as="nav" className="navbar bg-base-100  w-full ">
      <div className="container mx-auto flex items-center px-4">
        {/* Logo */}
        <img
          alt="QueenBee"
          src={logo}
          width="30"
          height="30"
          className="mr-4"
        />

        {/* Menu Desktop */}
        <ul className="menu menu-horizontal space-x-4">
          {navigation.map((item) => (
            <li key={item.name}>
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  `rounded-lg px-4 py-2 no-underline transition-all duration-300 ${
                    isActive
                      ? "menu-active bg-primary text-white"
                      : "hover:bg-base-300 hover:text-primary text-base-content"
                  }`
                }
              >
                {item.name}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>

      {/* Menu Mobile */}
      {/* todo: add mobile menu */}
      <div className="navbar-end mr-4 text-sm">
        <button className="btn btn-square btn-ghost">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-base-content"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {" "}
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h7"
            />{" "}
          </svg>
        </button>
      </div>
    </Disclosure>
  );
};
