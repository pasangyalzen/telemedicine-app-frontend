import { Link } from "react-router-dom";
import { PATHS } from "../../constants/path";
import { useNavigate, useLocation} from "react-router-dom";
import RegisterVideo from "../../assets/RegisterVideo.mp4";
import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import OtpVerificationForm from "./OtpVerificationForm"; // Import OTP verification component





export default function RegisterPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const role = "Patient"; 
  useEffect(() => {
  if (location.state && location.state.role) {
    console.log(`Role received from navigation state: ${location.state.role}`);
  } else {
    console.warn("Navigated to register without role state. Defaulting to 'patient'");
  }
}, [location.state]);

  

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showOtpForm, setShowOtpForm] = useState(false); // State to toggle OTP form display

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      alert("Please enter your email.");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    try {
      // Send OTP request
      const response = await axios.post("http://localhost:5186/api/OtpAuthentication/send-code", email, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("OTP sent successfully:", response.data);
      toast.success("Verification code sent to your email!");

      // Show OTP form on successful registration
      setShowOtpForm(true); // Display OTP form

    } catch (error) {
      console.error("Error sending OTP:", error);
      alert("Failed to send verification code.");
    }
  };

  return (
    <main className="fixed inset-0 bg-teal-100 bg-gradient-to-r from-white to-teal-200">
      <span className="text-3xl font-montserrat font-extrabold text-primary tracking-widest bg-gradient-to-r from-primar-light via-black to-primary bg-clip-text text-transparent">
        TELECHAUKI
      </span>

      <div className="h-full w-full flex items-center justify-center px-4">
        <div className="w-full max-w-3xl flex  from-teal-100 via-teal-50 to-cyan-50 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
          <div className="w-1/2 flex justify-center items-center">
            <video
              className="w-full h-full object-cover rounded-xl shadow-lg"
              autoPlay
              loop
              muted
            >
              <source src={RegisterVideo} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>

          <div className="w-1/2 flex flex-col justify-center items-center space-y-6 ml-5">
            <h1 className="text-4xl font-semibold text-black mb-8 text-center bg-gradient-to-r from-primary-light via-[#036f72] to-primary bg-clip-text text-transparent">
              REGISTER AS {role.toUpperCase()}
            </h1>

            {!showOtpForm ? (
              // Registration Form
              <form onSubmit={handleSubmit} className="space-y-6 w-full">
                <div className="space-y-2 text-start">
                  <label className="text-sm text-gray-500">Email</label>
                  <input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2 bg-white text-black rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-100"
                  />
                </div>
                <div className="space-y-2 text-start">
                  <label className="text-sm text-gray-500">Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2 bg-white text-black rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-100"
                  />
                </div>
                <div className="space-y-2 text-start">
                  <label className="text-sm text-gray-500">Confirm Password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
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
                  <span className="text-gray-500">Already have an account?</span>{" "}
                  <Link
                    onClick={() => navigate(PATHS.LOGIN)}
                    className="text-green-800 underline hover:text-teal-700"
                  >
                    Login
                  </Link>
                </div>
              </form>
            ) : (
              // OTP Verification Form (after registration)
              <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
                <OtpVerificationForm
                email={email}
                password={password}
                confirmPassword={confirmPassword}
                role={role}
                onRegisterSuccess={() => {
                  // Redirect to login or show a success toast
                  toast.success("Registered successfully!");
                  navigate("/login");
                }}
              />
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}