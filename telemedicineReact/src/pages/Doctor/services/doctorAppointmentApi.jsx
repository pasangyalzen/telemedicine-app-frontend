import axios from "axios";

const API_BASE_URL = "http://localhost:5186/api/Doctor";

// Configure Axios instance with default headers
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Function to fetch today's appointments for the doctor
export const fetchTodaysAppointments = async (doctorId) => {
  try {
    const response = await apiClient.get(`/GetTodaysAppointments/${doctorId}`, {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`, // Add token for authentication
      },
    });
    console.log("response",response);
    return response.data;
  } catch (error) {
    console.error("Error fetching today's appointments:", error);
    throw new Error(error.response?.data || "There is no appointments today.");
    
  }
};

// Function to get DoctorId by UserId
export const getDoctorIdByUserId = async (userId) => {
  try {
    const response = await apiClient.get(`/GetDoctorIdByUserId/${userId}`, {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`, // Add token for authentication
      },
    });
    console.log("apidocot",response.data);
    return response.data; // Returns the DoctorId
  } catch (error) {
    console.error("Error fetching DoctorId:", error);
    throw new Error(error.response?.data?.message || "Error fetching DoctorId");
  }
};

export const rescheduleAppointment = async (appointmentId, newDateTime) => {
    try {
      const response = await apiClient.put(
        `/RescheduleAppointment/${appointmentId}`,
        newDateTime, // this must be in proper ISO format
        {
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error rescheduling appointment:", error);
      throw new Error(error.response?.data?.message || "Error rescheduling appointment");
    }
  };