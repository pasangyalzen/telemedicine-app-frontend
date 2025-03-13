import { Link } from "react-router-dom";
import Navbar from "../layouts/Navbar"; // Updated import path
import Button from "../components/Button"; // Import the Button component
import { FaArrowRight } from "react-icons/fa"; // Import the FaArrowRight icon

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
            <Button variant="secondary" icon={FaArrowRight}>
              Go back to homepage
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}