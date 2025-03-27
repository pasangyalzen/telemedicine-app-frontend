import axios from 'axios';

// Base URL for your API
const API_URL = "http://localhost:5186/api/admin";

// Axios instance to configure headers
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${localStorage.getItem("token")}`, // Add token for authentication
  },
});

// Register a new user (Admin, Doctor, Patient, Pharmacist, SuperAdmin)
export const registerUser = async (model) => {
  try {
    // Send the POST request to register a user
    const response = await apiClient.post("/Account/Register", model);

    // Log the entire response for debugging
    console.log("Registration response:", response);

    // Check if the response is successful
    if (response.status === 200 && response.data?.success) {
      // Return the successful registration response data
      return {
        success: true,
        message: response.data.message,
        userData: response.data.data.user, // You can return user data if needed
      };
    } else {
      // If the response is not successful, handle the error
      return {
        success: false,
        message: "Registration failed. Please try again.",
      };
    }
  } catch (error) {
    // Handle the error during the registration process
    console.error("Error during registration:", error.response?.data || error.message);

    // Return an error response
    return {
      success: false,
      message: error.response?.data?.message || "An error occurred during registration.",
    };
  }
};