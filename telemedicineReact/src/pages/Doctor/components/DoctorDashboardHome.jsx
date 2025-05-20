import React, { useEffect } from "react";
import AppointmentSummary from "./AppointmentSummary"; // ✅ Import from separate file
import { getDoctorIdByEmail } from "../services/doctorAppointmentApi";
import { getEmailFromToken } from "../../auth/auth";

export default function DoctorDashboardHome({ onDoctorNotFound }) {
  useEffect(() => {
    const checkDoctor = async () => {
      const email = getEmailFromToken();
      const doctorId = await getDoctorIdByEmail(email);
  
      if (!doctorId && typeof onDoctorNotFound === "function") {
        console.log("Doctor not found, triggering register modal...");
        onDoctorNotFound();
      }
    };
  
    checkDoctor();
  }, []);

  return <AppointmentSummary />;
}