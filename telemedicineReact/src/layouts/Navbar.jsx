import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { PATHS } from "../constants/path";

export default function Navbar({ backgroundColor }) {
  const [showSignupOptions, setShowSignupOptions] = useState(false);
  const [navbarOpacity, setNavbarOpacity] = useState(1);

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const opacity = Math.max(1 - currentScrollY / 300, 0); // Fade out effect
      setNavbarOpacity(opacity);

      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleSignupOptions = () => {
    setShowSignupOptions((prev) => !prev);
  };

  return (
    <nav
      style={{
        backgroundColor: backgroundColor || "#012f33",
        opacity: navbarOpacity,
        transition: "opacity 0.3s ease-in-out",
      }}
      className="fixed top-0 left-0 right-0 z-50 w-full p-3 flex items-center justify-between"
    >
      <span className="text-3xl font-montserrat font-extrabold text-white tracking-widest bg-gradient-to-r from-gray-500 via-white to-white bg-clip-text text-transparent">
        TELECHAUKI
      </span>

      <div className="flex gap-4 mr-8">
        {/* Other Links */}
        <Link>
          <button className="font-sans font-extrabold px-4 py-2 bg-transparent rounded-md text-gray-400 border hover:text-gray-300 border-none relative group">
            For Providers
            <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#65cccc] group-hover:w-full transition-all duration-500"></span>
          </button>
        </Link>
        <Link>
          <button className="font-sans font-extrabold px-4 py-2 bg-transparent rounded-md text-gray-400 border hover:text-gray-300 border-none relative group">
            For Clinics
            <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#65cccc] group-hover:w-full transition-all duration-500"></span>
          </button>
        </Link>
        <Link>
          <button className="font-sans font-extrabold px-4 py-2 bg-transparent rounded-md text-gray-400 border hover:text-gray-300 border-none relative group">
            About Us
            <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#65cccc] group-hover:w-full transition-all duration-500"></span>
          </button>
        </Link>

        {/* Login Button */}
        <Link to={PATHS.LOGIN}>
          <button className="font-sans font-semibold px-4 py-2 bg-transparent rounded-md text-[#65cccc] border-current hover:border-current relative group outline-none focus:ring-none">
            <span className="transition-all duration-300 group-hover:mr-2">Login</span>
            {/* Arrow icon inside the button */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="3"
              stroke="currentColor"
              className="w-5 h-5 absolute right-0 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        </Link>

        {/* Sign Up Button */}
        <div className="relative">
          <button
            onClick={toggleSignupOptions}
            className="px-4 py-2 rounded-md bg-[#65cccc] hover:bg-[#55b2b2] text-primary-dark font-semibold relative group outline-none focus:ring-none"
          >
            <span className="transition-all duration-300 group-hover:mr-2">Sign Up</span>
            {/* Arrow icon inside the button */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="3"
              stroke="currentColor"
              className="w-5 h-5 absolute right-0 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
            </svg>
          </button>

          {/* Dropdown Container */}
          {showSignupOptions && (
            <div className="absolute top-full right-1 mt-4 mb-0 bg-[#012f33] rounded-md shadow-lg z-10 w-60 flex flex-col gap-4 p-4 border border-x-primary-light border-y-primary-light">
              {/* Provider Button */}
              <Link to={PATHS.PROVIDER_SIGNUP}>
                <button className="flex items-center justify-center w-full px-3 py-3 bg-[#65cccc] text-black rounded-md font-medium shadow-md hover:bg-[#52b5b6] transition">
                  <span>I'm a Provider</span>
                </button>
              </Link>

              {/* Patient Button */}
              <Link to={PATHS.PATIENT_SIGNUP}>
                <button className="flex items-center justify-center w-full px-3 py-3 bg-[#ffaa33] text-black rounded-md font-medium shadow-md hover:bg-[#e6992d] transition">
                  <span>I'm a Patient</span>
                </button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
