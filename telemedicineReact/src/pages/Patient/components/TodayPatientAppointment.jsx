import React, { useState, useEffect } from 'react';
import { fetchTodaysAppointments, cancelAppointment } from '../services/patientAppointmentApi';
import { CalendarDays, Clock, Video, X } from 'lucide-react';
import RescheduleForm from '../../Doctor/components/RescheduleForm';
import toast from 'react-hot-toast';

const TodayAppointments = ({ patientId }) => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showReschedule, setShowReschedule] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  useEffect(() => {
    const loadAppointments = async () => {
      try {
        setLoading(true);
        const data = await fetchTodaysAppointments(patientId);
        setAppointments(data);
        setError(null);
      } catch (err) {
        setError("Failed to load today's appointments");
        toast.error("Couldn't load today's appointments");
      } finally {
        setLoading(false);
      }
    };

    loadAppointments();
  }, [patientId]);

  const handleCancelAppointment = async (appointmentId) => {
    if (window.confirm("Are you sure you want to cancel this appointment?")) {
      try {
        await cancelAppointment(appointmentId);
        setAppointments(appointments.filter(app => app.appointmentId !== appointmentId));
        toast.success("Appointment cancelled successfully");
      } catch (err) {
        toast.error("Failed to cancel appointment");
      }
    }
  };

  const openRescheduleForm = (appointment) => {
    setSelectedAppointment(appointment);
    setShowReschedule(true);
  };

  const handleRescheduleSubmit = async (appointmentId, newDateTime) => {
    try {
      await rescheduleAppointment(appointmentId, newDateTime);
      // Update the UI by refetching appointments
      const updatedAppointments = await fetchTodaysAppointments(patientId);
      setAppointments(updatedAppointments);
      return true;
    } catch (err) {
      console.error("Failed to reschedule:", err);
      throw err;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Today's Appointments</h2>
        <button className="bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-700 transition flex items-center">
          <CalendarDays className="w-4 h-4 mr-2" />
          Book New Appointment
        </button>
      </div>

      {appointments.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
          <CalendarDays className="w-12 h-12 text-gray-400 mx-auto mb-2" />
          <h3 className="text-lg font-medium text-gray-700">No appointments scheduled for today</h3>
          <p className="text-gray-500 mt-1">Your schedule is clear for the day.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {appointments.map((appointment) => (
            <div key={appointment.appointmentId} className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
              <div className="flex justify-between flex-col md:flex-row">
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                    <span className="text-teal-700 font-bold">
                      {appointment.doctorName
                        .split(' ')
                        .map(name => name[0])
                        .join('')}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-teal-700">{appointment.doctorName}</h3>
                    <p className="text-sm text-gray-600">
                      <Clock className="w-4 h-4 inline mr-1" /> 
                      {new Date(appointment.scheduledTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                    <div className="mt-2 flex">
                      <span className={`inline-block text-xs px-2 py-1 rounded
                        ${appointment.status === 'Confirmed' ? 'bg-green-100 text-green-800' :
                          appointment.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                          appointment.status === 'Completed' ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'}`}>
                        {appointment.status}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="mt-4 md:mt-0 flex flex-col md:items-end space-y-2">
                  {appointment.status === 'Confirmed' && (
                    <button className="bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-700 transition flex items-center justify-center">
                      <Video className="w-4 h-4 mr-2" />
                      Start Appointment
                    </button>
                  )}
                  {appointment.status !== 'Cancelled' && appointment.status !== 'Completed' && (
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => openRescheduleForm(appointment)}
                        className="text-gray-600 hover:text-teal-600 text-sm"
                      >
                        Reschedule
                      </button>
                      <button 
                        onClick={() => handleCancelAppointment(appointment.appointmentId)}
                        className="text-red-600 hover:text-red-700 text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showReschedule && selectedAppointment && (
        <RescheduleForm
          appointmentId={selectedAppointment.appointmentId}
          onSubmit={handleRescheduleSubmit}
          onCancel={() => {
            setShowReschedule(false);
            setSelectedAppointment(null);
          }}
        />
      )}
    </div>
  );
};

export default TodayAppointments;