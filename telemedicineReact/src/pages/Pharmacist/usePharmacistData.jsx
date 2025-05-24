import { useEffect, useState } from "react";
import axios from "axios";

const API_BASE_URL = "http://localhost:5186/api/Pharmacist";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const usePharmacistData = () => {
  const [completedAppointments, setCompletedAppointments] = useState([]);
  const [consultationPrescriptions, setConsultationPrescriptions] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCompletedAppointments = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };

        const response = await apiClient.get("/GetCompletedAppointments", { headers });
        setCompletedAppointments(response.data);
      } catch (err) {
        setError("Failed to fetch completed appointments.");
        console.error(err);
      }
    };

    fetchCompletedAppointments();
  }, []);

  const fetchConsultationPrescriptions = async (appointmentId) => {
    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };

      const response = await apiClient.get(`/GetConsultationPrescriptionsByAppointment/${appointmentId}`, { headers });
      setConsultationPrescriptions(prev => ({
        ...prev,
        [appointmentId]: response.data
      }));
    } catch (err) {
      console.error(`Failed to fetch consultation prescriptions for appointment ${appointmentId}:`, err);
    }
  };

  return {
    completedAppointments,
    consultationPrescriptions,
    fetchConsultationPrescriptions,
    error,
  };
};