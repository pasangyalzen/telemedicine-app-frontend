import { useState, useEffect } from 'react';
import { PATHS } from '../../constants/path';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import LoginVideo from "../../assets/Login_Doctor.mp4";  
import { handleLogin } from '../../services/authService';  

export default function LoginPage() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState(""); // Error message state

    // Check if the user is already logged in
    useEffect(() => {
        const token = localStorage.getItem("token");
        const role = localStorage.getItem("role");

        if (token && role) {
            redirectUser(role); // Redirect if already logged in
        }
    }, []);

    // Function to redirect based on role
    const redirectUser = (role) => {
        switch (role) {
            case "SuperAdmin":
                navigate(PATHS.ADMINDASHBOARD);
                break;
            case "Doctor":
                navigate(PATHS.DOCTORWAITINGROOMDASHBOARD);
                break;
            case "Patient":
                navigate(PATHS.PATIENTDASHBOARD);
                break;
            case "Pharmacist":
                navigate(PATHS.PHARMACISTDASHBOARD);
                break;
            default:
                navigate(PATHS.DASHBOARD);
        }
    };

    // Handle login logic
    const handleLoginClick = async (e) => {
        e.preventDefault();
        setErrorMessage(""); // Clear previous errors
    
        await handleLogin({ email, password }, redirectUser, setErrorMessage);  // Call handleLogin from the utils file
    };

    return (
        <main className="fixed inset-0 bg-gradient-to-br from-teal-50 via-cyan-25 to-teal-100">
            <span className="text-3xl font-montserrat font-extrabold text-primary tracking-widest bg-gradient-to-r from-primary-light via-primary to-primary bg-clip-text text-transparent">TELECHAUKI</span>

            <div className="h-full w-full flex items-center justify-center px-4">
                <div className="w-full max-w-3xl mt-auto mb-auto flex bg-gradient-to-r from-teal-100 via-teal-50 to-cyan-50 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
                    {/* Video Section */}
                    <div className="w-1/2 mt-0 flex justify-center items-center">
                        <video
                            className="w-full h-full object-cover rounded-xl shadow-lg"
                            autoPlay
                            loop
                            muted
                        >
                            <source src={LoginVideo} type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                    </div>

                    {/* Login Form Section */}
                    <div className="w-1/2 flex flex-col justify-center items-center space-y-6 ml-5">
                        <h1 className="text-4xl font-semibold text-teal-800 mb-8 text-center bg-gradient-to-r from-teal-700 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
                            LOGIN
                        </h1>

                        {/* Error Message Display */}
                        {errorMessage && (
                            <div className="text-red-500 text-sm text-center bg-red-100 px-4 py-2 rounded-md w-full">
                                {errorMessage}
                            </div>
                        )}

                        <form className="space-y-6" onSubmit={handleLoginClick}>
                            <div className="space-y-2 text-start w-full">
                                <label className="text-sm text-teal-700">Username</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="w-full px-4 py-2 rounded-md border bg-white text-teal-800 border-teal-200 focus:outline-none focus:ring-2 focus:ring-teal-300"
                                />
                            </div>

                            <div className="space-y-2 text-start w-full">
                                <label className="text-sm text-teal-700">Password</label>
                                <input
                                    type="password"
                                    name="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="w-full px-4 py-2 rounded-md border bg-white text-teal-800 border-teal-200 focus:outline-none focus:ring-2 focus:ring-teal-300"
                                />
                            </div>

                            <div className="text-center mt-4">
                                <Link to={PATHS.FORGOT_PASSWORD} className="text-teal-600 hover:text-teal-800 text-sm">
                                Forgot your password?
                                </Link>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-teal-600 text-white py-2 rounded-md hover:bg-teal-700 transition-colors"
                            >
                                SIGN IN
                            </button>

                            {/* <div className="text-center text-gray-400">
                                <span>Don't have an account ?</span> 
                                <Link
                                    onClick={() => navigate(PATHS.REGISTER)}
                                    className="text-gray-300 hover:text-white text-sm"
                                >
                                    SignUp
                                </Link>
                            </div> */}
                            
                        </form>
                    </div>

                </div>
            </div>
        </main>
    );
}