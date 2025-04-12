import axios from "axios";

const API_BASE_URL = "http://localhost:5186/api/Patient";

// Configure Axios instance with default headers
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor for authentication
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Function to fetch today's appointments for the patient
export const fetchTodaysAppointments = async (patientId) => {
  try {
    const response = await apiClient.get(`/GetTodaysAppointmentsByPatient/${patientId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching today's appointments:", error);
    throw new Error(error.response?.data || "Failed to fetch today's appointments.");
  }
};

// Function to fetch upcoming appointments for the patient
export const fetchUpcomingAppointments = async (patientId) => {
  try {
    const response = await apiClient.get(`/GetUpcomingAppointments/${patientId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching upcoming appointments:", error);
    throw new Error(error.response?.data || "Failed to fetch upcoming appointments.");
  }
};

// Function to fetch past appointments for the patient
export const fetchPastAppointments = async (patientId) => {
  try {
    const response = await apiClient.get(`/GetPastAppointments/past/${patientId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching past appointments:", error);
    throw new Error(error.response?.data || "Failed to fetch past appointments.");
  }
};

// Function to fetch consultation details by appointment ID
export const fetchConsultationByAppointmentId = async (appointmentId) => {
  try {
    const response = await apiClient.get(`/GetConsultationByAppointmentId/${appointmentId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching consultation details:", error);
    throw new Error(error.response?.data || "Failed to fetch consultation details.");
  }
};

// Function to reschedule an appointment
export const rescheduleAppointment = async (appointmentId, newDateTime) => {
  try {
    const response = await apiClient.put(`/RescheduleAppointment/${appointmentId}`, {
      scheduledTime: newDateTime
    });
    return response.data;
  } catch (error) {
    console.error("Error rescheduling appointment:", error);
    throw new Error(error.response?.data || "Failed to reschedule appointment.");
  }
};

// Function to cancel an appointment
export const cancelAppointment = async (appointmentId) => {
  try {
    const response = await apiClient.put(`/CancelAppointment/${appointmentId}`);
    return response.data;
  } catch (error) {
    console.error("Error cancelling appointment:", error);
    throw new Error(error.response?.data || "Failed to cancel appointment.");
  }
};

// Function to fetch prescription details
export const fetchPrescriptions = async (patientId) => {
  try {
    const response = await apiClient.get(`/GetPrescriptions/${patientId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching prescriptions:", error);
    throw new Error(error.response?.data || "Failed to fetch prescriptions.");
  }
};

// Function to book a new appointment
export const bookAppointment = async (appointmentData) => {
  try {
    const response = await apiClient.post('/BookAppointment', appointmentData);
    return response.data;
  } catch (error) {
    console.error("Error booking appointment:", error);
    throw new Error(error.response?.data || "Failed to book appointment.");
  }
};