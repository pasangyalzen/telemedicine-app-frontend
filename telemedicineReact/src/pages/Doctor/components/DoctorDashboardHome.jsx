import React, { useState } from "react";

export default function AppointmentSummary() {
  const [appointments, setAppointments] = useState([
    { id: 1, patientName: "John Doe", date: "2025-04-09T10:00:00", status: "Scheduled" },
    { id: 2, patientName: "Jane Smith", date: "2025-04-10T11:00:00", status: "Confirmed" },
    { id: 3, patientName: "Samuel Lee", date: "2025-04-08T14:00:00", status: "Completed" },
    { id: 4, patientName: "Maria Garcia", date: "2025-04-09T15:30:00", status: "Scheduled" },
    { id: 5, patientName: "Robert Johnson", date: "2025-04-07T09:15:00", status: "NoShow" },
    { id: 6, patientName: "Alice Wang", date: "2025-04-09T12:30:00", status: "Rescheduled" }
  ]);

  // Count appointments by status
  const statusCounts = appointments.reduce((acc, appt) => {
    acc[appt.status] = (acc[appt.status] || 0) + 1;
    return acc;
  }, {});

  const todayStr = new Date().toDateString();
  const todayAppointments = appointments.filter(
    appt => new Date(appt.date).toDateString() === todayStr
  );

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Appointments Summary</h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
          <p className="text-sm text-blue-600 font-medium">Total Appointments</p>
          <p className="text-2xl font-bold text-gray-800">{appointments.length}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg border border-green-100">
          <p className="text-sm text-green-600 font-medium">Confirmed</p>
          <p className="text-2xl font-bold text-gray-800">{statusCounts.Confirmed || 0}</p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
          <p className="text-sm text-gray-600 font-medium">Completed</p>
          <p className="text-2xl font-bold text-gray-800">{statusCounts.Completed || 0}</p>
        </div>
        <div className="bg-red-50 p-4 rounded-lg border border-red-100">
          <p className="text-sm text-red-600 font-medium">No Shows</p>
          <p className="text-2xl font-bold text-gray-800">{statusCounts.NoShow || 0}</p>
        </div>
        <div className="bg-teal-50 p-4 rounded-lg border border-teal-100">
          <p className="text-sm text-teal-600 font-medium">Today's Appointments</p>
          <p className="text-2xl font-bold text-gray-800">{todayAppointments.length}</p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
          <p className="text-sm text-yellow-600 font-medium">Rescheduled</p>
          <p className="text-2xl font-bold text-gray-800">{statusCounts.Rescheduled || 0}</p>
        </div>
      </div>
    </div>
  );
}