import { useState } from 'react';
import { PATHS } from '../../constants/path';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios'; // Import axios
import LoginVideo from "../../assets/Login_Doctor.mp4";  

export default function LoginPage() {
    const navigate = useNavigate(); // For navigation after login

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    // Handle login logic
    const handleLogin = async (e) => {
        e.preventDefault(); // Prevent form from refreshing

        try {
            const response = await axios.post("http://localhost:5186/api/Admin/Account/Login", { email, password });
            
            // Store JWT token in localStorage
            localStorage.setItem("token", response.data.data.token);

            // Navigate to the dashboard (or home page)
            navigate(PATHS.DASHBOARD);  // Adjust to your correct path for the dashboard

            console.log("Login successful");
			//console.log(response.dat.token); 
        } catch (error) {
            console.error("Login failed:", error.response?.data?.message || error.message);
        }
    }

    return (
        <main className="fixed inset-0 bg-primary bg-gradient-to-r from-primary">
            <span className="text-3xl font-montserrat font-extrabold text-white tracking-widest bg-gradient-to-r from-gray-500 via-white to-white bg-clip-text text-transparent">TELECHAUKI</span>

            <div className="h-full w-full flex items-center justify-center px-4">
                <div className="w-full max-w-3xl mt-auto mb-auto flex bg-primary-light bg-gradient-to-r from-primary to-primary-light backdrop-blur-sm rounded-2xl p-8 shadow-lg">

                    {/* Image Section (Left Column) */}
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

                    {/* Login Section (Right Column) */}
                    <div className="w-1/2 flex flex-col justify-center items-center space-y-6 ml-5">
                        <h1 className="text-4xl font-semibold text-white mb-8 text-center bg-gradient-to-r from-primary-light via-[#036f72] to-primary bg-clip-text text-transparent">
                            LOGIN
                        </h1>

                        <form className="space-y-6" onSubmit={handleLogin}>
                            <div className="space-y-2 text-start w-full">
                                <label className="text-sm text-gray-400">Username</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="w-full px-4 py-2 rounded-md border  bg-primary text-white border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-light"
                                />
                            </div>

                            <div className="space-y-2 text-start w-full">
                                <label className="text-sm text-gray-400">Password</label>
                                <input
                                    type="password"
                                    name="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="w-full px-4 py-2 rounded-md border bg-primary text-white border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-100"
                                />
                            </div>

                            <div className="text-center mt-4">
                                <Link className="text-gray-400 hover:text-white text-sm">
                                    Forgot your password?
                                </Link>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-[#036f72] text-white py-2 rounded-md hover:bg-[#278d903c] transition-colors"
                            >
                                SIGN IN
                            </button>

                            <div className="text-center text-gray-400">
                                <span>Don't have an account ?</span> 
                                <Link
                                    onClick={() => navigate(PATHS.REGISTER)}
                                    className="text-gray-300 hover:text-white text-sm"
                                >
                                    SignUp
                                </Link>
                            </div>

                            {/* Google Sign-In Option */}
                            <div className="mt-6 text-center">
                                <button
                                    type="button"
                                    className="w-full bg-gray-300 text-black py-2 rounded-md mt-2 hover:bg-[#036f72] hover:text-white transition-colors"
                                >
                                    Sign in with Google
                                </button>
                            </div>
                        </form>
                    </div>

                </div>
            </div>
        </main>
    );
}
