import { usePharmacistData } from "../usePharmacistData";
import { CalendarDays, Clock, User, Stethoscope, X, FileText, Pill } from "lucide-react";
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
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-slate-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="relative overflow-hidden bg-gradient-to-br from-teal-600 via-teal-700 to-cyan-800 rounded-3xl p-8 shadow-2xl">
          <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-white/20 to-transparent rounded-full -translate-y-32 translate-x-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-cyan-400/30 to-transparent rounded-full translate-y-24 -translate-x-24"></div>
          <div className="relative z-10">
            <h3 className="text-4xl font-bold mb-3 text-white tracking-tight">
              Completed Appointments
            </h3>
            <p className="text-teal-100 text-lg font-medium">
              Review all completed consultations in comprehensive detail
            </p>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 shadow-sm">
            <p className="text-red-600 text-center font-medium">{error}</p>
          </div>
        )}

        {/* Appointments Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {completedAppointments.length > 0 ? (
            completedAppointments.map((appointment) => (
              <div
                key={appointment.appointmentId}
                className="group relative bg-white rounded-3xl p-8 border border-teal-100 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden"
              >
                {/* Card Background Pattern */}
                <div className="absolute inset-0 bg-gradient-to-br from-teal-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-teal-100/30 to-transparent rounded-full -translate-y-12 translate-x-12"></div>
                
                <div className="relative z-10 space-y-6">
                  {/* Date and Time Section */}
                  <div className="space-y-3">
                    <div className="flex items-center group-hover:scale-105 transition-transform duration-300">
                      <div className="p-2 bg-teal-100 rounded-xl mr-4">
                        <CalendarDays className="w-6 h-6 text-teal-600" />
                      </div>
                      <span className="font-bold text-lg text-gray-800">
                        {new Date(appointment.appointmentDate).toLocaleDateString('en-US', {
                          weekday: 'short',
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                    </div>

                    <div className="flex items-center ml-2">
                      <Clock className="w-5 h-5 text-teal-500 mr-3" />
                      <span className="text-gray-600 font-medium">
                        {appointment.startTime} - {appointment.endTime}
                      </span>
                    </div>
                  </div>

                  {/* People Section */}
                  <div className="space-y-4 bg-teal-50/50 rounded-2xl p-5">
                    <div className="flex items-center">
                      <div className="p-2 bg-white rounded-lg mr-4 shadow-sm">
                        <Stethoscope className="w-5 h-5 text-teal-600" />
                      </div>
                      <div>
                        <span className="text-sm text-gray-500 font-medium block">Doctor</span>
                        <span className="text-gray-800 font-semibold">{appointment.doctorName}</span>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <div className="p-2 bg-white rounded-lg mr-4 shadow-sm">
                        <User className="w-5 h-5 text-cyan-600" />
                      </div>
                      <div>
                        <span className="text-sm text-gray-500 font-medium block">Patient</span>
                        <span className="text-gray-800 font-semibold">{appointment.patientName}</span>
                      </div>
                    </div>
                  </div>

                  {/* Reason Section */}
                  <div className="bg-gradient-to-r from-cyan-50 to-teal-50 rounded-2xl p-4">
                    <div className="flex items-start">
                      <FileText className="w-5 h-5 text-teal-600 mr-3 mt-0.5 flex-shrink-0" />
                      <div>
                        <span className="text-sm text-gray-500 font-medium block mb-1">Reason</span>
                        <span className="text-gray-700 font-medium leading-relaxed">{appointment.reason}</span>
                      </div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex justify-between items-center pt-4">
                    <span className="px-4 py-2 bg-gradient-to-r from-emerald-100 to-teal-100 text-teal-700 rounded-2xl text-sm font-bold shadow-sm">
                      ✓ {appointment.status}
                    </span>
                    <button
                      onClick={() => handleViewDetails(appointment.appointmentId)}
                      className="px-6 py-3 bg-gradient-to-r from-teal-600 to-cyan-600 text-white font-bold rounded-2xl hover:from-teal-700 hover:to-cyan-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-20">
              <div className="w-24 h-24 bg-teal-100 rounded-full flex items-center justify-center mb-6">
                <CalendarDays className="w-12 h-12 text-teal-400" />
              </div>
              <p className="text-gray-400 text-xl font-medium">No completed appointments found</p>
              <p className="text-gray-300 text-sm mt-2">Completed appointments will appear here</p>
            </div>
          )}
        </div>

        {/* Modal */}
        {selectedAppointmentId && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full relative max-h-[90vh] overflow-hidden">
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-teal-600 to-cyan-600 p-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full -translate-y-16 translate-x-16"></div>
                <div className="relative z-10 flex justify-between items-center">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-1">Consultation Details</h3>
                    <p className="text-teal-100">Complete prescription information</p>
                  </div>
                  <button
                    onClick={() => setSelectedAppointmentId(null)}
                    className="p-2 bg-white/20 hover:bg-white/30 rounded-xl text-white transition-colors duration-200"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-8 overflow-y-auto max-h-[calc(90vh-120px)]">
                {loadingConsultation ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-teal-200 border-t-teal-600"></div>
                    <span className="ml-4 text-gray-600 font-medium">Loading consultation details...</span>
                  </div>
                ) : !selectedDetails ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FileText className="w-8 h-8 text-red-400" />
                    </div>
                    <p className="text-red-600 font-medium text-lg">Consultation not available</p>
                    <p className="text-gray-500 text-sm mt-2">Consultation has not been added yet for this appointment</p>
                  </div>
                ) : (
                  <div className="space-y-8">
                    {/* Basic Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-teal-50 rounded-2xl p-5">
                        <div className="flex items-center mb-3">
                          <Stethoscope className="w-5 h-5 text-teal-600 mr-2" />
                          <span className="font-semibold text-teal-700">Doctor</span>
                        </div>
                        <p className="text-gray-800 font-medium">{selectedDetails.doctorName}</p>
                      </div>
                      <div className="bg-cyan-50 rounded-2xl p-5">
                        <div className="flex items-center mb-3">
                          <User className="w-5 h-5 text-cyan-600 mr-2" />
                          <span className="font-semibold text-cyan-700">Patient</span>
                        </div>
                        <p className="text-gray-800 font-medium">{selectedDetails.patientName}</p>
                      </div>
                    </div>

                    {/* Notes and Recommendations */}
                    <div className="space-y-6">
                      <div className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-2xl p-6">
                        <h4 className="font-bold text-teal-700 mb-3 flex items-center">
                          <FileText className="w-5 h-5 mr-2" />
                          Clinical Notes
                        </h4>
                        <p className="text-gray-700 leading-relaxed">{selectedDetails.notes}</p>
                      </div>

                      <div className="bg-gradient-to-r from-cyan-50 to-teal-50 rounded-2xl p-6">
                        <h4 className="font-bold text-cyan-700 mb-3 flex items-center">
                          <Stethoscope className="w-5 h-5 mr-2" />
                          Recommendations
                        </h4>
                        <p className="text-gray-700 leading-relaxed">{selectedDetails.recommendations}</p>
                      </div>
                    </div>

                    {/* Prescription Items */}
                    <div className="bg-white border-2 border-teal-100 rounded-2xl p-6">
                      <h4 className="text-xl font-bold text-teal-700 mb-6 flex items-center">
                        <Pill className="w-6 h-6 mr-3" />
                        Prescription Items
                      </h4>
                      {selectedDetails.prescriptionItems.length > 0 ? (
                        <div className="space-y-4">
                          {selectedDetails.prescriptionItems.map((item, idx) => (
                            <div key={idx} className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-xl p-5 border border-teal-100">
                              <div className="flex items-start">
                                <div className="p-2 bg-white rounded-lg mr-4 shadow-sm">
                                  <Pill className="w-5 h-5 text-teal-600" />
                                </div>
                                <div className="flex-1">
                                  <h5 className="font-bold text-gray-800 text-lg mb-2">{item.medicineName}</h5>
                                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                                    <div>
                                      <span className="text-gray-500 font-medium block">Dosage</span>
                                      <span className="text-gray-700 font-semibold">{item.dosage}</span>
                                    </div>
                                    <div>
                                      <span className="text-gray-500 font-medium block">Frequency</span>
                                      <span className="text-gray-700 font-semibold">{item.frequency}</span>
                                    </div>
                                    <div>
                                      <span className="text-gray-500 font-medium block">Duration</span>
                                      <span className="text-gray-700 font-semibold">{item.duration}</span>
                                    </div>
                                  </div>
                                  {item.notes && (
                                    <div className="mt-3 bg-white/70 rounded-lg p-3">
                                      <span className="text-gray-500 font-medium text-xs block mb-1">Special Instructions</span>
                                      <span className="text-gray-600 text-sm">{item.notes}</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Pill className="w-8 h-8 text-gray-400" />
                          </div>
                          <p className="text-gray-500 font-medium">No prescription items found</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Appointments;