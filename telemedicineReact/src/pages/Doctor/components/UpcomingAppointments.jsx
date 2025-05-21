import { useState, useEffect } from "react";
import { AlertCircle } from 'lucide-react';
import useDoctorDashboard from "../../../hooks/useDoctorDashboard";
import { getDoctorUpcomingAppointments, getPatientById } from "../services/doctorAppointmentApi";
import { getEmailFromToken } from "../../auth/auth";
import { getDoctorIdByEmail } from "../services/doctorAppointmentApi";
import toast from "react-hot-toast";
import React from "react";
import { Calendar, Clock, User, RefreshCw, X } from "lucide-react";
import PatientProfileModal from "./PatientProfileModal";
import RescheduleForm from "./RescheduleForm";
import ConfirmationModal from "../../../components/ConfirmationModal";


const AppointmentCard = ({ appointment, onAction }) => {
  const isToday = () => {
    const today = new Date();
    const apptDate = new Date(appointment.appointmentDate);
    return today.toDateString() === apptDate.toDateString();
  };

  const formatTime = (dateStr) =>
    new Date(dateStr).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <div className="flex justify-between items-center p-5 bg-white rounded-xl shadow-sm mb-4 hover:shadow-md transition-all duration-300 border border-gray-100">
      <div
        className={`w-1 self-stretch rounded-full mr-4 ${
          isToday() ? "bg-blue-500" : "bg-green-400"
        }`}
      ></div>

      <div className="flex-1">
        <div className="flex items-center mb-1">
          <User size={18} className="text-indigo-500 mr-2" />
          <span className="font-semibold text-gray-800">{appointment.patientName}</span>
          {isToday() && (
            <span className="ml-2 px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full font-medium">
              Today
            </span>
          )}
        </div>

        <div className="text-sm text-gray-600 mb-1">
          <Calendar size={16} className="inline mr-1" />
          <span className="font-medium">
            {new Date(appointment.appointmentDate).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        </div>

        <div className="text-sm text-gray-700 mb-1">
          <strong>Reason:</strong> {appointment.reason}
        </div>

        <div className="text-xs text-gray-500 font-medium uppercase">
          Status: {appointment.status}
        </div>
      </div>

      <div className="flex gap-3 ml-4">
        <button
        onClick={() => onAction(appointment.patientId, "viewProfile")}
        className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm transition-colors duration-200 font-medium"
      >
        View Patient Profile
      </button>
        <button
          onClick={() => onAction(appointment.appointmentId, "reschedule")}
          className="flex items-center px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 text-sm transition-colors duration-200 font-medium"
        >
          <RefreshCw size={14} className="mr-2" />
          Reschedule
        </button>
        <button
          onClick={() => onAction(appointment.appointmentId, "cancel")}
          className="flex items-center px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 text-sm transition-colors duration-200 font-medium"
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

  useEffect(() => {
    const fetchAppointments = async () => {
      setIsLoading(true);
      try {
        const email = getEmailFromToken();
        const doctorId = await getDoctorIdByEmail(email);
        if (doctorId) {
          const data = await getDoctorUpcomingAppointments(doctorId);
          setAppointments(data);
        }
      } catch (err) {
        console.error(err);
        // setError("Failed to load upcoming appointments. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

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
    <div className="p-8 bg-gradient-to-b from-gray-50 to-white rounded-xl shadow-sm min-h-[500px] border border-gray-100">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800">
          Upcoming Appointments
        </h2>
        <div className="text-sm text-gray-500 bg-white py-1 px-3 rounded-full border border-gray-200 shadow-sm">
          {appointments.length} appointment{appointments.length !== 1 ? 's' : ''}
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center h-64">
          <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600">Loading your appointments...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 p-4 rounded-lg flex items-center text-red-700">
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
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Calendar size={24} className="text-gray-400" />
          </div>
          <p className="text-gray-500 text-lg">No upcoming appointments</p>
          <p className="text-gray-400 text-sm mt-1">Your schedule is clear for now</p>
        </div>
      )}

      {showForm && appointmentToReschedule && (
        <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity duration-300">
          <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md transform transition-all duration-300 scale-100">
            <RescheduleForm
              appointmentId={appointmentToReschedule}
              appointmentToReschedule = {appointmentToReschedule}
              onRescheduleSuccess={handleRescheduleSubmit}
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
          <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md transform transition-all duration-300 scale-100">
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