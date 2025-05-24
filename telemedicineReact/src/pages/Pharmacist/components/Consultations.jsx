import { useEffect, useState } from "react";
import { apiClient } from "../usePharmacistData";
import { Eye, X, FileText, Calendar, Stethoscope, ClipboardList, MessageSquare, Lightbulb, Hash, Clock } from "lucide-react";

const Consultations = () => {
  const [consultations, setConsultations] = useState([]);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const fetchConsultations = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await apiClient.get("/GetAllConsultations", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setConsultations(response.data);
      } catch (err) {
        setError("Failed to fetch consultations.");
      }
    };
    fetchConsultations();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-teal-50 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Enhanced Header Section */}
        <div className="relative overflow-hidden bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 rounded-3xl p-8 shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/20 via-teal-600/20 to-cyan-600/20"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-4 bg-white/20 backdrop-blur-sm rounded-2xl">
                <Stethoscope className="w-10 h-10 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-white mb-2">Consultation History</h1>
                <p className="text-emerald-100 text-lg">Review past consultations and patient follow-ups</p>
              </div>
            </div>
            <div className="flex items-center gap-8 text-white/90">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                <span className="text-sm font-medium">Detailed Records</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                <span className="text-sm font-medium">Complete History</span>
              </div>
              <div className="flex items-center gap-2">
                <ClipboardList className="w-5 h-5" />
                <span className="text-sm font-medium">Professional Notes</span>
              </div>
            </div>
          </div>
          {/* Decorative elements */}
          <div className="absolute top-6 right-6 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-6 right-24 w-24 h-24 bg-white/5 rounded-full blur-2xl"></div>
          <div className="absolute top-1/2 right-4 w-16 h-16 bg-white/5 rounded-full blur-xl"></div>
        </div>

        {/* Enhanced Error Display */}
        {error && (
          <div className="bg-gradient-to-r from-red-50 to-rose-50 border-2 border-red-200 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-red-100 rounded-xl">
                <X className="w-8 h-8 text-red-500" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-red-800 mb-1">Unable to Load Consultations</h3>
                <p className="text-red-600 font-medium">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Consultations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {consultations.length > 0 ? (
            consultations.map((c) => (
              <div
                key={c.consultationId}
                className="group bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-white/50 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 hover:bg-white/90 relative overflow-hidden"
              >
                {/* Card Background Pattern */}
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 via-transparent to-teal-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
               {/* Card Header */}
              <div className="relative z-10 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-2xl shadow-lg">
                    <Stethoscope className="w-8 h-8 text-emerald-600" />
                  </div>
                  <div className="px-4 py-2 bg-gradient-to-r from-emerald-100 to-teal-100 rounded-full">
                    <span className="text-xs font-bold text-emerald-700 uppercase tracking-wide">Consultation</span>
                  </div>
                </div>

                <div className="space-y-3">
                  {/* Consultation ID */}
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-50 rounded-lg">
                      <Hash className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">Consultation ID</p>
                      <p className="text-lg font-bold text-slate-800">{c.consultationId}</p>
                    </div>
                  </div>

                  {/* Appointment ID */}
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-teal-50 rounded-lg">
                      <Calendar className="w-4 h-4 text-teal-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">Appointment ID</p>
                      <p className="text-lg font-bold text-slate-800">{c.appointmentId}</p>
                    </div>
                  </div>

                  {/* Doctor Name */}
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-50 rounded-lg">
                      <Stethoscope className="w-4 h-4 text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">Doctor</p>
                      <p className="text-lg font-bold text-slate-800">{c.doctorName}</p>
                    </div>
                  </div>

                  {/* Patient Name */}
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-pink-50 rounded-lg">
                      <ClipboardList className="w-4 h-4 text-pink-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">Patient</p>
                      <p className="text-lg font-bold text-slate-800">{c.patientName}</p>
                    </div>
                  </div>
                </div>
              </div>

                {/* Enhanced Action Button */}
                <button
                  onClick={() => setSelected(c)}
                  className="relative z-10 w-full py-4 px-6 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-600 hover:via-teal-600 hover:to-cyan-600 text-white rounded-2xl transition-all duration-300 font-bold text-lg shadow-lg hover:shadow-xl group-hover:scale-105 transform"
                >
                  <div className="flex items-center justify-center gap-3">
                    <div className="p-2 bg-white/20 rounded-xl">
                      <Eye className="w-6 h-6" />
                    </div>
                    <span>View Details</span>
                  </div>
                </button>

                {/* Card Glow Effect */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-emerald-400/0 via-teal-400/0 to-cyan-400/0 group-hover:from-emerald-400/10 group-hover:via-teal-400/10 group-hover:to-cyan-400/10 transition-all duration-500"></div>
              </div>
            ))
          ) : (
            !error && (
              <div className="col-span-full flex items-center justify-center py-20">
                <div className="text-center">
                  <div className="w-32 h-32 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center mb-8 mx-auto shadow-lg">
                    <Stethoscope className="w-16 h-16 text-slate-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-600 mb-3">No Consultations Found</h3>
                  <p className="text-slate-500 text-lg">No consultation records are currently available.</p>
                </div>
              </div>
            )
          )}
        </div>

        {/* Enhanced Modal */}
        {selected && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden relative">
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 p-8 relative overflow-hidden">
                <button
                  onClick={() => setSelected(null)}
                  className="absolute top-4 right-4 p-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl text-white transition-all duration-200 hover:scale-110"
                  aria-label="Close consultation details"
                >
                  <X className="w-6 h-6" />
                </button>
                
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-4 bg-white/20 backdrop-blur-sm rounded-2xl">
                    <FileText className="w-10 h-10 text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-white mb-1">Consultation Details</h2>
                    <p className="text-emerald-100 text-lg">Complete consultation record</p>
                  </div>
                </div>

                {/* Consultation IDs in Header */}
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 text-white">
                      <Hash className="w-5 h-5" />
                      <div>
                        <p className="text-xs opacity-80 uppercase tracking-wide">Consultation</p>
                        <p className="font-bold text-lg">{selected.consultationId}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-white">
                      <Calendar className="w-5 h-5" />
                      <div>
                        <p className="text-xs opacity-80 uppercase tracking-wide">Appointment</p>
                        <p className="font-bold text-lg">{selected.appointmentId}</p>
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
                <div className="space-y-8">
                  {/* Notes Section */}
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border-2 border-blue-100 shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-3 bg-blue-100 rounded-xl">
                        <MessageSquare className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-blue-800">Consultation Notes</h3>
                        <p className="text-blue-600 text-sm">Detailed observations and findings</p>
                      </div>
                    </div>
                    <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-blue-200">
                      <p className="text-slate-700 leading-relaxed font-medium">{selected.notes}</p>
                    </div>
                  </div>

                  {/* Recommendations Section */}
                  <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-6 border-2 border-amber-100 shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-3 bg-amber-100 rounded-xl">
                        <Lightbulb className="w-6 h-6 text-amber-600" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-amber-800">Recommendations</h3>
                        <p className="text-amber-600 text-sm">Professional advice and next steps</p>
                      </div>
                    </div>
                    <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-amber-200">
                      <p className="text-slate-700 leading-relaxed font-medium">{selected.recommendations}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Consultations;