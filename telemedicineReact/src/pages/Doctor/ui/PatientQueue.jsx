import React from "react";
import useDoctorDashboard from "../../../hooks/useDoctorDashboard"; // Import the custom hook
import { FaVideo, FaRegCalendarAlt, FaTrashAlt } from 'react-icons/fa'; // Importing icons
import ConfirmationModal from "../../../components/ConfirmationModal";
import { useState } from "react";

export default function PatientQueue() {
  const { appointments, loading, error, handleCancelAppointment, handleRescheduleAppointment } = useDoctorDashboard(); 
  const [showModal, setShowModal] = useState(false); // State for the modal visibility
  const [appointmentToCancel, setAppointmentToCancel] = useState(null); // Store the appointment to cancel

  console.log("Appointments", appointments); // Use the hook to get data

  if (loading) {
    return <div className="text-center text-lg text-gray-500">Loading today's appointments...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  const handleRescheduleClick = () => {
    const response = handleRescheduleAppointment(appointments.appointmentId);
    return response;
    
  }

  const handleCancelClick = (appointmentId) => {
    setAppointmentToCancel(appointmentId); // Set the appointment to cancel
    setShowModal(true); // Show the confirmation modal
  };

  const handleConfirmCancel = async () => {
    if (appointmentToCancel) {
      const response = await handleCancelAppointment(appointmentToCancel.appointmentId);
      if (response) {
        setShowModal(false); // Close the modal on successful cancellation
      }
    }
  };

  const handleCancelModal = () => {
    setShowModal(false); // Close the modal without canceling
    setAppointmentToCancel(null); // Reset the appointment to cancel
  };
  return (
    <div className="w-64 p-4 bg-black shadow-lg rounded-lg">
      <h3 className="text-lg font-semibold text-teal-500 mb-4 border-b border-teal-500 pb-2">Patient Queue</h3>

      {appointments.length === 0 ? (
        <p className="text-gray-400 text-center">No patients waiting</p>
      ) : (
        <div className="max-h-[300px] bg-gray-800 overflow-y-auto space-y-3">
          {appointments.map((patient) => (
            <div
              key={patient.appointmentId}
              className="p-4 bg-white border border-gray-600 rounded-lg shadow-md flex justify-between items-center"
            >
              {/* Patient Info */}
              <div className="text-sm text-black">
                <p className="font-semibold">Name: {patient.patientName}</p>
                <p className="text-gray-700">
                  Time: {new Date(patient.scheduledTime).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true, // set to false for 24-hour format
                  })}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col space-y-1">
                <a
                  href={patient.videoCallLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center px-3 py-1 bg-green-500 text-white text-xs rounded-md hover:bg-green-600 transition-all duration-200 ease-in-out"
                >
                  <FaVideo className="mr-1" /> Join
                </a>
                <button onClick={handleRescheduleClick} className="flex items-center justify-center px-3 py-1 bg-teal-500 text-white text-xs rounded-md hover:bg-teal-600 transition-all duration-200 ease-in-out">
                  <FaRegCalendarAlt className="mr-1" /> Reschedule
                </button>
                <button onClick={() => handleCancelClick(appointments.appointmentId)}  className="flex items-center justify-center px-3 py-1 bg-red-500 text-white text-xs rounded-md hover:bg-red-600 transition-all duration-200 ease-in-out">
                  <FaTrashAlt className="mr-1" /> Cancel
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}