import { useState, useEffect } from "react";
import { fetchTodaysAppointments, getDoctorIdByUserId } from "../pages/Doctor/services/doctorAppointmentApi"; // Import the fetch function

const useDoctorDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
        console.log("hello");
      try {
        // Get userId from localStorage
        const userId = localStorage.getItem("id"); 

        // If there's no userId in localStorage, handle the error
        if (!userId) {
          setError("Doctor ID not found.");
          setLoading(false);
          return;
        }

        // Fetch doctorId using userId
        const doctorId = await getDoctorIdByUserId(userId);
        console.log("doctt",doctorId);

        // If the doctorId is undefined or invalid, handle the error
        if (!doctorId) {
          setError("Failed to fetch Doctor ID.");
          setLoading(false);
          return;
        }

        // Fetch today's appointments using doctorId
        const data = await fetchTodaysAppointments(doctorId);
        console.log("data",data);
        setAppointments(data); // Set appointments state
      } catch (error) {
        setError("Failed to fetch today's appointments.");
        console.log(error);
      } finally {
        setLoading(false); // Ensure loading is set to false once the request completes
      }
    };

    fetchData(); // Call fetchData once on mount

  }, []); // Empty dependency array means it runs only once on mount

  return { appointments, loading, error };
};

export default useDoctorDashboard;