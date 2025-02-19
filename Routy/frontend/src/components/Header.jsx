import React, { useContext, useState } from "react";
import { ThemeContext } from "../context/ThemeContext";

const Header = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between border-b border-solid border-b-[#27313A] dark:border-b-[#ffffff] px-4 md:px-10 py-3 bg-white dark:bg-[#141414]">
      <div className="flex items-center gap-4 text-black dark:text-white">
        <div className="size-4">
          <svg
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M12.0799 24L4 19.2479L9.95537 8.75216L18.04 13.4961L18.0446 4H29.9554L29.96 13.4961L38.0446 8.75216L44 19.2479L35.92 24L44 28.7521L38.0446 39.2479L29.96 34.5039L29.9554 44H18.0446L18.04 34.5039L9.95537 39.2479L4 28.7521L12.0799 24Z"
              fill="currentColor"
            ></path>
          </svg>
        </div>
        <h2 className="text-lg font-bold tracking-[-0.015em]">KinderRide</h2>
      </div>
      <nav className="hidden md:flex items-center gap-9 text-sm font-medium text-gray-700 dark:text-gray-300">
        <a
          href="#"
          className="hover:text-black dark:hover:text-white no-underline"
        >
          How it works
        </a>
        <a
          href="#"
          className="hover:text-black dark:hover:text-white no-underline"
        >
          Pricing
        </a>
        <a
          href="#"
          className="hover:text-black dark:hover:text-white no-underline"
        >
          Testimonials
        </a>
      </nav>
      <div className="hidden md:flex gap-2">
        <button className="min-w-[84px] h-10 px-4 rounded bg-[#F4C752] text-sm font-bold text-black">
          Sign up
        </button>
        <button className="min-w-[84px] h-10 px-4 rounded bg-[#ddd] text-sm font-bold text-black">
          Log in
        </button>
        <button
          onClick={toggleTheme}
          className="min-w-[84px] h-10 px-4 bg-[#F4C752] text-sm font-bold rounded"
        >
          Toggle {theme === "light" ? "Dark" : "Light"} Mode
        </button>
      </div>
      <button
        className="md:hidden flex items-center px-3 py-2 border rounded text-black dark:text-white border-black dark:border-white"
        onClick={toggleMenu}
      >
        <svg
          className="fill-current h-3 w-3"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <title>Menu</title>
          <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
        </svg>
      </button>
      {isMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-white dark:bg-[#141414] border-t border-solid border-t-[#27313A] dark:border-t-[#ffffff]">
          <nav className="flex flex-col items-center gap-4 py-4 text-gray-700 dark:text-gray-300">
            <a
              href="#"
              className="text-sm font-medium hover:text-black dark:hover:text-white no-underline"
            >
              How it works
            </a>
            <a
              href="#"
              className="text-sm font-medium hover:text-black dark:hover:text-white no-underline"
            >
              Pricing
            </a>
            <a
              href="#"
              className="text-sm font-medium hover:text-black dark:hover:text-white no-underline"
            >
              Testimonials
            </a>
            <button className="min-w-[84px] h-10 px-4 rounded bg-[#F4C752] text-sm font-bold text-black">
              Sign up
            </button>
            <button className="min-w-[84px] h-10 px-4 rounded bg-[#ddd] text-sm font-bold text-black">
              Log in
            </button>
            <button
              onClick={toggleTheme}
              className="min-w-[84px] h-10 px-4 bg-[#F4C752] text-sm font-bold rounded text-black"
            >
              Toggle {theme === "light" ? "Dark" : "Light"} Mode
            </button>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
