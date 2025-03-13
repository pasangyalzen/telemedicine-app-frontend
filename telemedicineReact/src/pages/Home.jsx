import { useNavigate } from "react-router-dom";
import { PATHS } from "../constants/path";
import BackGroundVideo from '../assets/LandingPageVideo.mp4';
import Navbar from "../layouts/Navbar";
import Button from "../components/Button"; // Importing the reusable Button component

export default function Home() {
  return (
    <div style={{ backgroundColor: "#012f33" }}>
      {/* Fixed Navbar */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <Navbar />
      </div>

      {/* Main Content */}
      <div className="h-max w-screen flex flex-col justify-center text-center pt-20">
        <div className="min-h-screen w-full bg-[#012f33] px-8 py-12 flex items-center">
          <HomeInfo />
        </div>
      </div>
    </div>
  );
}

// HomeInfo Component Inside Home.jsx
function HomeInfo() {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
      {/* Left Column - Text Content */}
      <div className="space-y-8 flex flex-col justify-center text-center">
        <div className="space-y-4">
          <h1 className="text-white text-5xl lg:text-6xl font-light leading-tight">
            The world's
            <br />
            most loved
            <br />
            <span className="relative inline-block">
              telemedicine
              <div className="absolute -inset-1"></div>
            </span>
            <br />
            solution
          </h1>
        </div>

        <p className="text-white/90 text-xl">
          Experience why more than 1 million providers trust us already.
        </p>

        {/* Buttons */}
        <div className="flex flex-wrap gap-4 justify-center">
          {/* Get Started for Free Button */}
          <Button onClick={() => navigate(PATHS.REGISTER)} variant="primary">
            Get started for free
          </Button>

          {/* Schedule a Clinic Demo Button */}
          <Button variant="secondary">
            Schedule a Clinic demo
          </Button>
        </div>
      </div>

      {/* Right Column - Background Video */}
      <div className="bg-white/10 rounded-2xl h-[600px] w-full overflow-hidden relative">
        <video
          className="absolute inset-0 w-full h-full object-cover"
          src={BackGroundVideo}
          autoPlay
          loop
          muted
          playsInline
        ></video>
      </div>
    </div>
  );
}