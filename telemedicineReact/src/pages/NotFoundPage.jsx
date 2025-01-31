import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function NotFound() {
  return (
    <div className="h-screen w-screen flex flex-col bg-black">
      {/* Navbar */}
      <Navbar backgroundColor="black" />

      {/* Full-Screen Centered Content */}
      <div className="flex flex-grow flex-col justify-center items-center w-full text-center">
        <h1 className="text-7xl mt-2 text-[#65cccc] font-light">
          The page you're looking for
        </h1>
        <h1 className="text-7xl mt-2 text-[#65cccc] font-light">can't be found</h1>

        {/* Button Wrapper */}
        <div className="mt-6">
          <Link to="/">
            <button className="relative text-2xl font-sans bg-black  border-none font-extrabold px-4 py-2 text-gray-400 hover:text-gray-300 cursor-pointer group outline-none focus:ring-none">
              <span className="transition-all duration-300 group-hover:mr-3">
                Go back to homepage
              </span>

              {/* Right Arrow */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="3"
                stroke="currentColor"
                className="w-6 h-6 absolute right-0 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m8.25 4.5 7.5 7.5-7.5 7.5"
                />
              </svg>

              {/* Underline Effect */}
              <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#65cccc] group-hover:w-full transition-all duration-500"></span>
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
