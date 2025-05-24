import axios from "axios";
import toast from "react-hot-toast";

const API_URL = "http://localhost:5186/api/Pharmacist"; // Adjust to match the endpoint

// Configure Axios instance
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${localStorage.getItem("token")}`, // Add token for authentication
  },
});

// Fetch all pharmacists
export const fetchPharmacists = async () => {
  try {
    console.log("📢 Fetching pharmacists...");
    const response = await apiClient.get("/GetAllPharmacists", {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("🚨 Error fetching pharmacists:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Error fetching pharmacists");
  }
};

// Create a new pharmacist
export const createPharmacist = async (pharmacistData) => {
  try {
    const response = await apiClient.post("/RegisterPharmacist", pharmacistData);
    console.log(response);
    return response;
    
  } catch (error) {
    console.error("🚨 Error registering pharmacist:", error.response?.data || error.message);
    return error.response || {
      data: "An error occurred during registration.",
      status: 500,
      statusText: "Internal Server Error",
    };
  }
};

// Fetch pharmacist by ID
export const fetchPharmacistById = async (pharmacistId) => {
  try {
    const response = await apiClient.get(`/GetPharmacistById/${pharmacistId}`, {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
      },
      
    });console.log(response);
    return response.data;
  } catch (error) {
    console.error("🚨 Error fetching pharmacist details:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Error fetching pharmacist details");
  }
};

// Update a pharmacist
export const updatePharmacist = async (pharmacistId, updatedData) => {
  try {
    const response = await apiClient.put(`/UpdatePharmacist/${pharmacistId}`, updatedData, {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
      },
    });
    toast.success("Pharmacist updated successfully!");
    return response.data;
  } catch (error) {
    console.error("🚨 Error updating pharmacist:", error.response?.data || error.message);
    toast.error(error.response?.data?.message || "Error updating pharmacist");
    throw new Error(error.response?.data?.message || "Error updating pharmacist");
  }
};

// Delete a pharmacist
export const deletePharmacist = async (pharmacistId) => {
  try {
    const response = await apiClient.delete(`/DeletePharmacist/${pharmacistId}`, {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("🚨 Error deleting pharmacist:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Error deleting pharmacist");
  }
};

// Fetch UserId by PharmacistId
export const fetchUserIdByPharmacistId = async (pharmacistId) => {
  try {
    const response = await apiClient.get(`/GetUserIdByPharmacistId/${pharmacistId}`, {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data.result; // Assuming the response contains { result: userId }
  } catch (error) {
    console.error("🚨 Error fetching UserId by PharmacistId:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Error fetching UserId by PharmacistId");
  }
};

// Fetch PharmacistId by Email
export const fetchPharmacistIdByEmail = async (email) => {
  if (!email) throw new Error("Email is required to fetch PharmacistId");

  try {
    const response = await apiClient.get(`/GetPharmacistIdByEmail/${encodeURIComponent(email)}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    // Returns object: { PharmacistId: ... }
    return response.data.PharmacistId;
  } catch (error) {
    console.error("🚨 Error fetching PharmacistId by email:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Error fetching PharmacistId by email");
  }
};