import { useState, useEffect } from "react";
import { AlertCircle, Calendar, Clock, User, RefreshCw, X } from 'lucide-react';
import useDoctorDashboard from "../../../hooks/useDoctorDashboard";
import { getDoctorUpcomingAppointments, getPatientById, getDoctorIdByEmail } from "../services/doctorAppointmentApi";
import { getEmailFromToken } from "../../auth/auth";
import toast from "react-hot-toast";
import React from "react";
import PatientProfileModal from "./PatientProfileModal";
import RescheduleForm from "./RescheduleForm";
import ConfirmationModal from "../../../components/ConfirmationModal";
import { fetchAppointments as fetchPaginatedAppointments  } from "../../Admin/services/appointmentApi";
// Format function handles time strings like "14:30:00" or full ISO strings
const formatTime = (timeStr) => {
  if (!timeStr) return "";
  const [hours, minutes] = timeStr.split(":");
  const date = new Date();
  date.setHours(+hours, +minutes);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

const AppointmentCard = ({ appointment, onAction }) => {
  const isToday = () => {
    const today = new Date();
    const apptDate = new Date(appointment.appointmentDate);
    return today.toDateString() === apptDate.toDateString();
  };

  return (
    <div className="flex justify-between items-center p-6 bg-white rounded-xl shadow-sm mb-4 hover:shadow-lg transition-all duration-300 border border-teal-100 hover:border-teal-200">
      <div
        className={`w-1 self-stretch rounded-full mr-4 ${
          isToday() ? "bg-teal-600" : "bg-teal-400"
        }`}
      ></div>

      <div className="flex-1">
        <div className="flex items-center mb-2">
          <User size={18} className="text-teal-600 mr-2" />
          <span className="font-semibold text-gray-800">{appointment.patientName}</span>
          {isToday() && (
            <span className="ml-2 px-3 py-1 bg-teal-50 text-teal-700 text-xs rounded-full font-medium border border-teal-200">
              Today
            </span>
          )}
        </div>

        <div className="text-sm text-gray-600 mb-2">
          <Calendar size={16} className="inline mr-2 text-teal-500" />
          <span className="font-medium">
            {new Date(appointment.appointmentDate).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        </div>

        <div className="text-sm text-gray-600 mb-2">
          <Clock size={16} className="inline mr-2 text-teal-500" />
          <span className="font-medium">
            {formatTime(appointment.startTime)} - {formatTime(appointment.endTime)}
          </span>
        </div>

        <div className="text-sm text-gray-700 mb-2">
          <strong className="text-teal-700">Reason:</strong> {appointment.reason}
        </div>

        <div className="text-xs text-teal-600 font-medium uppercase bg-teal-50 px-2 py-1 rounded-md inline-block">
          Status: {appointment.status}
        </div>
      </div>

      <div className="flex gap-3 ml-4">
        <button
          onClick={() => onAction(appointment.patientId, "viewProfile")}
          className="flex items-center px-4 py-2 bg-teal-50 text-teal-700 rounded-lg hover:bg-teal-100 text-sm transition-colors duration-200 font-medium border border-teal-200 hover:border-teal-300"
        >
          View Patient Profile
        </button>
        <button
          onClick={() => onAction(appointment.appointmentId, "reschedule")}
          className="flex items-center px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 text-sm transition-colors duration-200 font-medium shadow-sm hover:shadow-md"
        >
          <RefreshCw size={14} className="mr-2" />
          Reschedule
        </button>
        <button
          onClick={() => onAction(appointment.appointmentId, "cancel")}
          className="flex items-center px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 text-sm transition-colors duration-200 font-medium border border-red-200 hover:border-red-300"
        >
          <X size={14} className="mr-2" />
          Cancel
        </button>
      </div>
    </div>
  );
};

export const UpcomingAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);

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

    const fetchAppointments = async () => {
    setIsLoading(true);
    try {
      const email = getEmailFromToken();
      const doctorId = await getDoctorIdByEmail(email);
      if (doctorId) {
        const data = await getDoctorUpcomingAppointments(doctorId);
        console.log("Fetched upcoming appointments:", data);
        setAppointments(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleAction = async (value, action) => {
    if (action === "reschedule") {
      handleRescheduleButtonClick(value);
    } else if (action === "cancel") {
      handleCancelClick(value);
    } else if (action === "viewProfile") {
      try {
        const patientData = await getPatientById(value);
        setSelectedPatient(patientData);
        setShowProfileModal(true);
      } catch (error) {
        console.error("Failed to fetch patient profile:", error);
        toast.error("Unable to load patient profile.");
      }
    }
  };

  return (
    <div className="p-8 bg-gradient-to-br from-teal-50 via-white to-teal-50 rounded-xl shadow-lg min-h-[500px] border border-teal-100">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-teal-800 flex items-center">
          <Calendar size={28} className="mr-3 text-teal-600" />
          Upcoming Appointments
        </h2>
        <div className="text-sm text-teal-700 bg-teal-50 py-2 px-4 rounded-full border border-teal-200 shadow-sm font-medium">
          {appointments.length} appointment{appointments.length !== 1 ? 's' : ''}
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center h-64">
          <div className="w-12 h-12 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin"></div>
          <p className="mt-4 text-teal-700 font-medium">Loading your appointments...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 p-4 rounded-lg flex items-center text-red-700 border border-red-200">
          <AlertCircle size={20} className="mr-2" />
          {error}
        </div>
      ) : appointments?.length > 0 ? (
        <div className="space-y-4">
          {appointments.map((appointment) => (
            <AppointmentCard
              key={appointment.appointmentId}
              appointment={appointment}
              onAction={handleAction}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <div className="w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center mb-6 shadow-sm">
            <Calendar size={32} className="text-teal-500" />
          </div>
          <p className="text-teal-600 text-xl font-semibold">No upcoming appointments</p>
          <p className="text-teal-400 text-sm mt-2">Your schedule is clear for now</p>
        </div>
      )}

      {showForm && appointmentToReschedule && (
        <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity duration-300">
          <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-md transform transition-all duration-300 scale-100 border border-teal-200">
            <RescheduleForm
              appointmentId={appointmentToReschedule}
              appointmentToReschedule={appointmentToReschedule}
              onRescheduleSuccess={() => {
                handleRescheduleSubmit;
                fetchAppointments(); // Refresh the upcoming list after rescheduling
              }}
              onClose={() => {
                setShowForm(false);
                setAppointmentToReschedule(null);
              }}
            />
          </div>
        </div>
      )}

      {showCancelModal && appointmentToCancel && (
        <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity duration-300">
          <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-md transform transition-all duration-300 scale-100 border border-teal-200">
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

      {showProfileModal && selectedPatient && (
        <PatientProfileModal
          patient={selectedPatient}
          onClose={() => setShowProfileModal(false)}
        />
      )}
    </div>
  );
};

export default UpcomingAppointments;