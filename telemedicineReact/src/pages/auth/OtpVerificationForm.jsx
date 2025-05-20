"use client";

import { useState } from "react";
import axios from "axios";

export default function OtpVerificationForm({ email, password, confirmPassword, role, onRegisterSuccess }) {
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
      // Step 1: Verify OTP
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

      // Step 2: Register user
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
      if (onRegisterSuccess) onRegisterSuccess(); // optional callback
    } catch (error) {
      console.error("Error during OTP verification or registration:", error);
      setError(
        error.response?.data || "Something went wrong during verification or registration."
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
        JSON.stringify(email), // send as raw string
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
      setTimeout(() => setResendDisabled(false), 30000); // 30s cooldown
    }
  };

  return (
    <div className="flex justify-center items-center p-4 bg-gradient-to-r from-teal-500 to-teal-600 rounded-lg">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">OTP Verification</h2>

        <p className="text-center text-gray-600 mb-6">
          Enter the OTP sent to <span className="font-medium text-indigo-600">{email}</span>
        </p>

        {error && <div className="bg-red-100 text-red-600 p-3 rounded-md text-center mb-4">{error}</div>}
        {success && <div className="bg-green-100 text-green-600 p-3 rounded-md text-center mb-4">{success}</div>}
        {resendMessage && <div className="text-sm text-center text-gray-700 mb-4">{resendMessage}</div>}

        <form onSubmit={handleOtpSubmit} className="space-y-6">
          <div>
            <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-2">
              Enter OTP
            </label>
            <input
              id="otp"
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full px-4 py-3 border text-gray-900 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-center text-lg"
              placeholder="Enter OTP"
              maxLength={6}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-teal-600 text-white py-3 rounded-md hover:bg-teal-700 transition-colors duration-300 disabled:opacity-50 font-medium"
          >
            {loading ? "Verifying & Registering..." : "Verify OTP"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={handleResendOtp}
            disabled={resendDisabled}
            className="text-sm font-medium text-teal-700 hover:text-teal-900 disabled:opacity-50"
          >
            {resendDisabled ? "Please wait..." : "Resend OTP"}
          </button>
        </div>
      </div>
    </div>
  );
}