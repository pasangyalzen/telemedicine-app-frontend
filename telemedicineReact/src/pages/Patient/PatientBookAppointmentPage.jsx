import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AppointmentCreateForm from "../Admin/components/ui/AppointmentCreateForm";
import axios from "axios";
import toast from "react-hot-toast";

const PatientBookAppointmentPage = () => {
  const API_URL = "http://localhost:5186/api/admin";

    // Configure Axios instance
    const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    },
    });
  const [loadingCreate, setLoadingCreate] = useState(false);
  const navigate = useNavigate();
  const patientInfo = JSON.parse(localStorage.getItem("patientInfo")) || {};

  const [formData, setFormData] = useState({
    specialization: "",
    doctorId: null,
    appointmentDate: "",
    startTime: "",
    endTime: "",
    reason: "",
    patientSearchQuery: `${patientInfo.fullName} (${patientInfo.email})` || "",
    patientId: patientInfo.patientId || null,
  });

  
      const handleCreateAppointment = async (e, appointmentData) => {
  e.preventDefault(); // Prevent default form submission behavior
  setLoadingCreate(true);

  try {
    // Format appointmentDate as ISO string (full datetime)
    const appointmentDateISO = new Date(appointmentData.appointmentDate).toISOString();

    // Format time strings to HH:mm:ss
    const formatTime = (timeStr) => {
      if (!timeStr) return "";
      return timeStr.length === 5 ? timeStr + ":00" : timeStr; // e.g. "17:18" -> "17:18:00"
    };

    // Construct payload with expected keys and formats
    const payload = {
        doctorId: formData.doctorId,
        patientId: formData.patientId,
        appointmentDate: formData.appointmentDate, // in "YYYY-MM-DD"
        startTime: formData.startTime,             // in "HH:mm:ss"
        endTime: formData.endTime,                 // in "HH:mm:ss"
        reason: formData.reason,
        status: "Scheduled", // or "Pending"
        doctorName: "",
        patientName: "",
        videoCallLink: "",
        appointmentId: "",
        scheduledTime: new Date().toISOString(),
      };

    console.log("Payload being sent to API:", payload);

    // Send POST request to create appointment
    const response = await apiClient.post("/appointments/CreateAppointment", payload, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    console.log("Appointment created successfully:", response.data);
    toast.success("Appointment created successfully!");

    // Optionally update state or refetch appointments here if needed

    // Navigate or close modal etc.
    navigate(-1);
  } catch (error) {
    console.error("Failed to create appointment:", error);
    toast.error("Failed to create appointment. Please try again.");
  } finally {
    setLoadingCreate(false);
  }
};
  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-teal-100 via-teal-200 to-teal-300 backdrop-blur-md flex items-center justify-center">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl m-4 animate-scaleIn">
        <AppointmentCreateForm
          isPatient={true}
          patientInfo={patientInfo}
          formData={formData}
          setFormData={setFormData}
          isModalOpen={true}
          handleCreateAppointment={handleCreateAppointment}
          cancelCreateForm={() => {
            console.log("Canceled");
            navigate(-1); // Go back to previous page (typically the dashboard)
          }}
        />
      </div>

    </div>
  );
};

export default PatientBookAppointmentPage;