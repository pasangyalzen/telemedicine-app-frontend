import { Link } from "react-router-dom";
import { PATHS } from "../../constants/path";
import { useNavigate } from "react-router-dom";
import RegisterVideo from "../../assets/RegisterVideo.mp4"; // Replace with the path to your video

export default function RegisterPage() {
  const navigate = useNavigate();

  return (
    <main className="fixed inset-0 bg-primary bg-gradient-to-r from-primary to-primary-light">
      <span className="text-3xl font-montserrat font-extrabold text-white tracking-widest bg-gradient-to-r from-gray-500 via-white to-white bg-clip-text text-transparent">
        TELECHAUKI
      </span>

      <div className="h-full w-full flex items-center justify-center px-4">
        {/* Main container */}
        <div className="w-full max-w-3xl flex bg-primary-light bg-gradient-to-r from-primary to-primary-light backdrop-blur-sm rounded-2xl p-8 shadow-lg">
          
          {/* Video Section (Left Column) */}
          <div className="w-1/2 flex justify-center items-center">
            <video
              className="w-full h-full object-cover rounded-xl shadow-lg"
              autoPlay
              loop
              muted
            >
              <source src={RegisterVideo} type="video/mp4" />
              {/* Add other video formats if needed */}
              Your browser does not support the video tag.
            </video>
          </div>

          {/* Registration Form Section (Right Column) */}
          <div className="w-1/2 flex flex-col justify-center items-center space-y-6 ml-5">
            <h1 className="text-4xl font-semibold text-white mb-8 text-center bg-gradient-to-r from-primary-light via-[#036f72] to-primary bg-clip-text text-transparent">
              REGISTER
            </h1>

            <form className="space-y-6 w-full">
              <div className="space-y-2 text-start">
                <label className="text-sm text-gray-300">Username</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 bg-white text-black rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-100"
                />
              </div>
              <div className="space-y-2 text-start">
                <label className="text-sm text-gray-300">Password</label>
                <input
                  type="password"
                  className="w-full px-4 py-2 bg-white text-black rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-100"
                />
              </div>
              <div className="space-y-2 text-start">
                <label className="text-sm text-gray-300">Confirm Password</label>
                <input
                  type="password"
                  className="w-full px-4 py-2 bg-white text-black rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-100"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-primary text-white py-2 rounded-md hover:bg-[#036f72] transition-colors"
              >
                REGISTER
              </button>
              <div className="w-full text-center">
                <span className="text-gray-300">Already have an account?</span>{" "}
                <Link
                  onClick={() => navigate(PATHS.LOGIN)}
                  className="text-gray-300 underline hover:text-white"
                >
                  Login
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
