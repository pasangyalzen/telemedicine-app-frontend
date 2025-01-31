import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";

export default function PatientVideoCallDashboard() {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false); // State to track if the video should be played
  const [providerName, setProviderName] = useState("doctor"); // State to track the current provider
  const providers = ["doctor", "psychologist", "nutritionist", "physiotherapist", "dentist"]; // Array of health providers

  // Change provider name every 3 seconds only for the last h1
  useEffect(() => {
    const interval = setInterval(() => {
      setProviderName(prev => {
        const currentIndex = providers.indexOf(prev);
        const nextIndex = (currentIndex + 1) % providers.length; // Loop through the array
        return providers[nextIndex];
      });
    }, 2000); // Change every 3 seconds

    // Clean up the interval on component unmount
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <div className="fixed top-0 left-0 right-0 z-50 w-full">
        <Navbar backgroundColor="black" />
      </div>

      {/* Main Content */}
      <div className="flex-none w-screen bg-white pt-24 text-center h-auto">
        <div className="bg-white py-24 px-18 max-w-full mx-auto w-full">
          {/* Headings */}
          <h1 className="text-black text-7xl font-light font-serif mb-6">
            As a patient, you won't need an account!
          </h1>
          {/* Divider */}
          <hr className="border-t-2 border-gray-300 my-6 mx-auto w-3/4" />
          <h2 className="text-black text-3xl font-extralight font-serif mb-8">
            To meet with your Provider, enter the provided link below.
          </h2>

          {/* Input Field with Button */}
          <div className="flex items-center max-w-xl mx-auto w-full">
            <input
              type="text"
              placeholder="Enter your link..."
              className="flex-grow px-4 py-2 border bg-white  border-gray-300 text-gray- rounded-l-md focus:outline-none focus:ring-2 focus:ring-gray-300"
            />
            <button className="px-6 py-2 bg-[#65cccc] hover:bg-[#55b2b2] text-white font-semibold rounded-r-md transition-all duration-300">
              Check In
            </button>
          </div>
        </div>
      </div>

      {/* Footer Section */}
      <div className="bg-black flex flex-col items-center justify-center w-full text-center p-8 pt-0 h-screen ">
        <h1 className="text-white text-6xl font-semibold mt-0 mb-3">Make your time valuable</h1>
        <h1 className="text-white text-5xl font-semibold mb-3 pb-11">
          Meet your <span className="text-[#65cccc]">{providerName}</span> online
        </h1>

        <div className="w-full max-w-2xl flex flex-col items-center justify-center space-y-6">
          {/* YouTube Thumbnail */}
          {!isVideoPlaying ? (
            <div
              className="relative w-full cursor-pointer"
              onClick={() => setIsVideoPlaying(true)} // Change state to show the video
            >
              <img
                src="https://img.youtube.com/vi/B9oC8vUjqk8/maxresdefault.jpg"

                alt="YouTube Video Thumbnail"
                className="w-full rounded-lg shadow-lg hover:opacity-80 transition"
              />

              {/* Play Button Overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-black bg-opacity-50 rounded-full p-4">
                  <svg
                    className="w-12 h-12 text-white"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
            </div>
          ) : (
            // Display YouTube iframe when video is clicked
            <iframe
              className="w-full h-[500px] max-w-2xl rounded-lg shadow-lg"
              src="https://www.youtube.com/embed/B9oC8vUjqk8?autoplay=1"
              title="YouTube Video"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          )}
        </div>
      </div>
    </div>
  );
}
