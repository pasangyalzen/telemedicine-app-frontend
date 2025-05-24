import { usePharmacistData } from "../usePharmacistData";
import { CalendarDays, Clock, User, Stethoscope, X } from "lucide-react";
import { useState } from "react";

const Appointments = () => {
  const {
    completedAppointments,
    consultationPrescriptions,
    fetchConsultationPrescriptions,
    error,
  } = usePharmacistData();

  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);
  const [loadingConsultation, setLoadingConsultation] = useState(false);

  const handleViewDetails = async (appointmentId) => {
    setLoadingConsultation(true);
    await fetchConsultationPrescriptions(appointmentId);
    setSelectedAppointmentId(appointmentId);
    setLoadingConsultation(false);
  };

  const selectedDetails =
    selectedAppointmentId && consultationPrescriptions[selectedAppointmentId];

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-cyan-700 to-teal-800 rounded-2xl p-6 text-white shadow-lg">
        <h3 className="text-2xl font-bold mb-1">Completed Appointments</h3>
        <p className="text-teal-100/80">Review all completed consultations in detail</p>
      </div>

      {error && <p className="text-red-500 text-center">{error}</p>}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {completedAppointments.length > 0 ? (
          completedAppointments.map((appointment) => (
            <div
              key={appointment.appointmentId}
              className="bg-white rounded-2xl p-6 border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="space-y-2 text-gray-800">
                <div className="flex items-center">
                  <CalendarDays className="w-5 h-5 text-cyan-600 mr-2" />
                  <span className="font-semibold">
                    {new Date(appointment.appointmentDate).toLocaleDateString()}
                  </span>
                </div>

                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="w-4 h-4 text-cyan-500 mr-2" />
                  <span>
                    {appointment.startTime} - {appointment.endTime}
                  </span>
                </div>

                <div className="flex items-center text-sm">
                  <Stethoscope className="w-4 h-4 text-teal-600 mr-2" />
                  <span className="text-gray-700 font-medium">Doctor:</span>
                  <span className="ml-1 text-gray-600">{appointment.doctorName}</span>
                </div>

                <div className="flex items-center text-sm">
                  <User className="w-4 h-4 text-teal-600 mr-2" />
                  <span className="text-gray-700 font-medium">Patient:</span>
                  <span className="ml-1 text-gray-600">{appointment.patientName}</span>
                </div>

                <p className="text-sm text-gray-500 mt-2">
                  Reason: <span className="text-gray-700 font-medium">{appointment.reason}</span>
                </p>
              </div>

              <div className="mt-4 flex justify-between items-center">
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                  {appointment.status}
                </span>
                <button
                  onClick={() => handleViewDetails(appointment.appointmentId)}
                  className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-teal-600 text-white text-sm font-semibold rounded-xl hover:from-cyan-700 hover:to-teal-700 transition-all duration-300 shadow-md"
                >
                  View Details
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-400 col-span-2 text-center">No completed appointments found.</p>
        )}
      </div>

      {selectedAppointmentId && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex items-center justify-center">
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-lg w-full relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedAppointmentId(null)}
              className="absolute top-3 right-4 text-gray-500 hover:text-gray-700"
            >
              <X className="w-6 h-6" />
            </button>
            <h3 className="text-xl font-bold text-teal-700 mb-4">Consultation & Prescription</h3>

            {loadingConsultation ? (
              <p className="text-gray-600">Loading...</p>
            ) : !selectedDetails ? (
              <p className="text-red-500">Consultation has not been added yet for this appointment.</p>
            ) : (
              <>
                <p className="text-sm mb-2 text-gray-700">
                  <strong>Doctor:</strong> {selectedDetails.doctorName}
                </p>
                <p className="text-sm mb-2 text-gray-700">
                  <strong>Patient:</strong> {selectedDetails.patientName}
                </p>
                <p className="text-sm mb-2 text-gray-700">
                  <strong>Notes:</strong> {selectedDetails.notes}
                </p>
                <p className="text-sm mb-4 text-gray-700">
                  <strong>Recommendations:</strong> {selectedDetails.recommendations}
                </p>

                <h4 className="text-md font-semibold text-teal-700 mb-2">Prescription Items</h4>
                {selectedDetails.prescriptionItems.length > 0 ? (
                  <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                    {selectedDetails.prescriptionItems.map((item, idx) => (
                      <li key={idx}>
                        <strong>{item.medicineName}</strong> - {item.dosage}, {item.frequency}, {item.duration}
                        {item.notes && (
                          <span className="block text-xs text-gray-500">Note: {item.notes}</span>
                        )}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 text-sm">No prescription items found.</p>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Appointments;