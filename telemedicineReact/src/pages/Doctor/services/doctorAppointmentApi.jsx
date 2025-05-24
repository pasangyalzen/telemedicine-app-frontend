import axios from "axios";

const API_BASE_URL = "http://localhost:5186/api/Doctor";

// Configure Axios instance with default headers
export const apiClient = axios.create({
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
    console.log("Appointment ID:", appointmentId);
    console.log("New DateTime payload:", newDateTime);
    

    const response = await apiClient.put(
      `/RescheduleAppointment/${appointmentId}`,
      newDateTime,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    console.log("Reschedule response:", response);

    // Return backend success message as is
    if (response.status === 200 || response.status === 204) {
      return response.data;  // e.g. "Appointment rescheduled successfully."
    } else {
      throw new Error("Unexpected server response");
    }
  } catch (error) {
    console.error("Error rescheduling appointment:", error);

    // Extract backend error message exactly as sent
    const backendMessage = error.response?.data;
    // If backend sent a string message, throw it directly
    if (typeof backendMessage === "string") {
      throw new Error(backendMessage);
    }

    // If backend sent an object with a message field, throw that
    if (backendMessage?.message) {
      throw new Error(backendMessage.message);
    }

    // Fallback generic message
    throw new Error("Error rescheduling appointment");
  }
};

export const cancelDoctorAppointment = async (appointmentId) => {
  try {
    console.log("Appointment Ito ooooooo caaaa", appointmentId); // Log the appointmentId being passed

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
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data;
  } catch (error) {
    if (error.response?.status === 404) {
      console.warn("No past appointments found.");
      return []; // Return empty list if no data
    }
    console.error("Error fetching past appointments:", error);
    return []; // or throw a custom error if you want to show error message
  }
};


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
    const response = await apiClient.get(`/GetUpcomingAppointments/${doctorId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching upcoming appointments:", error);

    // Check for specific error status from the API
    if (error.response?.status === 404) {
      throw new Error("No upcoming appointments.");
    }

    // Use detailed error message if available, otherwise use a fallback
    const message =
      error.response?.data?.message ||
      error.message ||
      "Failed to fetch upcoming appointments.";
      
    throw new Error(message);
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
    if (error.response?.status === 404) {
      console.warn("Doctor not found for email:", email);
      return null; // 👈 return null instead of throwing
    }
    console.error("Error fetching doctor ID by email:", error);
    throw new Error(error.response?.data?.message || "Failed to fetch doctor ID.");
  }
};

export const fetchAppointmentSummary = async (doctorId) => {
  try {
    const response = await apiClient.get(`/GetAppointmentsSummary/${doctorId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching appointment summary:", error);
    throw error;
  }
};

export const getDoctorPastAppointments = async (doctorId) => {
  try {
    const response = await apiClient.get(`/GetPastAppointments/${doctorId}`, {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data;
  } catch (error) {
    if (error.response?.status === 404) {
      console.warn("No past appointments found.");
      return []; // ✅ Return empty array instead of throwing
    }
    console.error("Unexpected error fetching past appointments:", error);
    throw error; // Only throw if it's not a 404
  }
};

export const getPatientById = async (patientId) => {
  const token = localStorage.getItem("token");
  const url = `http://localhost:5186/api/Patient/GetPatientById/${patientId}`;

  try {
    const response = await axios.get(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching patient details:", error);
    throw error;
  }
};