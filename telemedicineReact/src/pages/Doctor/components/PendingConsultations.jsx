import React, { useEffect, useState } from "react";
import { Calendar, Clock, User, AlertCircle, FilePlus2, Stethoscope } from "lucide-react";
import {
  getDoctorIdByEmail,
  getDoctorPastAppointments,
} from "../services/doctorAppointmentApi";
import { getEmailFromToken } from "../../auth/auth";

const AppointmentCard = ({ appointment }) => {
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

  const handleAddConsultation = () => {
    console.log("Add Consultation clicked for appointment:", appointment.appointmentId);
    // You can navigate or open a modal here
  };

  const handleAddPrescription = () => {
    console.log("Add Prescription clicked for appointment:", appointment.appointmentId);
    // You can navigate or open a modal here
  };

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-5 bg-white rounded-xl shadow-sm mb-4 hover:shadow-md transition-all duration-300 border border-gray-100">
      {/* Left color indicator */}
      <div className="w-1 self-stretch rounded-full mr-4 bg-gray-400"></div>

      <div className="flex-1 w-full">
        {/* Patient Name */}
        <div className="flex items-center mb-3">
          <User size={18} className="text-indigo-500 mr-2" />
          <span className="font-semibold text-gray-800">
            {appointment.patientName}
          </span>
        </div>

        {/* Date & Time */}
        <div className="flex items-center text-sm text-gray-600 mb-4">
          <Calendar size={16} className="text-gray-500 mr-2" />
          <span className="font-medium">
            {formatDate(appointment.scheduledTime)}
          </span>
          <Clock size={16} className="text-gray-500 ml-4 mr-2" />
          <span className="font-medium">
            {formatTime(appointment.scheduledTime)}
          </span>
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleAddConsultation}
            className="flex items-center bg-indigo-100 text-indigo-600 hover:bg-indigo-200 px-3 py-1.5 text-sm rounded-md transition-all"
          >
            <Stethoscope size={16} className="mr-1" />
            Add Consultation
          </button>
          <button
            onClick={handleAddPrescription}
            className="flex items-center bg-green-100 text-green-600 hover:bg-green-200 px-3 py-1.5 text-sm rounded-md transition-all"
          >
            <FilePlus2 size={16} className="mr-1" />
            Add Prescription
          </button>
        </div>
      </div>
    </div>
  );
};

const PendingConsultations = () => {
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      setIsLoading(true);
      try {
        const email = getEmailFromToken();
        if (!email) throw new Error("Email not found in token.");
        const doctorId = await getDoctorIdByEmail(email);
        const data = await getDoctorPastAppointments(doctorId);
        setAppointments(data);
        setError(null);
      } catch (err) {
        console.error("Failed to load appointments:", err);
        setError("Failed to load past appointments. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  return (
    <div className="p-8 bg-gradient-to-b from-gray-50 to-white rounded-xl shadow-sm min-h-[500px] border border-gray-100">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800">
          Past Appointments
        </h2>
        <div className="text-sm text-gray-500 bg-white py-1 px-3 rounded-full border border-gray-200 shadow-sm">
          {appointments.length} past appointment{appointments.length !== 1 ? "s" : ""}
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
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Calendar size={24} className="text-gray-400" />
          </div>
          <p className="text-gray-500 text-lg">No past appointments</p>
          <p className="text-gray-400 text-sm mt-1">
            You haven't had any appointments yet.
          </p>
        </div>
      )}
    </div>
  );
};

export default PendingConsultations;