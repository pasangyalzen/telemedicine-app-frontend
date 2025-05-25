"use client";

import { useState } from "react";
import axios from "axios";

export default function OtpVerificationForm({
  email,
  password,
  confirmPassword,
  role,
  onRegisterSuccess,
}) {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [resendMessage, setResendMessage] = useState("");

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    if (!otp) {
      setError("Please enter the OTP.");
      return;
    }

    setLoading(true);
    try {
      const otpResponse = await axios.post(
        "http://localhost:5186/api/OtpAuthentication/verify-code",
        { email, code: otp },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      setSuccess("OTP verified successfully! Registering your account...");
      setError("");

      const registerResponse = await axios.post(
        "http://localhost:5186/api/Admin/Account/Register",
        {
          email,
          password,
          confirmPassword,
          role,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      setSuccess("Account registered successfully!");
      console.log("Registration success:", registerResponse.data);
      if (onRegisterSuccess) onRegisterSuccess();
    } catch (error) {
      console.error("Error during OTP verification or registration:", error);
      setError(
        error.response?.data ||
          "Something went wrong during verification or registration."
      );
      setSuccess("");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setResendDisabled(true);
    setResendMessage("");

    try {
      await axios.post(
        "http://localhost:5186/api/OtpAuthentication/send-code",
        JSON.stringify(email),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setResendMessage("A new OTP has been sent to your email.");
    } catch (error) {
      console.error("Error resending OTP:", error);
      setResendMessage("Failed to resend OTP. Please try again.");
    } finally {
      setTimeout(() => setResendDisabled(false), 30000);
    }
  };

  return (
    <div className="flex justify-center items-center p-4 w-full min-h-screen bg-gradient-to-r from-teal-50 to-teal-100 backdrop-blur-sm">
      <div className="bg-white border border-teal-100 p-8 rounded-2xl shadow-2xl w-full max-w-md">
        <h2 className="text-3xl font-extrabold text-center text-teal-700 mb-4 tracking-wide">
          OTP Verification
        </h2>

        <p className="text-center text-gray-600 mb-6 text-sm">
          Enter the OTP sent to{" "}
          <span className="font-semibold text-teal-800">{email}</span>
        </p>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded-md text-center mb-4 text-sm">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-100 text-green-700 p-3 rounded-md text-center mb-4 text-sm">
            {success}
          </div>
        )}
        {resendMessage && (
          <div className="text-sm text-center text-gray-700 mb-4">
            {resendMessage}
          </div>
        )}

        <form onSubmit={handleOtpSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="otp"
              className="block text-sm font-medium text-teal-800 mb-2"
            >
              One-Time Password
            </label>
            <input
              id="otp"
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full px-5 py-3 border border-teal-200 bg-teal-50 text-teal-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 text-center text-lg"
              placeholder="Enter 6-digit OTP"
              maxLength={6}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-teal-600 text-white py-3 rounded-lg shadow-md hover:bg-teal-700 transition-colors duration-300 disabled:opacity-60 font-semibold"
          >
            {loading ? "Verifying & Registering..." : "Verify OTP"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={handleResendOtp}
            disabled={resendDisabled}
            className="text-sm font-medium text-teal-700 hover:text-teal-900 transition duration-200 disabled:opacity-50"
          >
            {resendDisabled ? "Please wait..." : "Resend OTP"}
          </button>
        </div>
      </div>
    </div>
  );
}