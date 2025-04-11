import React, { useEffect, useState } from "react";
import axios from "axios";
import useDoctorDashboard from "../../../hooks/useDoctorDashboard";
import {
  getDoctorIdByEmail,
  getDoctorUpcomingAppointments,
} from "../services/doctorAppointmentApi";
import { getEmailFromToken } from "../../auth/auth";
import ConfirmationModal from "../../../components/ConfirmationModal";
import RescheduleForm from "./RescheduleForm";
import { Calendar, Clock, User, RefreshCw, X } from "lucide-react";

const AppointmentCard = ({ appointment, onAction }) => {
  const formatTime = (dateStr) =>
    new Date(dateStr).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString(undefined, {
      weekday: "short",
      month: "short",
      day: "numeric",
    });

  return (
    <div className="flex justify-between items-center p-4 bg-white rounded-xl shadow-md mb-4 hover:shadow-lg transition">
      <div className="flex-1">
        {/* Patient Name */}
        <div className="flex items-center mb-2">
          <User size={18} className="text-gray-500 mr-2" />
          <span className="font-semibold text-gray-800">
            {appointment.patientName}
          </span>
        </div>

        {/* Date & Time */}
      <div className="flex items-center text-sm text-gray-600">
        <Calendar size={16} className="text-gray-500 mr-2" />
        <span>
          {new Date(appointment.scheduledTime).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </span>
        <Clock size={16} className="text-gray-500 ml-4 mr-2" />
        <span>
          {new Date(appointment.scheduledTime).toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          })}
        </span>
      </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col gap-2 ml-4">
        <button
          onClick={() => onAction(appointment.appointmentId, "reschedule")}
          className="flex items-center px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm transition"
        >
          <RefreshCw size={14} className="mr-1" />
          Reschedule
        </button>
        <button
          onClick={() => onAction(appointment, "cancel")}
          className="flex items-center px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm transition"
        >
          <X size={14} className="mr-1" />
          Cancel
        </button>
      </div>
    </div>
  );
};

const UpcomingAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const {
    handleCancelClick,
    handleRescheduleButtonClick,
    showCancelModal,
    showForm,
    setShowCancelModal,
    setShowForm,
    setAppointmentToReschedule,
    setAppointmentToCancel,
    showRescheduleForm,
    appointmentToReschedule,
    appointmentToCancel,
    handleCancelAppointment,
    handleRescheduleSubmit,
  } = useDoctorDashboard();

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const email = getEmailFromToken();
        if (!email) throw new Error("Email not found in token.");
        const doctorId = await getDoctorIdByEmail(email);
        const data = await getDoctorUpcomingAppointments(doctorId);
        setAppointments(data);
      } catch (err) {
        console.error("Failed to load appointments:", err);
      }
    };

    fetchAppointments();
  }, []);

  const handleAction = (appointment, action) => {
    console.log("appointtttt",appointment);
    if (action === "reschedule") {
      handleRescheduleButtonClick(appointment);
    } else if (action === "cancel") {
      handleCancelClick(appointment.appointmentId);
    }
  };

  return (
    <div className="p-6 bg-gray-50 rounded-xl shadow-inner min-h-[400px]">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Upcoming Appointments
      </h2>

      {appointments?.length > 0 ? (
        appointments.map((appointment) => (
          <AppointmentCard
            key={appointment.appointmentId}
            appointment={appointment}
            onAction={handleAction}
          />
        ))
      ) : (
        <p className="text-gray-500 text-center mt-10">
          No upcoming appointments.
        </p>
      )}

      {/* Reschedule Modal */}
      {showForm && appointmentToReschedule && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <RescheduleForm
              appointmentId={appointmentToReschedule}
              onSubmit={handleRescheduleSubmit}
              onCancel={() => {
                setShowForm(false);
                setAppointmentToReschedule(null);
              }}
            />
          </div>
        </div>
      )}

      {/* Cancel Confirmation Modal */}
      {showCancelModal && appointmentToCancel && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <ConfirmationModal
              message="Are you sure you want to cancel this appointment?"
              actionLabel="Cancel Appointment"
              onConfirm={() => handleCancelAppointment(appointmentToCancel)}
              onCancel={() => {
                setShowCancelModal(false);
                setAppointmentToCancel(null);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default UpcomingAppointments;