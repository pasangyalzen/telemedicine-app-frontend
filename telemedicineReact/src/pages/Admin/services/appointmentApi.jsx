import axios from "axios";

const API_URL = "http://localhost:5186/api/admin";

// Configure Axios instance
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Fetch all appointments
export const fetchAppointments = async (page = 1, pageSize = 5, sortColumn = "CreatedAt", sortOrder = "ASC") => {
  try {
    console.log("📢 Fetching appointments...");

    const response = await apiClient.get(`/appointments/GetAllAppointments`, {
      params: { page, pageSize, sortColumn, sortOrder },
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    return response.data;
  } catch (error) {
    console.error("🚨 Error fetching appointments:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Error fetching appointments");
  }
};

// ✅ Create a new appointment
export const createAppointment = async (appointmentData) => {
  try {
    const response = await apiClient.post("/appointments/CreateAppointment", appointmentData);  
    console.log(response);
    return response.data;
  } catch (error) {
    console.error("🚨 Error creating appointment:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Error creating appointment");
  }
};

// ✅ Update appointment status
export const updateAppointment = async (appointmentId, updatedData) => {
  try {
    const response = await apiClient.put(`/appointments/UpdateAppointment/${appointmentId}`, updatedData, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });

    console.log("✅ Appointment updated successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("🚨 Error updating appointment:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Error updating appointment");
  }
};

// ✅ Delete appointment
export const deleteAppointment = async (appointmentId) => {
  try {
    const response = await apiClient.delete(`/appointments/DeleteAppointment/${appointmentId}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });

    console.log("✅ Appointment deleted successfully");
    return response.data;
  } catch (error) {
    console.error("🚨 Error deleting appointment:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Error deleting appointment");
  }
};

export const markAppointmentCompleted = async (appointmentId) => {
  try {
    const response = await apiClient.put(`/appointments/MarkAppointmentCompleted/${appointmentId}`, null, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("❌ Error marking appointment completed", error);
    throw error;
  }
};