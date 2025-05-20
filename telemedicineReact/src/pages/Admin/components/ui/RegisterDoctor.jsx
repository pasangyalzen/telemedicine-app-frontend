import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import OtpVerificationForm from "../../../auth/OtpVerificationForm";

const RegisterDoctorForms = ({ isOpen, onClose, role = "Doctor" }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showOtpForm, setShowOtpForm] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const API_URL = "http://localhost:5186/api";

  const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  const handleRegisterDirect = async () => {
    try {
      setLoading(true);

      const response = await apiClient.post("/Admin/Account/Register", {
        Email: email,
        Password: password,
        ConfirmPassword: confirmPassword,
        Role: role,
      });

      toast.success("Registered successfully! Credentials emailed.");
      onClose();
    } catch (error) {
      if (error.response) {
        toast.error(
          error.response?.data?.message || "Registration failed, please try again."
        );
      } else {
        toast.error("Registration failed, please check your network and try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error("Please enter your email.");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    if (role.toLowerCase() === "patient") {
      try {
        await axios.post(
          `${API_URL}/OtpAuthentication/send-code`,
          { email },
          { headers: { "Content-Type": "application/json" } }
        );
        toast.success("Verification code sent to your email!");
        setShowOtpForm(true);
      } catch (err) {
        toast.error("Failed to send verification code.");
      }
    } else {
      await handleRegisterDirect();
    }
  };

  const handleRegisterSuccess = () => {
    toast.success("Patient registered successfully!");
    setShowOtpForm(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-lg relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 text-3xl font-semibold transition"
          aria-label="Close modal"
        >
          &times;
        </button>

        {!showOtpForm ? (
          <>
            <h2 className="text-3xl font-extrabold mb-8 text-center text-teal-700 tracking-wide">
              Register {role}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-semibold text-gray-700"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="example@mail.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-3 focus:ring-teal-500 focus:border-teal-500 shadow-sm transition"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-semibold text-gray-700"
                >
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 border border-gray-300 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-3 focus:ring-teal-500 focus:border-teal-500 shadow-sm transition"
                />
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block mb-2 text-sm font-semibold text-gray-700"
                >
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  placeholder="Confirm your password"
                  className="w-full px-4 py-3 border border-gray-300 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-3 focus:ring-teal-500 focus:border-teal-500 shadow-sm transition"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-md shadow-md transition"
              >
                {loading
                  ? "Processing..."
                  : role.toLowerCase() === "patient"
                  ? "Send Verification Code"
                  : "Register"}
              </button>
            </form>
          </>
        ) : (
          <OtpVerificationForm
            email={email}
            password={password}
            confirmPassword={confirmPassword}
            role={role}
            onRegisterSuccess={handleRegisterSuccess}
          />
        )}
      </div>
    </div>
  );
};

export default RegisterDoctorForms;