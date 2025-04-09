import React, {useEffect} from "react";
// import useDoctorDashboard from "../../../hooks/useDoctorDashboard"; // Import the custom hook
import { FaVideo, FaRegCalendarAlt, FaTrashAlt } from 'react-icons/fa'; // Importing icons
import ConfirmationModal from "../../../components/ConfirmationModal";
import { useState, useMemo } from "react";
import RescheduleForm from "../components/RescheduleForm";
import {rescheduleAppointment} from "../services/doctorAppointmentApi";

export default function PatientQueue({ appointments, handleRescheduleButtonClick }) {
  function useFormattedTime(time) {
    return useMemo(() => {
      // If time is provided, extract hours and minutes
      if (time) {
        const timeParts = time.split("T")[1].split(".")[0]; // Extract time in HH:MM:SS format
        const [hours, minutes] = timeParts.split(":");
  
        let hourIn12HrFormat = parseInt(hours) % 12; // Convert to 12-hour format
        hourIn12HrFormat = hourIn12HrFormat ? hourIn12HrFormat : 12; // 0 becomes 12 (midnight)
        const ampm = parseInt(hours) >= 12 ? "PM" : "AM"; // Determine AM/PM
  
        // Return the formatted time in 12-hour format with AM/PM
        return `${hourIn12HrFormat}:${minutes} ${ampm}`;
      }
  
      return ''; // Return empty string if time is not provided
    }, [time]);
  }
 
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
                Time: {useFormattedTime(patient.scheduledTime)}
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
                <button onClick={() => handleRescheduleButtonClick(patient)} className="flex items-center justify-center px-3 py-1 bg-teal-500 text-white text-xs rounded-md hover:bg-teal-600 transition-all duration-200 ease-in-out">
                  <FaRegCalendarAlt className="mr-1" /> Reschedule
                </button>
                <button onClick={() => handleCancelClick(patient.appointmentId)}  className="flex items-center justify-center px-3 py-1 bg-red-500 text-white text-xs rounded-md hover:bg-red-600 transition-all duration-200 ease-in-out">
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