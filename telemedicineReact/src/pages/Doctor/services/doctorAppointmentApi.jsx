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

// Fetch past appointments for the doctor
export const fetchPastAppointments = async (doctorId) => {
  try {
    const response = await apiClient.get(`/GetPastAppointments/${doctorId}`, {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`, // Add token for authentication
      },
    });
    console.log("response", response);
    return response.data;
  } catch (error) {
    console.error("Error fetching past appointments:", error);
    throw new Error(error.response?.data || "There are no past appointments.");
  }
};

// Fetch upcoming appointments for the doctor
export const fetchUpcomingAppointments = async (doctorId) => {
  try {
    const response = await apiClient.get(`/GetUpcomingAppointments/${doctorId}`, {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`, // Add token for authentication
      },
    });
    console.log("response", response);
    return response.data;
  } catch (error) {
    console.error("Error fetching upcoming appointments:", error);
    throw new Error(error.response?.data || "There are no upcoming appointments.");
  }
};

// Fetch cancelled appointments for the doctor
export const fetchCancelledAppointments = async (doctorId) => {
  try {
    const response = await apiClient.get(`/GetCancelledAppointments/${doctorId}`, {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`, // Add token for authentication
      },
    });
    console.log("response", response);
    return response.data;
  } catch (error) {
    console.error("Error fetching cancelled appointments:", error);
    throw new Error(error.response?.data || "There are no cancelled appointments.");
  }
};

// Update the appointment status
export const updateAppointmentStatus = async (appointmentId, newStatus) => {
  try {
    const response = await apiClient.put(
      `/UpdateAppointmentStatus/${appointmentId}`,
      { status: newStatus },
      {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`, // Add token for authentication
        },
      }
    );
    console.log("Appointment status updated:", response);
    return response.status;
  } catch (error) {
    console.error("Error updating appointment status:", error);
    throw new Error(error.response?.data?.message || "Error updating appointment status.");
  }
};

export const getDoctorUpcomingAppointments = async (doctorId) => {
  try {
    console.log("Fetching appointments for doctorId:", doctorId); 
    const response = await apiClient.get(`/GetUpcomingAppointments/${doctorId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    console.log("Responseeeee", response);
    return response.data;
  } catch (error) {
    console.error("Error fetching doctor's upcoming appointments:", error);
    throw new Error(error.response?.data?.message || "Failed to fetch upcoming appointments.");
  }
};

export const getDoctorIdByEmail = async (email) => {
  try {
    const response = await apiClient.get(`GetDoctorIdByEmail/${email}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching doctor ID by email:", error);
    throw new Error(error.response?.data?.message || "Failed to fetch doctor ID.");
  }
};