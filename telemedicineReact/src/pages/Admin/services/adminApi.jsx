import axios from 'axios';

// Base URL for your API
const API_URL = "http://localhost:5186/api";

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
    // Determine the endpoint based on the role
    let endpoint;
    switch (model.role) {
      case 'Doctor':
        endpoint = "/Doctor/RegisterDoctor";
        break;
      case 'Patient':
        endpoint = "/Patient/Register";
        break;
      case 'Pharmacist':
        endpoint = "/Pharmacist/Register";
        break;
      case 'Admin':
        endpoint = "/Admin/Register";
        break;
      case 'SuperAdmin':
        endpoint = "/SuperAdmin/Register";
        break;
      default:
        return {
          data: "Invalid role provided. Please select a valid role.",
          status: 400,
          statusText: "Bad Request"
        };
    }

    // Send the POST request to register a user
    const response = await apiClient.post(endpoint, model);

    // Log the entire response for debugging
    console.log("Registration response:", response);

    // Return the response in the required format
    return {
      data: response.data,
      status : response.status,
    };
  } catch (error) {
    // Handle error during the registration process
    console.error("Error during registration:", error.response?.data || error.message);

    // Return an error response in the required format
    return {
      data: error.response?.data?.message || "An error occurred during registration.",
      status: error.response?.status || 500,
      statusText: error.response?.statusText || "Internal Server Error",
    };
  }
};