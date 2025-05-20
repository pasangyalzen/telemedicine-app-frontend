import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { updateAppointment,createAppointment,deleteAppointment } from "../pages/Admin/services/appointmentApi"; // Adjust the import path according to your file structure

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
  const [currentAppointmentId, setCurrentAppointmentId] = useState(null);
  
  
  const [formData, setFormData] = useState({
    appointmentId:"",
    patientName: "",
    doctorName: "",
    scheduledTime: new Date().toISOString(), // Default value for scheduled time
    status: "Scheduled",
    videoCallLink: "",
  });
  console.log("ddddddd",formData);

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
      console.log("Fetched appointment haiiiii:", appointment);  // Add detailed logs for debugging
  
      // Set the appointment data to the formData state
      setFormData({
        appointmentId: appointment.appointmentId,
        patientName: appointment.patientName,
        doctorName: appointment.doctorName,
        scheduledTime: appointment.scheduledTime,
        status: appointment.status,
        videoCallLink: appointment.videoCallLink,
      });
      setCurrentAppointmentId(appointment.appointmentId); 
  
      // Set the selected appointment for further actions (like updating)
      setEditAppointment(appointment);
  
      // Open the Edit modal
      setShowEditModal(true);
    } catch (error) {
      console.error("Error fetching appointment details:", error);
      setError(`Error fetching appointment details: ${error.message}`);
    }
  };

  const handleCreateAppointment = async (e, appointmentData) => {
    e.preventDefault(); // Prevent default form submission behavior
    setLoadingCreate(true);
  
    // Log the data to be sent to the API
    console.log("Data being sent to API:", appointmentData);
  
    try {
      // Get the raw scheduled time and format it
      let rawScheduledTime = appointmentData.scheduledTime; // From input field
      let formattedScheduledTime = `${rawScheduledTime}:00.000Z`;
  
      console.log("Raw Input Value:", rawScheduledTime); // Log the raw input value
      console.log("Final Scheduled Time Sent to API:", formattedScheduledTime); // Log the formatted value
  
      // Update the appointmentData with the formatted scheduledTime
      const updatedAppointmentData = { ...appointmentData, scheduledTime: formattedScheduledTime };
  
      // Log the structure before sending it to the API
      console.log("Submitted Data Structure:", JSON.stringify(updatedAppointmentData, null, 2));
  
      // API call to create appointment
      const response = await createAppointment(updatedAppointmentData);
      fetchAppointments();
      toast.success("Appointment created successfully!");
  
      // Log the response to ensure it's correct
      console.log("Appointment created:", response);
  
      // Update your state with the new appointment data
      setAppointments((prev) => [...prev, response]);
      setFilteredAppointments((prev) => [...prev, response]);
  
      // Close the modal after successful creation
      closeCreateModal(); // Close modal only after success
      setSuccessMessage("Appointment created successfully!");
    } catch (err) {
      setError(`Error creating appointment: ${err.message}`);
      toast.error(`${err.message}`);
    } finally {
      setLoadingCreate(false);
    }
  };
  const handleUpdate = async (e, formData) => {
    console.log("Updating Appointment with ID:");
    if (!formData) return;  // Ensure the appointmentId is available
  
    console.log("Updaadfadsfadsfadsf ID:", currentAppointmentId); // Debugging log
  
    setLoadingUpdate(true);
  
    try {
      const updatedAppointment = await updateAppointment(currentAppointmentId, formData);  // Use currentAppointmentId
  
      if (updatedAppointment) {
        setAppointments((prev) =>
          prev.map((appt) => (appt.appointmentId === currentAppointmentId ? updatedAppointment : appt))
        );
        setFilteredAppointments((prev) =>
          prev.map((appt) => (appt.appointmentId === currentAppointmentId ? updatedAppointment : appt))
        );
  
        toast.success("Appointment updated successfully!");
        resetForm();
        fetchAppointments();
      }
    } catch (error) {
      setError(error.message);
      toast.error(error.message);
    } finally {
      setLoadingUpdate(false);
    }
  };

  const handleDeleteClick = async (appointmentId) => {
    try {
      console.log("Hello");
      console.log(appointmentId);
  
      // Call the deleteAppointment API to delete the appointment
      const result = await deleteAppointment(appointmentId);
  
      // If successful, you can handle state updates here (e.g., removing the appointment from the list)
      // Assuming 'appointments' is an array of appointments
      setAppointments((prevAppointments) =>
        prevAppointments.filter((appt) => appt.appointmentId !== appointmentId)
      );
      // fetchAppointments();
      toast.success("Appointment deleted successfully!");
  
      console.log("✅ Appointment deleted successfully:", result);
    } catch (error) {
      toast.error(error);
      console.error("🚨 Error deleting appointment:", error.message);
    }
  };

  // const handleDeleteAppointment = async () => {
  //   if (!editAppointment) return;
  //   setLoadingDelete(true);
  //   try {
  //     await axios.delete(`/api/appointments/${editAppointment.appointmentId}`);
  //     setAppointments((prev) => prev.filter((appt) => appt.appointmentId !== editAppointment.appointmentId));
  //     setFilteredAppointments((prev) => prev.filter((appt) => appt.appointmentId !== editAppointment.appointmentId));
      
  //   } catch (err) {
  //     setError(`Error deleting appointment: ${err.message}`);
  //     toast.error(err);
  //   } finally {
  //     setLoadingDelete(false);
  //     setEditAppointment(null);
  //   }
  // };
 
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

  // const handleSubmit = (e) => {
  //   e.preventDefault();  // Prevent the default form submission (which would reload the page)
  //   console.log("📢 handleSubmit triggered");
  //   handleCreateAppointment(formData);  // Now we can safely call the handleCreateAppointment function
  // };
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
    handleUpdate,
    handleDeleteClick,
    //handleDeleteAppointment,
    resetForm,
    closeCreateModal,
    setShowCreateModal,
    openCreateModal,
    showCreateModal,
    handleCreateClick,
    setShowEditModal,
    cancelEdit,
    handleCreateAppointment,
  };
};

export default useAppointmentManagement;