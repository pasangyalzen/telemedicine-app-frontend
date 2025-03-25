import { useState, useEffect } from "react";
import axios from "axios";

const useAppointmentManagement = () => {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingCreate, setLoadingCreate] = useState(false);
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortColumn, setSortColumn] = useState("scheduledTime");
  const [sortOrder, setSortOrder] = useState("asc");
  const [editAppointment, setEditAppointment] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  
  
  const [formData, setFormData] = useState({
    patientName: "",
    doctorName: "",
    scheduledTime: new Date().toISOString(), // Default value for scheduled time
    status: "Scheduled",
    videoCallLink: "",
  });

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      console.log("📢 Fetching appointments...");

      const response = await axios.get("http://localhost:5186/api/admin/appointments/GetAllAppointments", {
        params: { page: 1, pageSize: 5, sortColumn: "CreatedAt", sortOrder: "ASC" },
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
          "Accept": "application/json",
        },
      });

      const data = response.data;
      console.log("📌 Data received from API:", data);

      if (Array.isArray(data)) {
        setAppointments(data);
        setFilteredAppointments(data);
        console.log("✅ Appointments updated in state:", data);
      } else {
        console.warn("⚠️ Unexpected data format:", data);
      }
    } catch (err) {
      console.error("❌ Error fetching appointments:", err);
      setError(`Error fetching appointments: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Fetch appointments
  useEffect(() => {
    fetchAppointments();
  }, []); // Only fetch appointments on mount

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredAppointments(appointments);
    } else {
      const lowercasedQuery = searchQuery.toLowerCase();
      setFilteredAppointments(
        appointments.filter(
          (appointment) =>
            appointment.patientName.toLowerCase().includes(lowercasedQuery) ||
            appointment.doctorName.toLowerCase().includes(lowercasedQuery)
        )
      );
    }
  }, [searchQuery, appointments]);

  const handleCreateClick = () => {
    setFormData({
      patientName: "",
      doctorName: "",
      scheduledTime: new Date().toISOString(), // Default to current time
      status: "Scheduled",
      videoCallLink: "",
    });
  
    setShowCreateModal(true);
  };
  useEffect(() => {
    console.log("showEditModal state changed:", showEditModal);
  }, [showEditModal]);

  useEffect(() => {
    console.log("showEditModal state changed:", showEditModal);
  }, [showEditModal]);
  
  const handleEditAppointmentClick = async (appointmentId) => {
    try {
      const response = await axios.get(`http://localhost:5186/api/admin/appointments/GetAppointmentById/${appointmentId}`, {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
      });
  
      const appointment = response.data;
      console.log("Fetched appointment:", appointment);  // Add detailed logs for debugging
  
      // Set the appointment data to the formData state
      setFormData({
        patientName: appointment.patientName,
        doctorName: appointment.doctorName,
        scheduledTime: appointment.scheduledTime,
        status: appointment.status,
        videoCallLink: appointment.videoCallLink,
      });
  
      // Set the selected appointment for further actions (like updating)
      setEditAppointment(appointment);
  
      // Open the Edit modal
      setShowEditModal(true);
    } catch (error) {
      console.error("Error fetching appointment details:", error);
      setError(`Error fetching appointment details: ${error.message}`);
    }
  };

  const createAppointment = async (newAppointment) => {
    const formattedAppointment = {
      doctorName: newAppointment.doctorName,
      patientName: newAppointment.patientName,
      scheduledTime: newAppointment.scheduledTime,
      status: newAppointment.status,
      videoCallLink: newAppointment.videoCallLink,
    };

    setLoadingCreate(true);
    try {
      const response = await axios.post("/api/appointments", formattedAppointment);
      setAppointments((prev) => [...prev, response.data]);
      setFilteredAppointments((prev) => [...prev, response.data]);
      setSuccessMessage("Appointment created successfully!");
    } catch (err) {
      setError(`Error creating appointment: ${err.message}`);
    } finally {
      setLoadingCreate(false);
    }
  };

  const handleUpdate = async () => {
    if (!editAppointment) return;
    setLoadingUpdate(true);
    try {
      const response = await axios.put(`/api/appointments/${editAppointment.appointmentId}`, formData);
      setAppointments((prev) =>
        prev.map((appt) => (appt.appointmentId === editAppointment.appointmentId ? response.data : appt))
      );
      setFilteredAppointments((prev) =>
        prev.map((appt) => (appt.appointmentId === editAppointment.appointmentId ? response.data : appt))
      );
      setSuccessMessage("Appointment updated successfully!");
      resetForm();
    } catch (err) {
      setError(`Error updating appointment: ${err.message}`);
    } finally {
      setLoadingUpdate(false);
    }
  };

  const handleDeleteClick = async (appointmentId) => {
    const appointmentToDelete = appointments.find((appt) => appt.appointmentId === appointmentId);
    if (appointmentToDelete) {
      setEditAppointment(appointmentToDelete);
    }
  };

  const handleDeleteAppointment = async () => {
    if (!editAppointment) return;
    setLoadingDelete(true);
    try {
      await axios.delete(`/api/appointments/${editAppointment.appointmentId}`);
      setAppointments((prev) => prev.filter((appt) => appt.appointmentId !== editAppointment.appointmentId));
      setFilteredAppointments((prev) => prev.filter((appt) => appt.appointmentId !== editAppointment.appointmentId));
      setSuccessMessage("Appointment deleted successfully!");
    } catch (err) {
      setError(`Error deleting appointment: ${err.message}`);
    } finally {
      setLoadingDelete(false);
      setEditAppointment(null);
    }
  };
 
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // const handleEditClick = (appointment) => {
  //   console.log("🛠 Edit button clicked for:", appointment);
  //   setEditAppointment(appointment); // Set selected appointment
  //   setFormData({
  //     patientName: appointment.patientName,
  //     doctorName: appointment.doctorName,
  //     scheduledTime: appointment.scheduledTime,
  //     status: appointment.status,
  //     videoCallLink: appointment.videoCallLink,
  //   });
  //   setShowEditModal(true); // Open the modal by setting showEditModal to true
  //   console.log("🛠 showEditModal:", showEditModal); 
  // };

  const resetForm = () => {
    setFormData({
      patientName: "",
      doctorName: "",
      scheduledTime: "",
      status: "Scheduled",
      videoCallLink: "",
    });
    setEditAppointment(null);
  };

  const openCreateModal = () => {
    setShowCreateModal(true);
  };

  const closeCreateModal = () => {
    setShowCreateModal(false);
  };
  const cancelEdit = () => {
    setFormData({
      patientName: "",
      doctorName: "",
      scheduledTime: "",
      status: "Scheduled",
      videoCallLink: "",
    });
    setEditAppointment(null);
    setShowEditModal(false); // Close the edit modal
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
  
    // Check if all required fields are populated
    if (
      formData.patientName &&
      formData.doctorName &&
      formData.scheduledTime &&
      formData.status &&
      formData.videoCallLink // Add all required fields here
    ) {
      // Proceed with form submission (i.e., call the function to create appointment)
      createAppointment(formData);
    } else {
      // Handle invalid form (for example, show an error message)
      console.log("Invalid form data", formData);
      alert("Please fill all the required fields.");
    }
  };

  return {
    appointments,
    filteredAppointments,
    loading,
    loadingCreate,
    loadingUpdate,
    loadingDelete,
    error,
    successMessage,
    formData,
    setFormData,
    searchQuery,
    setSearchQuery,
    sortColumn,
    sortOrder,
    editAppointment,
    handleInputChange,
    handleEditAppointmentClick,
    createAppointment,
    handleUpdate,
    handleDeleteClick,
    handleDeleteAppointment,
    resetForm,
    closeCreateModal,
    setShowCreateModal,
    openCreateModal,
    showCreateModal,
    handleCreateClick,
    handleSubmit,
    setShowEditModal,
    cancelEdit,
  };
};

export default useAppointmentManagement;