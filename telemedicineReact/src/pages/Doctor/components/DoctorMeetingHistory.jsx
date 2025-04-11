import React, { useState } from "react";
import { Calendar, Clock, User, RefreshCw, X } from "lucide-react";

const AppointmentCard = ({ appointment, onAction }) => {
  const formatTime = (dateStr) => {
    return new Date(dateStr).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString([], { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="flex justify-between items-center p-4 bg-white rounded-lg shadow-md mb-4">
      <div className="flex-1">
        <div className="flex items-center mb-2">
          <User size={18} className="text-gray-500 mr-2" />
          <p className="font-semibold text-gray-800">{appointment.patientName}</p>
        </div>
        
        <div className="flex items-center mb-2">
          <Calendar size={18} className="text-gray-500 mr-2" />
          <p className="text-sm text-gray-600">{formatDate(appointment.date)}</p>
          <Clock size={18} className="text-gray-500 ml-4 mr-2" />
          <p className="text-sm text-gray-600">{formatTime(appointment.date)}</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-2">
        <button
          onClick={() => onAction(appointment.id, "reschedule")}
          className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
        >
          <RefreshCw size={14} className="mr-1" />
          Reschedule
        </button>
        <button
          onClick={() => onAction(appointment.id, "cancel")}
          className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
        >
          <X size={14} className="mr-1" />
          Cancel
        </button>
      </div>
    </div>
  );
};

const PastAppointments = ({ appointments, onAction }) => (
  <div className="mb-6">
    <h3 className="text-xl font-semibold text-gray-700 mb-4">Past Appointments</h3>
    <div className="space-y-4">
      {appointments.length === 0 ? (
        <p className="text-gray-400 text-sm">No past appointments</p>
      ) : (
        appointments.map((appt) => (
          <AppointmentCard
            key={appt.id}
            appointment={appt}
            onAction={onAction}
          />
        ))
      )}
    </div>
  </div>
);

export default function DoctorAppointments() {
  const [appointments, setAppointments] = useState([
    { id: 1, patientName: "John Doe", date: "2025-04-09T10:00:00", status: "Completed" },
    { id: 2, patientName: "Jane Smith", date: "2025-04-10T11:00:00", status: "Completed" },
    { id: 3, patientName: "Samuel Lee", date: "2025-04-08T14:00:00", status: "Completed" },
  ]);

  const handleAction = (id, action) => {
    alert(`${action === "reschedule" ? "Rescheduling" : "Cancelling"} appointment with ID: ${id}`);
  };

  const now = new Date();
  const pastAppointments = appointments.filter(
    appt => new Date(appt.date) < now
  );

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Past Appointments</h2>

      {/* Total Past Appointments Count */}
      <div className="bg-teal-600 text-white p-4 rounded mb-6">
        <h3 className="text-xl font-bold">Total Past Appointments: {pastAppointments.length}</h3>
      </div>

      {/* Past Appointments */}
      <PastAppointments
        appointments={pastAppointments}
        onAction={handleAction}
      />
    </div>
  );
}