import axios from "axios";
import toast from "react-hot-toast";

const API_URL = "http://localhost:5186/api/Patient"; // Adjust to match the endpoint

// Configure Axios instance
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
   "Content-Type": "application/json",
    "Authorization": `Bearer ${localStorage.getItem("token")}`, // Add token for authentication
  },
});

// Fetch all patients
export const fetchPatients = async () => {
  try {
    console.log("📢 Fetching patients...");
    const response = await apiClient.get("/GetAllPatients", {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
      },
    });
    console.log(response);
    return response.data;
  } catch (error) {
    console.error("🚨 Error fetching patients:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Error fetching patients");
  }
};


  export const fetchConsultationFeeByDoctorId = async (doctorId) => {
    try {
      const response = await axios.get(`http://localhost:5186/api/Patient/GetConsultationFeeByDoctorId/${doctorId}`);
      console.log("FEERESPONSE", response);
  
      return response.data.consultationFee;
    } catch (error) {
      console.error('Error fetching consultation fee:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to fetch consultation fee');
    }
  };


// Create a new patient
export const createPatient = async (patientData) => {
  console.log("I am here");

  try {
    // Send the POST request to register a patient
    const response = await apiClient.post("/RegisterPatient", patientData);

    console.log("Request was successful");

    // Return the full response directly
    return response;
  } catch (error) {
    // Handle error during the registration process
    console.error("Error during registration:", error.response?.data || error.message);

    // Return the error response directly
    return error.response || {
      data: "An error occurred during registration.",
      status: 500,
      statusText: "Internal Server Error",
    };
  }
};
// Fetch patient by ID
export const fetchPatientById = async (patientId) => {
  try {
    const response = await apiClient.get(`/GetPatientById/${patientId}`, {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
      },
    });
    console.log("Here",response.data);
    return response.data;
    
  } catch (error) {
    console.error("🚨 Error fetching patient details:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Error fetching patient details");
  }
};

// Update a patient
export const updatePatient = async (patientId, updatedData) => {
  try {
    const response = await apiClient.put(`/UpdatePatient/${patientId}`, updatedData, {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
      },
    });
    toast.success("Patient updated successfully!");
    return response.data;
  } catch (error) {
    console.error("🚨 Error updating patient:", error.response?.data || error.message);
    toast.error(error.response?.data?.message || "Error updating patient");
    throw new Error(error.response?.data?.message || "Error updating patient");
  }
};

// Delete a patient
export const deletePatient = async (patientId) => {
  try {
    const response = await apiClient.delete(`/DeletePatient/${patientId}`, {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
      },
    });
    if (response.status == 200){
      console.log("APIRESPONSE",response);
      

    }
    else{

      return response.data;
    }
    
  } catch (error) {
    console.error("🚨 Error deleting patient:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Error deleting patient");
  }
};
// Fetch UserId by PatientId
export const fetchUserIdByPatientId = async (patientId) => {
  try {
    const response = await apiClient.get(`/GetUserIdByPatientId/${patientId}`, {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
      },
    });

    return response.data.result; // Assuming the response contains { result: userId }
  } catch (error) {
    console.error("🚨 Error fetching UserId by PatientId:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Error fetching UserId by PatientId");
  }
};