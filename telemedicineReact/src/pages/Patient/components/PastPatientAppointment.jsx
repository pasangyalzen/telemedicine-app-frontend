import React, { useState, useEffect } from 'react';
import { fetchPastAppointments, fetchConsultationByAppointmentId } from '../services/patientAppointmentApi';
import { History, FileText, ChevronDown, ChevronUp } from 'lucide-react';
import toast from 'react-hot-toast';

const PastAppointments = ({ patientId }) => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedAppointment, setExpandedAppointment] = useState(null);
  const [consultationDetails, setConsultationDetails] = useState({});
  const [consultationLoading, setConsultationLoading] = useState({});

  useEffect(() => {
    const loadAppointments = async () => {
      try {
        setLoading(true);
        const data = await fetchPastAppointments(patientId);
        setAppointments(data);
        setError(null);
      } catch (err) {
        setError("Failed to load past appointments");
        toast.error("Couldn't load past appointments");
      } finally {
        setLoading(false);
      }
    };

    loadAppointments();
  }, [patientId]);

  const toggleAppointmentDetails = async (appointmentId) => {
    if (expandedAppointment === appointmentId) {
      setExpandedAppointment(null);
      return;
    }
    
    setExpandedAppointment(appointmentId);
    
    if (!consultationDetails[appointmentId] && !consultationLoading[appointmentId]) {
      try {
        setConsultationLoading(prev => ({ ...prev, [appointmentId]: true }));
        const data = await fetchConsultationByAppointmentId(appointmentId);
        setConsultationDetails(prev => ({ ...prev, [appointmentId]: data }));
      } catch (err) {
        toast.error("Couldn't load consultation details");
      } finally {
        setConsultationLoading(prev => ({ ...prev, [appointmentId]: false }));
      }
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
        <h2 className="text-2xl font-semibold text-gray-800">Consultation History</h2>
        <div className="flex items-center space-x-2">
          <select className="bg-white border border-gray-300 rounded-md px-3 py-2 text-sm">
            <option>Last 3 months</option>
            <option>Last 6 months</option>
            <option>Last year</option>
          </select>
        </div>
      </div>

      {appointments.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
          <History className="w-12 h-12 text-gray-400 mx-auto mb-2" />
          <h3 className="text-lg font-medium text-gray-700">No past appointments</h3>
          <p className="text-gray-500 mt-1">You don't have any past appointment records.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {appointments.map((appointment) => (
            <div 
              key={appointment.appointmentId} 
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
            >
              <div 
                className="p-4 cursor-pointer hover:bg-gray-50 flex justify-between items-center"
                onClick={() => toggleAppointmentDetails(appointment.appointmentId)}
              >
                <div>
                  <div className="flex items-center">
                    <h3 className="text-lg font-medium text-gray-800">{appointment.doctorFullName}</h3>
                    <span className="ml-2 px-2 py-1 bg-gray-100 text-xs rounded-full text-gray-600">
                      {appointment.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {new Date(appointment.scheduledTime).toLocaleDateString(undefined, {
                      weekday: 'short',
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
                <div className="flex items-center">
                  {expandedAppointment === appointment.appointmentId ? (
                    <ChevronUp className="w-5 h-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-500" />
                  )}
                </div>
              </div>

              {expandedAppointment === appointment.appointmentId && (
                <div className="border-t border-gray-200 p-4 bg-gray-50">
                  {consultationLoading[appointment.appointmentId] ? (
                    <div className="flex justify-center py-4">
                      <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-teal-600"></div>
                    </div>
                  ) : consultationDetails[appointment.appointmentId] ? (
                    <div>
                      <h4 className="font-medium text-gray-700 mb-2">Consultation Details</h4>
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm text-gray-500">Doctor's Notes:</p>
                          <p className="text-sm text-gray-700 mt-1 bg-white p-2 rounded border border-gray-200">
                            {consultationDetails[appointment.appointmentId].notes || "No notes provided"}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Recommendations:</p>
                          <p className="text-sm text-gray-700 mt-1 bg-white p-2 rounded border border-gray-200">
                            {consultationDetails[appointment.appointmentId].recommendations || "No recommendations provided"}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Date Created:</p>
                          <p className="text-sm text-gray-700">
                            {new Date(consultationDetails[appointment.appointmentId].createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="mt-4 flex justify-end">
                        <button className="flex items-center text-teal-600 hover:text-teal-800 text-sm">
                          <FileText className="w-4 h-4 mr-1" />
                          Download Consultation Report
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-4 text-gray-500">
                      <p>No consultation details available for this appointment.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PastAppointments;