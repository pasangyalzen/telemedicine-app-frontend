import React, { useState } from "react";

export default function DoctorAnalytics() {
  // Mock data for appointments
  const [appointments, setAppointments] = useState([
    { id: 1, patientName: "John Doe", date: "2025-04-06 10:00 AM", status: "Scheduled" },
    { id: 2, patientName: "Jane Smith", date: "2025-04-06 11:00 AM", status: "Scheduled" },
    { id: 3, patientName: "Samuel Lee", date: "2025-04-06 02:00 PM", status: "Scheduled" },
  ]);
  
  const totalAppointments = appointments.length;

  // Function to handle reschedule or cancel actions
  const handleAction = (id, action) => {
    if (action === "reschedule") {
      alert(`Rescheduling appointment with id: ${id}`);
      // Add your reschedule logic here
    } else if (action === "cancel") {
      alert(`Cancelling appointment with id: ${id}`);
      // Add your cancel logic here
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow mb-6">
      <h2 className="text-2xl font-bold mb-4">Appointments</h2>
      <p className="text-gray-600 text-sm mb-4">
        Here are your total appointments, reschedule or cancel as needed.
      </p>
      
      {/* Total Appointments Section */}
      <div className="bg-teal-600 text-white p-4 rounded mb-6">
        <h3 className="text-xl font-bold">Total Appointments: {totalAppointments}</h3>
      </div>

      {/* Appointments List Section */}
      <div className="bg-gray-100 p-4 rounded-lg shadow">
        <h4 className="text-lg font-semibold mb-4">Appointments</h4>
        <div className="space-y-4">
          {appointments.map((appointment) => (
            <div key={appointment.id} className="flex justify-between items-center p-4 bg-white rounded-lg shadow">
              <div>
                <p className="font-semibold">{appointment.patientName}</p>
                <p className="text-sm text-gray-600">{appointment.date}</p>
                <p className="text-xs text-gray-400">{appointment.status}</p>
              </div>
              
              <div className="flex space-x-4">
                <button
                  onClick={() => handleAction(appointment.id, "reschedule")}
                  className="text-teal-600 hover:text-teal-800"
                >
                  Reschedule
                </button>
                <button
                  onClick={() => handleAction(appointment.id, "cancel")}
                  className="text-red-600 hover:text-red-800"
                >
                  Cancel
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}