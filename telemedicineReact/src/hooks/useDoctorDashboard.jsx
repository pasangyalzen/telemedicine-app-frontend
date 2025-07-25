import { useState, useEffect } from "react";
import { fetchTodaysAppointments, getDoctorIdByUserId, rescheduleAppointment } from "../pages/Doctor/services/doctorAppointmentApi"; // Import the fetch function
import { cancelDoctorAppointment } from "../pages/Doctor/services/doctorAppointmentApi";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { fetchAppointments as fetchPaginatedAppointments} from "../pages/Admin/services/appointmentApi";


const useDoctorDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [appointmentToCancel, setAppointmentToCancel] = useState(null);
  
  // Handle state for appointment cancellation and rescheduling
  // const [appointmentToCancel, setAppointmentToCancel] = useState(null);
  const navigate = useNavigate();
  const [appointmentToReschedule, setAppointmentToReschedule] = useState(null);


  const fetchData = async () => {
  try {
    const userId = localStorage.getItem("id");
    if (!userId) {
      setError("Doctor ID not found.");
      setLoading(false);
      return;
    }

    const doctorId = await getDoctorIdByUserId(userId);
    if (!doctorId) {
      setError("Failed to fetch Doctor ID.");
      setLoading(false);
      return;
    }

    const data = await fetchTodaysAppointments(doctorId);
    setAppointments(data);
  } catch (error) {
    setError(error.message || "Failed to fetch appointments.");
    console.error(error);
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  fetchData();
}, []);
// Add this function after fetchData()
const refreshAppointments = async () => {
  await fetchData();
};

  const handleCancelClick = (appointmentId) => {
    console.log("Iskiri",appointmentId);
    setAppointmentToCancel(appointmentId); // Set the appointment ID to cancel
    setShowCancelModal(true); // Show confirmation modal
  };

  // Handle canceling an appointment
  const handleCancelAppointment = async (appointmentIdToCancel) => {
    console.log("Olaaaaa",appointmentIdToCancel);
    setLoading(true);
    setError(null);
    try {
      const result = await cancelDoctorAppointment(appointmentIdToCancel);
      console.log("Appointment canceled:", result);
      toast.success("Appointment was successfully cancelled");
      navigate(-1);
      setShowCancelModal(false);
      return result;
    } catch (err) {
      setError(err.message);
      console.error("Cancel error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Handle rescheduling a button click
  const handleRescheduleButtonClick = (patient) => {
    console.log("patient",patient);
    setAppointmentToReschedule(patient);
    setShowForm(true);
  };
  useEffect(() => {
    console.log("Updated state in PatientQueue - showForm:", showForm);
    console.log("Updated state in PatientQueue - appointmentToReschedule:", appointmentToReschedule);
  }, [showForm, appointmentToReschedule]);

  // Handle the reschedule form submission
  const handleRescheduleSubmit = async (appointmentId,newDate) => {
    console.log("afdasfadsfa",appointmentId);
    console.log("dafdafDSFASDFADSFASDFAS",newDate);
    try {
      const result = await rescheduleAppointment(appointmentId, newDate);
      console.log("Helloww",result);
      if (result == "200"){
        toast.success("The appointment was rescheduled.");
      }
      
      setAppointments(prevAppointments => 
        prevAppointments.map(appointment => 
          appointment.appointmentId === appointmentId
            ? { ...appointment, AppointmentDate: newDate } // Update scheduled time with new date
            : appointment
        )
      );

      await fetchData();
      // await fetchAppointments();
    } catch (err) {
      console.error("Error rescheduling appointment:", err);
    }
  };
  

  return {
    appointments,
    loading,
    error,
    handleCancelClick,
    handleCancelAppointment,
    handleRescheduleButtonClick,
    handleRescheduleSubmit,
    setAppointmentToReschedule,
    setShowForm,
    appointmentToReschedule,
    appointmentToCancel,
    showForm,
    showCancelModal,
    setShowCancelModal,
    setAppointmentToCancel,
    refreshAppointments,
  };
};

export default useDoctorDashboard;