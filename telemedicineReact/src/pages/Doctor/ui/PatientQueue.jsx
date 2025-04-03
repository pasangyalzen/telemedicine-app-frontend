import React from "react";
import useDoctorDashboard from "../../../hooks/useDoctorDashboard"; // Import the custom hook

export default function PatientQueue() {
  const { appointments, loading, error } = useDoctorDashboard(); 
  console.log("APpoint",appointments);// Use the hook to get data

  if (loading) {
    return <div>Loading today's appointments...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="w-64 p-4 bg-black shadow-md rounded-md">
      <h3 className="text-lg font-bold rounded bg-black  text-teal-500 mb-3">Patient Queue</h3>

      {appointments.length === 0 ? (
        <p className="text-gray-500">No patients waiting</p>
      ) : (
        <div className="max-h-[300px] bg-black overflow-y-auto space-y-3">
          {appointments.map((patient) => (
            <div
              key={patient.appointmentId}
              className="p-2 bg-teal-700 border rounded-md shadow-sm flex justify-between items-center"
            >
              {/* Patient Info */}
              <div className="text-sm text-black">
                <p className="font-semibold">Name :{patient.patientName}</p>
                {/* <p className="text-gray-500">Age: {patient.age}</p> */}
                <p className="text-teal-5000">
                  Scheduled: {new Date(patient.scheduledTime).toLocaleString()}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col space-y-1">
                <a
                  href={patient.videoCallLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1 text-center bg-green-400 text-black text-xs rounded-md hover:bg-green-600 hover:text-white transition-all duration-200 ease-in-out transform hover:scale-105"
                >
                  Invite 
                </a>
                <button className="px-3 py-1 bg-blue-400 text-black text-xs rounded-md hover:bg-blue-600 hover:text-white transition-all duration-200 ease-in-out transform hover:scale-105">
                  View Details
                </button>
                <button className="px-3 py-1 bg-teal-400 text-black text-xs rounded-md hover:bg-teal-600 hover:text-white transition-all duration-200 ease-in-out transform hover:scale-105">
                    Reschedule
                </button>
                <button className="px-3 py-1 bg-red-400 text-black text-xs rounded-md hover:bg-red-600 hover:text-white transition-all duration-200 ease-in-out transform hover:scale-105">
                    Cancel Appointment
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}