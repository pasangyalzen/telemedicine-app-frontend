import { useState, useEffect } from "react";
import { fetchTodaysAppointments, getDoctorIdByUserId, rescheduleAppointment } from "../pages/Doctor/services/doctorAppointmentApi"; // Import the fetch function
import { deleteAppointment } from "../pages/Admin/services/appointmentApi"; 

const useDoctorDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  
  // Handle state for appointment cancellation and rescheduling
  // const [appointmentToCancel, setAppointmentToCancel] = useState(null);
  const [appointmentToReschedule, setAppointmentToReschedule] = useState(null);


  useEffect(() => {
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

    fetchData();
  }, []);

  // Handle canceling an appointment
  const handleCancelAppointment = async (appointmentId) => {
    setLoading(true);
    setError(null);
    try {
      const result = await deleteAppointment(appointmentId);
      console.log("Appointment canceled:", result);
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
    console.log("Fulllllll", patient);
    setAppointmentToReschedule(patient);
    console.log("OKkkk");
    setShowForm(true);
    console.log("Appointment to reschedule:", appointmentToReschedule);  
  };
  useEffect(() => {
    console.log("Updated state in PatientQueue - showForm:", showForm);
    console.log("Updated state in PatientQueue - appointmentToReschedule:", appointmentToReschedule);
  }, [showForm, appointmentToReschedule]);

  // Handle the reschedule form submission
  const handleRescheduleSubmit = async (appointmentId,newDate) => {
    console.log("Appointment ID:", appointmentId);  // Log Appointment ID
    console.log("New Date:", newDate); // Log New Date
  
    try {
      console.log("Calling rescheduleAppointment function");
      const result = await rescheduleAppointment(appointmentId, newDate);
      
      setAppointments(prevAppointments => 
        prevAppointments.map(appointment => 
          appointment.appointmentId === appointmentId
            ? { ...appointment, scheduledTime: newDate } // Update scheduled time with new date
            : appointment
        )
      );
      console.log("Appointment successfully rescheduled:pfdgsfgsg", result);
    } catch (err) {
      console.error("Error rescheduling appointment:", err);
    }
  };
  return {
    appointments,
    loading,
    error,
    handleCancelAppointment,
    handleRescheduleButtonClick,
    handleRescheduleSubmit,
    setAppointmentToReschedule,
    setShowForm,
    appointmentToReschedule,
    showForm,
  };
};

export default useDoctorDashboard;