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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Compact Header Section */}
        <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-700 rounded-2xl p-6 shadow-xl">
          <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent backdrop-blur-sm"></div>
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-white/20 to-purple-400/20 rounded-full blur-2xl"></div>
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-gradient-to-tr from-blue-400/30 to-transparent rounded-full blur-xl"></div>
          <div className="absolute top-5 right-10 w-16 h-16 bg-white/10 rounded-full animate-pulse"></div>
          <div className="absolute bottom-5 left-10 w-12 h-12 bg-purple-400/20 rounded-full animate-bounce"></div>
          <div className="relative z-10 text-center">
            <div className="inline-flex items-center justify-center w-10 h-10 bg-white/20 rounded-xl mb-4 backdrop-blur-sm">
              <CalendarDays className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-3xl font-extrabold mb-2 text-white tracking-tight bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text">
              Completed Appointments
            </h3>
            <p className="text-blue-100 text-base font-medium max-w-xl mx-auto leading-relaxed">
              Comprehensive review of all completed consultations with detailed prescription information
            </p>
          </div>
        </div>

        {/* Compact Error Message */}
        {error && (
          <div className="relative bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200 rounded-2xl p-4 shadow-lg">
            <div className="absolute top-0 right-0 w-12 h-12 bg-red-100/50 rounded-full -translate-y-6 translate-x-6"></div>
            <div className="relative flex items-center">
              <div className="w-8 h-8 bg-red-100 rounded-xl flex items-center justify-center mr-3">
                <X className="w-4 h-4 text-red-600" />
              </div>
              <p className="text-red-700 font-semibold text-base">{error}</p>
            </div>
          </div>
        )}

        {/* Compact Appointments Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {completedAppointments.length > 0 ? (
            completedAppointments.map((appointment) => (
              <div
                key={appointment.appointmentId}
                className="group relative bg-white/80 backdrop-blur-sm rounded-2xl p-5 border border-white/50 shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-2 hover:scale-105 overflow-hidden"
              >
                {/* Compact Card Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/80 via-indigo-50/60 to-purple-50/80 opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                <div className="absolute -top-6 -right-6 w-20 h-20 bg-gradient-to-br from-indigo-200/30 to-purple-200/30 rounded-full blur-lg group-hover:scale-125 transition-transform duration-500"></div>
                <div className="absolute -bottom-6 -left-6 w-16 h-16 bg-gradient-to-tr from-blue-200/30 to-indigo-200/30 rounded-full blur-md group-hover:scale-110 transition-transform duration-500"></div>
                
                <div className="relative z-10 space-y-4">
                  {/* Compact Date and Time Section */}
                  <div className="space-y-3">
                    <div className="flex items-center group-hover:scale-105 transition-transform duration-300">
                      <div className="p-2 bg-gradient-to-br from-indigo-100 to-blue-100 rounded-lg mr-3 shadow-sm">
                        <CalendarDays className="w-3 h-3 text-indigo-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Date</p>
                        <span className="font-bold text-sm text-gray-800">
                          {new Date(appointment.appointmentDate).toLocaleDateString('en-US', {
                            weekday: 'short',
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center ml-1">
                      <div className="p-1.5 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg mr-2.5 shadow-sm">
                        <Clock className="w-3 h-3 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Time</p>
                        <span className="text-gray-700 font-semibold text-sm">
                          {appointment.startTime} - {appointment.endTime}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Compact People Section */}
                  <div className="space-y-3 bg-gradient-to-br from-slate-50/80 to-blue-50/80 rounded-2xl p-4 backdrop-blur-sm border border-white/50">
                    <div className="flex items-center">
                      <div className="p-2 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-lg mr-3 shadow-sm">
                        <Stethoscope className="w-3 h-3 text-emerald-600" />
                      </div>
                      <div className="flex-1">
                        <span className="text-xs text-gray-500 font-semibold uppercase tracking-wide block">Doctor</span>
                        <span className="text-gray-800 font-bold text-sm">{appointment.doctorName}</span>
                      </div>
                    </div>

                    <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>

                    <div className="flex items-center">
                      <div className="p-2 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-lg mr-3 shadow-sm">
                        <User className="w-3 h-3 text-purple-600" />
                      </div>
                      <div className="flex-1">
                        <span className="text-xs text-gray-500 font-semibold uppercase tracking-wide block">Patient</span>
                        <span className="text-gray-800 font-bold text-sm">{appointment.patientName}</span>
                      </div>
                    </div>
                  </div>

                  {/* Compact Reason Section */}
                  <div className="relative bg-gradient-to-r from-amber-50 via-orange-50 to-red-50 rounded-2xl p-4 border border-orange-100/50 shadow-sm">
                    <div className="absolute top-0 right-0 w-10 h-10 bg-gradient-to-br from-orange-200/30 to-transparent rounded-full -translate-y-5 translate-x-5"></div>
                    <div className="relative flex items-start">
                      <div className="p-1.5 bg-gradient-to-br from-orange-100 to-amber-100 rounded-lg mr-2.5 shadow-sm flex-shrink-0">
                        <FileText className="w-3 h-3 text-orange-600" />
                      </div>
                      <div className="flex-1">
                        <span className="text-xs text-gray-500 font-semibold uppercase tracking-wide block mb-1">Consultation Reason</span>
                        <span className="text-gray-700 font-medium leading-relaxed text-xs">{appointment.reason}</span>
                      </div>
                    </div>
                  </div>

                  {/* Compact Footer */}
                  <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2 animate-pulse"></div>
                      <span className="px-3 py-1.5 bg-gradient-to-r from-emerald-100 via-green-100 to-teal-100 text-emerald-700 rounded-xl text-xs font-bold shadow-sm border border-emerald-200">
                        {appointment.status}
                      </span>
                    </div>
                    <button
                      onClick={() => handleViewDetails(appointment.appointmentId)}
                      className="group/btn relative px-4 py-2 bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 text-white font-bold rounded-xl hover:from-indigo-700 hover:via-purple-700 hover:to-blue-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95 overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                      <span className="relative flex items-center">
                        <FileText className="w-3 h-3 mr-1.5" />
                        View Details
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-16">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-br from-indigo-100 via-purple-100 to-blue-100 rounded-full flex items-center justify-center mb-6 shadow-lg">
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-200/50 to-purple-200/50 rounded-full animate-ping"></div>
                  <CalendarDays className="w-8 h-8 text-indigo-400 relative z-10" />
                </div>
              </div>
              <p className="text-gray-500 text-lg font-bold mb-2">No completed appointments found</p>
              <p className="text-gray-400 text-base">Completed appointments will appear here with beautiful details</p>
            </div>
          )}
        </div>

        {/* Compact Modal */}
        {selectedAppointmentId && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-lg flex items-center justify-center p-4">
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl max-w-3xl w-full relative max-h-[90vh] overflow-hidden border border-white/50">
              {/* Compact Modal Header */}
              <div className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 p-5 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent backdrop-blur-sm"></div>
                <div className="absolute -top-8 -right-8 w-24 h-24 bg-white/20 rounded-full blur-xl"></div>
                <div className="absolute -bottom-8 -left-8 w-20 h-20 bg-purple-400/30 rounded-full blur-lg"></div>
                <div className="relative z-10 flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center mr-3 backdrop-blur-sm">
                      <FileText className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-1">Consultation Details</h3>
                      <p className="text-blue-100 text-sm">Complete prescription and clinical information</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedAppointmentId(null)}
                    className="p-2 bg-white/20 hover:bg-white/30 rounded-xl text-white transition-all duration-300 backdrop-blur-sm hover:scale-110"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Compact Modal Content */}
              <div className="p-5 overflow-y-auto max-h-[calc(90vh-100px)]">
                {loadingConsultation ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="relative">
                      <div className="animate-spin rounded-full h-10 w-10 border-4 border-indigo-200 border-t-indigo-600"></div>
                      <div className="absolute inset-0 animate-pulse rounded-full h-10 w-10 border-4 border-purple-200 border-t-purple-600 rotate-45"></div>
                    </div>
                    <span className="ml-4 text-gray-700 font-semibold text-base">Loading consultation details...</span>
                  </div>
                ) : !selectedDetails ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gradient-to-br from-red-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                      <FileText className="w-6 h-6 text-red-500" />
                    </div>
                    <p className="text-red-600 font-bold text-lg mb-1">Consultation not available</p>
                    <p className="text-gray-500 text-base">Consultation has not been added yet for this appointment</p>
                  </div>
                ) : (
                  <div className="space-y-5">
                    {/* Compact Basic Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-4 border border-emerald-100 shadow-sm">
                        <div className="flex items-center mb-3">
                          <div className="p-1.5 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-lg mr-2 shadow-sm">
                            <Stethoscope className="w-3 h-3 text-emerald-600" />
                          </div>
                          <span className="font-bold text-emerald-700 text-base">Doctor</span>
                        </div>
                        <p className="text-gray-800 font-semibold text-base">{selectedDetails.doctorName}</p>
                      </div>
                      <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-4 border border-purple-100 shadow-sm">
                        <div className="flex items-center mb-3">
                          <div className="p-1.5 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-lg mr-2 shadow-sm">
                            <User className="w-3 h-3 text-purple-600" />
                          </div>
                          <span className="font-bold text-purple-700 text-base">Patient</span>
                        </div>
                        <p className="text-gray-800 font-semibold text-base">{selectedDetails.patientName}</p>
                      </div>
                    </div>

                    {/* Compact Notes and Recommendations */}
                    <div className="space-y-4">
                      <div className="relative bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-5 border border-blue-100 shadow-sm overflow-hidden">
                        <div className="absolute top-0 right-0 w-12 h-12 bg-gradient-to-br from-blue-200/30 to-transparent rounded-full -translate-y-6 translate-x-6"></div>
                        <div className="relative">
                          <h4 className="font-bold text-blue-700 mb-3 flex items-center text-base">
                            <div className="p-1.5 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg mr-2 shadow-sm">
                              <FileText className="w-3 h-3 text-blue-600" />
                            </div>
                            Clinical Notes
                          </h4>
                          <p className="text-gray-700 leading-relaxed text-sm font-medium">{selectedDetails.notes}</p>
                        </div>
                      </div>

                      <div className="relative bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 rounded-2xl p-5 border border-amber-100 shadow-sm overflow-hidden">
                        <div className="absolute top-0 right-0 w-12 h-12 bg-gradient-to-br from-orange-200/30 to-transparent rounded-full -translate-y-6 translate-x-6"></div>
                        <div className="relative">
                          <h4 className="font-bold text-orange-700 mb-3 flex items-center text-base">
                            <div className="p-1.5 bg-gradient-to-br from-orange-100 to-amber-100 rounded-lg mr-2 shadow-sm">
                              <Stethoscope className="w-3 h-3 text-orange-600" />
                            </div>
                            Recommendations
                          </h4>
                          <p className="text-gray-700 leading-relaxed text-sm font-medium">{selectedDetails.recommendations}</p>
                        </div>
                      </div>
                    </div>

                    {/* Compact Prescription Items */}
                    <div className="relative bg-gradient-to-br from-slate-50 to-gray-50 border-2 border-slate-200 rounded-2xl p-5 shadow-lg overflow-hidden">
                      <div className="absolute -top-8 -right-8 w-20 h-20 bg-gradient-to-br from-slate-200/30 to-transparent rounded-full blur-lg"></div>
                      <div className="relative">
                        <h4 className="text-lg font-bold text-slate-700 mb-5 flex items-center">
                          <div className="p-2 bg-gradient-to-br from-slate-100 to-gray-100 rounded-xl mr-3 shadow-sm">
                            <Pill className="w-4 h-4 text-slate-600" />
                          </div>
                          Prescription Items
                        </h4>
                        {selectedDetails.prescriptionItems.length > 0 ? (
                          <div className="space-y-4">
                            {selectedDetails.prescriptionItems.map((item, idx) => (
                              <div key={idx} className="relative bg-white rounded-2xl p-4 border-2 border-slate-100 shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
                                <div className="absolute top-0 right-0 w-10 h-10 bg-gradient-to-br from-slate-200/30 to-transparent rounded-full -translate-y-5 translate-x-5"></div>
                                <div className="relative flex items-start">
                                  <div className="p-2 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl mr-3 shadow-sm flex-shrink-0">
                                    <Pill className="w-3 h-3 text-blue-600" />
                                  </div>
                                  <div className="flex-1">
                                    <h5 className="font-bold text-gray-800 text-base mb-3">{item.medicineName}</h5>
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
                                      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-3 border border-green-100">
                                        <span className="text-green-600 font-bold text-xs uppercase tracking-wide block mb-1">Dosage</span>
                                        <span className="text-gray-800 font-semibold text-sm">{item.dosage}</span>
                                      </div>
                                      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-3 border border-blue-100">
                                        <span className="text-blue-600 font-bold text-xs uppercase tracking-wide block mb-1">Frequency</span>
                                        <span className="text-gray-800 font-semibold text-sm">{item.frequency}</span>
                                      </div>
                                      <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-3 border border-purple-100">
                                        <span className="text-purple-600 font-bold text-xs uppercase tracking-wide block mb-1">Duration</span>
                                        <span className="text-gray-800 font-semibold text-sm">{item.duration}</span>
                                      </div>
                                    </div>
                                    {item.notes && (
                                      <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-3 border border-amber-100">
                                        <span className="text-amber-600 font-bold text-xs uppercase tracking-wide block mb-1">Special Instructions</span>
                                        <span className="text-gray-700 text-xs font-medium leading-relaxed">{item.notes}</span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-8">
                            <div className="w-12 h-12 bg-gradient-to-br from-gray-100 to-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                              <Pill className="w-5 h-5 text-gray-400" />
                            </div>
                            <p className="text-gray-500 font-semibold text-base">No prescription items found</p>
                          </div>
                        )}
                      </div>
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