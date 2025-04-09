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
    console.log("Appointment ID:", appointmentId); // Log the appointmentId
    console.log("New DateTime being passed:", newDateTime); // Log the newDateTime being passed to verify

    const response = await apiClient.put(
      `/RescheduleAppointment/${appointmentId}`,
      newDateTime, 
      {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    

    return response.status;
  } catch (error) {
    console.error("Error rescheduling appointment:", error);
    throw new Error(error.response?.data?.message || "Error rescheduling appointment");
  }
};

export const cancelDoctorAppointment = async (appointmentId) => {
  try {
    console.log("Appointment ID:", appointmentId); // Log the appointmentId being passed

    const response = await apiClient.put(
      `/CancelAppointment/${appointmentId}`, // The API endpoint to cancel the appointment
      null, // No body required for this request
      {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`, // Add token for authentication
        },
      }
    );

    return response.data; // Return the response data after successful cancellation
  } catch (error) {
    console.error("Error canceling appointment:", error); // Log the error if any
    throw new Error(error.response?.data?.message || "Error canceling appointment");
  }
};