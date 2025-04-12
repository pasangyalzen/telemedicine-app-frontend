import React, { useState, useEffect } from 'react';
import { fetchUpcomingAppointments, cancelAppointment, rescheduleAppointment } from '../services/patientAppointmentApi';
import { Calendar, Clock, AlertCircle } from 'lucide-react';
import RescheduleForm from '../../Doctor/components/RescheduleForm';
import toast from 'react-hot-toast';

const UpcomingAppointments = ({ patientId }) => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showReschedule, setShowReschedule] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  useEffect(() => {
    const loadAppointments = async () => {
      try {
        setLoading(true);
        const data = await fetchUpcomingAppointments(patientId);
        setAppointments(data);
        setError(null);
      } catch (err) {
        setError("Failed to load upcoming appointments");
        toast.error("Couldn't load upcoming appointments");
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
      const updatedAppointments = await fetchUpcomingAppointments(patientId);
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
        <h2 className="text-2xl font-semibold text-gray-800">Upcoming Appointments</h2>
      </div>

      {appointments.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
          <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-2" />
          <h3 className="text-lg font-medium text-gray-700">No upcoming appointments</h3>
          <p className="text-gray-500 mt-1">You don't have any appointments scheduled in the future.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">Doctor</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">Date & Time</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {appointments.map((appointment) => (
                <tr key={appointment.appointmentId} className="hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center mr-3">
                        <span className="text-teal-700 text-xs font-bold">
                          {appointment.doctorFullName
                            .split(' ')
                            .map(name => name[0])
                            .join('')}
                        </span>
                      </div>
                      <span className="font-medium text-gray-800">{appointment.doctorFullName}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="text-sm">
                      <div className="text-gray-800">
                        {new Date(appointment.scheduledTime).toLocaleDateString(undefined, {
                          weekday: 'short',
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </div>
                      <div className="text-gray-500">
                        {new Date(appointment.scheduledTime).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-block text-xs px-2 py-1 rounded
                      ${appointment.status === 'Confirmed' ? 'bg-green-100 text-green-800' :
                        appointment.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                        appointment.status === 'Completed' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'}`}>
                      {appointment.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    {appointment.status !== 'Cancelled' && appointment.status !== 'Completed' && (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => openRescheduleForm(appointment)}
                          className="text-sm text-teal-600 hover:text-teal-800"
                        >
                          Reschedule
                        </button>
                        <button
                          onClick={() => handleCancelAppointment(appointment.appointmentId)}
                          className="text-sm text-red-600 hover:text-red-800"
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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

export default UpcomingAppointments;