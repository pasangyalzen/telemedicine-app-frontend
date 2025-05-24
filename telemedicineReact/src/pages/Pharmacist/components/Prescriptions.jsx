import { useEffect, useState } from "react";
import { apiClient } from "../usePharmacistData";
import { Eye, X, Pill, Calendar, ClipboardList, Hash, FileText, Clock, Stethoscope, AlertCircle, Clipboard } from "lucide-react";

const Prescriptions = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };

        const response = await apiClient.get("/GetAllPrescriptions", { headers });
        setPrescriptions(response.data);
      } catch (err) {
        console.error("Failed to fetch prescriptions:", err);
        setError("Failed to load prescriptions.");
      }
    };

    fetchPrescriptions();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Enhanced Header Section */}
        <div className="relative overflow-hidden bg-gradient-to-r from-slate-800 via-slate-700 to-gray-800 rounded-3xl p-8 shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/20 via-gray-800/20 to-slate-900/20"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-4 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
                <Clipboard className="w-10 h-10 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-white mb-2">Prescription Management</h1>
                <p className="text-slate-300 text-lg">Manage and review patient prescriptions efficiently</p>
              </div>
            </div>
            <div className="flex items-center gap-8 text-white/90">
              <div className="flex items-center gap-2">
                <Pill className="w-5 h-5" />
                <span className="text-sm font-medium">Medication Tracking</span>
              </div>
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                <span className="text-sm font-medium">Digital Records</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                <span className="text-sm font-medium">Real-time Updates</span>
              </div>
            </div>
          </div>
          {/* Decorative elements */}
          <div className="absolute top-6 right-6 w-32 h-32 bg-white/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-6 right-24 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
        </div>

        {/* Enhanced Error Display */}
        {error && (
          <div className="bg-gradient-to-r from-red-50 to-rose-50 border-2 border-red-200 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-red-100 rounded-xl">
                <AlertCircle className="w-8 h-8 text-red-500" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-red-800 mb-1">Unable to Load Prescriptions</h3>
                <p className="text-red-600 font-medium">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Prescriptions List */}
        <div className="space-y-6">
          {prescriptions.length > 0 ? (
            prescriptions.map((p) => (
              <div
                key={p.prescriptionId}
                className="group bg-gradient-to-r from-slate-800/95 via-slate-700/95 to-gray-800/95 backdrop-blur-sm rounded-3xl p-8 border border-slate-600/50 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 relative overflow-hidden"
              >
                {/* Card Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-teal-500/0 via-cyan-500/0 to-purple-500/0 group-hover:from-teal-500/10 group-hover:via-cyan-500/10 group-hover:to-purple-500/10 transition-all duration-500 rounded-3xl"></div>
                
                <div className="relative z-10 flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    {/* Enhanced Pill Icon */}
                    <div className="p-4 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <Pill className="w-8 h-8 text-white" />
                    </div>
                    
                    <div className="space-y-3">
                    {/* Prescription ID */}
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-slate-600/50 rounded-lg backdrop-blur-sm">
                        <Hash className="w-4 h-4 text-teal-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-400 uppercase tracking-wide">Prescription</p>
                        <p className="text-xl font-bold text-white">#{p.prescriptionId}</p>
                      </div>
                    </div>

                    {/* Consultation ID */}
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-slate-600/50 rounded-lg backdrop-blur-sm">
                        <Stethoscope className="w-4 h-4 text-purple-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-400 uppercase tracking-wide">Consultation</p>
                        <p className="text-lg font-bold text-slate-200">{p.consultationId}</p>
                      </div>
                    </div>

                    {/* Doctor Name */}
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-slate-600/50 rounded-lg backdrop-blur-sm">
                        <Stethoscope className="w-4 h-4 text-emerald-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-400 uppercase tracking-wide">Doctor</p>
                        <p className="text-lg font-bold text-slate-200">{p.doctorName}</p>
                      </div>
                    </div>

                    {/* Patient Name */}
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-slate-600/50 rounded-lg backdrop-blur-sm">
                        <ClipboardList className="w-4 h-4 text-amber-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-400 uppercase tracking-wide">Patient</p>
                        <p className="text-lg font-bold text-slate-200">{p.patientName}</p>
                      </div>
                    </div>

                    {/* Date */}
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-slate-600/50 rounded-lg backdrop-blur-sm">
                        <Calendar className="w-4 h-4 text-cyan-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-400 uppercase tracking-wide">Prescribed Date</p>
                        <p className="text-lg font-bold text-slate-200">
                          {new Date(p.prescribedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                  </div>
                  
                  {/* Enhanced View Button */}
                  <button
                    onClick={() => setSelectedPrescription(p)}
                    className="px-6 py-3 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white rounded-2xl font-bold text-sm transition-all duration-300 shadow-lg hover:shadow-xl group-hover:scale-105 transform"
                  >
                    <div className="flex items-center gap-2">
                      <div className="p-1 bg-white/20 rounded-lg">
                        <Eye className="w-4 h-4" />
                      </div>
                      <span>View Details</span>
                    </div>
                  </button>
                </div>

                {/* Decorative line */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-500 via-cyan-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
            ))
          ) : (
            !error && (
              <div className="flex items-center justify-center py-20">
                <div className="text-center">
                  <div className="w-32 h-32 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center mb-8 mx-auto shadow-lg">
                    <Clipboard className="w-16 h-16 text-slate-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-600 mb-3">No Prescriptions Available</h3>
                  <p className="text-slate-500 text-lg">No prescription records found at this time.</p>
                </div>
              </div>
            )
          )}
        </div>

        {/* Enhanced Modal */}
        {selectedPrescription && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden relative">
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-teal-500 via-cyan-500 to-purple-500 p-8 relative overflow-hidden">
                <button
                  onClick={() => setSelectedPrescription(null)}
                  className="absolute top-4 right-4 p-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl text-white transition-all duration-200 hover:scale-110"
                  aria-label="Close prescription details"
                >
                  <X className="w-6 h-6" />
                </button>
                
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-4 bg-white/20 backdrop-blur-sm rounded-2xl">
                    <FileText className="w-10 h-10 text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-white mb-1">Prescription Details</h2>
                    <p className="text-cyan-100 text-lg">Complete medication information</p>
                  </div>
                </div>

                {/* Prescription Info in Header */}
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 text-white">
                      <Hash className="w-5 h-5" />
                      <div>
                        <p className="text-xs opacity-80 uppercase tracking-wide">Prescription ID</p>
                        <p className="font-bold text-lg">#{selectedPrescription.prescriptionId}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-white">
                      <Stethoscope className="w-5 h-5" />
                      <div>
                        <p className="text-xs opacity-80 uppercase tracking-wide">Consultation</p>
                        <p className="font-bold text-lg">{selectedPrescription.consultationId}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Decorative elements */}
                <div className="absolute top-4 right-20 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
                <div className="absolute bottom-4 left-4 w-32 h-32 bg-white/5 rounded-full blur-3xl"></div>
              </div>

              {/* Modal Content */}
              <div className="p-8 max-h-96 overflow-y-auto">
                <h3 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
                  <div className="p-2 bg-teal-100 rounded-xl">
                    <Pill className="w-6 h-6 text-teal-600" />
                  </div>
                  Prescribed Medications
                </h3>

                <div className="space-y-6">
                  {selectedPrescription.prescriptionItems?.map((item, index) => (
                    <div key={index} className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-2xl p-6 border-2 border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-300">
                      <div className="flex items-start gap-4 mb-4">
                        <div className="p-2 bg-teal-100 rounded-xl">
                          <Pill className="w-5 h-5 text-teal-600" />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-xl font-bold text-slate-800 mb-3">{item.medicineName}</h4>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div className="space-y-3">
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                <span className="text-sm font-medium text-slate-600">
                                  <strong>Dosage:</strong> {item.dosage}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                <span className="text-sm font-medium text-slate-600">
                                  <strong>Frequency:</strong> {item.frequency}
                                </span>
                              </div>
                            </div>
                            <div className="space-y-3">
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                                <span className="text-sm font-medium text-slate-600">
                                  <strong>Duration:</strong> {item.duration}
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          {item.notes && (
                            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                              <div className="flex items-start gap-2">
                                <FileText className="w-4 h-4 text-amber-600 mt-0.5" />
                                <div>
                                  <p className="text-sm font-bold text-amber-800 mb-1">Special Notes:</p>
                                  <p className="text-sm text-amber-700">{item.notes}</p>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Prescriptions;