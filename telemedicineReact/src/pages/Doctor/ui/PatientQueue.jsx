import React, {useEffect} from "react";
import { FaVideo, FaRegCalendarAlt, FaTrashAlt, FaUserCircle } from 'react-icons/fa';
import ConfirmationModal from "../../../components/ConfirmationModal";
import { useState, useMemo } from "react";
import RescheduleForm from "../components/RescheduleForm";
import {rescheduleAppointment} from "../services/doctorAppointmentApi";
import { getEmailFromToken } from "../../auth/auth";

export default function PatientQueue({ appointments, handleJoinRoom, handleCancelClick, handleRescheduleButtonClick }) {
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
    <div className="w-full bg-gray-900 shadow-md rounded-lg border border-teal-800">
      <h3 className="text-lg font-semibold text-teal-400 p-3 border-b border-teal-700 flex items-center">
        <span className="bg-teal-600 text-white p-1 rounded-md mr-2 flex items-center justify-center w-6 h-6 text-sm">
          {appointments.length}
        </span>
        Patient Queue
      </h3>

      {appointments.length === 0 ? (
        <div className="py-8 flex flex-col items-center justify-center text-gray-400">
          <FaUserCircle className="text-4xl mb-2 text-teal-800 opacity-50" />
          <p className="text-center text-sm">No patients waiting</p>
        </div>
      ) : (
        <div className="max-h-[300px] overflow-y-auto space-y-2 p-2">
          {appointments.map((patient) => (
            <div
              key={patient.appointmentId}
              className="p-3 bg-gray-800 border-l-4 border-teal-500 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
            >
              {/* Patient Info */}
              <div className="flex items-center mb-2">
                <div className="w-8 h-8 rounded-full bg-teal-700 flex items-center justify-center text-white font-bold text-sm mr-2">
                  {patient.patientName.charAt(0).toUpperCase()}
                </div>
                <div className="overflow-hidden">
                  <p className="font-semibold text-white text-sm truncate">{patient.patientName}</p>
                  <div className="flex items-center text-teal-300 text-xs">
                    <FaRegCalendarAlt className="mr-1" />
                    <span>{useFormattedTime(patient.scheduledTime)}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-3 gap-1 mt-2">
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    const email = getEmailFromToken(); // Extract email from the token
                    const appointmentId = patient.appointmentId; // Extract the appointment ID
                    console.log(patient.appointmentId);

                    if (email && appointmentId) {
                      handleJoinRoom({ email, room: appointmentId }); // Join room with the email and appointmentId
                    } else {
                      console.error("Error: Missing email or appointmentId");
                    }
                  }}
                  className="flex items-center justify-center py-1 px-2 bg-green-600 text-white text-xs rounded hover:bg-green-700 transition-colors shadow-sm"
                >
                  <FaVideo className="mr-1" /> Join
                </a>
                <button 
                  onClick={() => handleRescheduleButtonClick(patient)} 
                  className="flex items-center justify-center py-1 px-2 bg-teal-600 text-white text-xs rounded hover:bg-teal-700 transition-colors shadow-sm"
                >
                  <FaRegCalendarAlt className="mr-1" /> Re
                </button>
                <button 
                  onClick={() => handleCancelClick(patient.appointmentId)}  
                  className="flex items-center justify-center py-1 px-2 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition-colors shadow-sm"
                >
                  <FaTrashAlt />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}