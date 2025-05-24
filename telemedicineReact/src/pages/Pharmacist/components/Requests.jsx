import { useEffect, useState } from "react";
import { apiClient } from "../usePharmacistData"; // Reuse your apiClient with auth headers
import { X, Clock, User, Calendar, Pill, AlertCircle, CheckCircle2 } from "lucide-react";

const Requests = () => {
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState(null);
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [loading, setLoading] = useState(false);
  const [availability, setAvailability] = useState({}); // Track medicine availability

  const baseUrl = "http://localhost:5186"; // Backend base URL

  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };
        const response = await apiClient.get("/GetRequestedPrescriptions", { headers });
        setRequests(response.data);
      } catch (err) {
        setError("Failed to fetch medication requests.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, []);

  // Group prescriptions by prescriptionId for better display
  const groupedByPrescription = requests.reduce((acc, item) => {
    const key = item.prescriptionId;
    if (!acc[key]) {
      acc[key] = {
        prescriptionId: item.prescriptionId,
        patientId: item.patientId,
        patientName: item.patientName,
        patientPhoto: item.patientPhoto, // profile image url/path
        prescribedAt: item.prescribedAt,
        items: [],
      };
    }
    acc[key].items.push(item);
    return acc;
  }, {});

  const prescriptionsArray = Object.values(groupedByPrescription);

  const toggleAvailability = (medicineName) => {
    setAvailability((prev) => ({
      ...prev,
      [medicineName]: !prev[medicineName],
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="relative overflow-hidden bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 rounded-3xl p-8 shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/20 via-teal-600/20 to-cyan-600/20"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl">
                <Pill className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">Medication Requests</h1>
                <p className="text-emerald-100 text-lg">Review and manage patient prescription requests</p>
              </div>
            </div>
            <div className="flex items-center gap-6 text-white/90">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                <span className="text-sm font-medium">Real-time updates</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" />
                <span className="text-sm font-medium">Instant availability tracking</span>
              </div>
            </div>
          </div>
          {/* Decorative elements */}
          <div className="absolute top-4 right-4 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-4 right-20 w-24 h-24 bg-white/5 rounded-full blur-2xl"></div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-16">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-teal-200 border-t-teal-500 rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Pill className="w-6 h-6 text-teal-500" />
              </div>
            </div>
            <p className="ml-4 text-teal-600 font-medium text-lg">Loading requests...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-xl">
                <AlertCircle className="w-6 h-6 text-red-500" />
              </div>
              <div>
                <h3 className="font-semibold text-red-800">Error Loading Requests</h3>
                <p className="text-red-600">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Requests Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {prescriptionsArray.length > 0 ? (
            prescriptionsArray.map((prescription) => {
              const imgUrl = prescription.patientPhoto
                ? `${baseUrl}${prescription.patientPhoto}`
                : null;

              return (
                <div
                  key={prescription.prescriptionId}
                  className="group bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-white/50 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:bg-white/90"
                >
                  {/* Card Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                      {/* Patient Image */}
                      {imgUrl ? (
                        <div className="relative">
                          <img
                            src={imgUrl}
                            alt={`${prescription.patientName} profile`}
                            className="w-16 h-16 rounded-2xl object-cover border-4 border-gradient-to-br from-teal-200 to-cyan-200 shadow-lg"
                            onError={(e) => {
                              e.currentTarget.src = "/default-profile.png"; // fallback image
                            }}
                          />
                          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-4 border-white shadow-sm"></div>
                        </div>
                      ) : (
                        <div className="relative">
                          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-500 via-emerald-500 to-cyan-500 flex items-center justify-center text-white shadow-lg border-4 border-white">
                            <span className="text-xl font-bold">{prescription.patientName.charAt(0)}</span>
                          </div>
                          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-4 border-white shadow-sm"></div>
                        </div>
                      )}

                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <User className="w-4 h-4 text-teal-600" />
                          <p className="font-bold text-slate-800 text-lg">{prescription.patientName}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-slate-500" />
                          <p className="text-sm text-slate-600 font-medium">
                            {new Date(prescription.prescribedAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div className="flex flex-col items-end gap-2">
                      <span className="px-4 py-2 bg-gradient-to-r from-amber-100 to-orange-100 text-amber-700 rounded-full text-sm font-bold shadow-sm border border-amber-200">
                        <Clock className="w-4 h-4 inline mr-1" />
                        Pending
                      </span>
                      <span className="text-xs text-slate-500 font-medium">
                        {prescription.items.length} item{prescription.items.length !== 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={() => setSelectedPrescription(prescription)}
                    className="w-full py-4 bg-gradient-to-r from-teal-500 via-emerald-500 to-cyan-500 hover:from-teal-600 hover:via-emerald-600 hover:to-cyan-600 text-white rounded-2xl transition-all duration-300 font-bold text-lg shadow-lg hover:shadow-xl group-hover:scale-105 transform"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <Pill className="w-5 h-5" />
                      View Prescription Details
                    </div>
                  </button>
                </div>
              );
            })
          ) : (
            !loading && (
              <div className="col-span-full flex items-center justify-center py-20">
                <div className="text-center">
                  <div className="w-24 h-24 bg-gradient-to-br from-slate-100 to-slate-200 rounded-3xl flex items-center justify-center mb-6 mx-auto">
                    <Pill className="w-12 h-12 text-slate-400" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-600 mb-2">No Requests Found</h3>
                  <p className="text-slate-500">No medication requests are currently available.</p>
                </div>
              </div>
            )
          )}
        </div>

        {/* Enhanced Modal for prescription details */}
        {selectedPrescription && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center px-4">
            <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden relative">
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-teal-500 via-emerald-500 to-cyan-500 p-8 relative overflow-hidden">
                <button
                  onClick={() => setSelectedPrescription(null)}
                  className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl text-white transition-colors duration-200"
                  aria-label="Close prescription modal"
                >
                  <X className="w-6 h-6" />
                </button>
                
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl">
                    <Pill className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-1">Prescription Details</h3>
                    <p className="text-emerald-100">Review medication requirements</p>
                  </div>
                </div>

                {/* Patient Info in Header */}
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                  <div className="flex items-center gap-3 text-white">
                    <User className="w-5 h-5" />
                    <span className="font-bold text-lg">{selectedPrescription.patientName}</span>
                  </div>
                  <div className="flex items-center gap-3 text-emerald-100 mt-2">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm font-medium">
                      Requested: {new Date(selectedPrescription.prescribedAt).toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Decorative elements */}
                <div className="absolute top-4 right-20 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-4 left-4 w-24 h-24 bg-white/5 rounded-full blur-2xl"></div>
              </div>

              {/* Modal Content */}
              <div className="p-8 max-h-96 overflow-y-auto">
                <h4 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                  <Pill className="w-5 h-5 text-teal-600" />
                  Prescribed Medications ({selectedPrescription.items.length})
                </h4>

                <div className="space-y-6">
                  {selectedPrescription.items.map((item, idx) => (
                    <div key={idx} className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-2xl p-6 border border-slate-200 shadow-sm">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h5 className="text-xl font-bold text-slate-800 mb-2">{item.medicineName}</h5>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                              <span className="text-slate-600"><strong>Dosage:</strong> {item.dosage}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                              <span className="text-slate-600"><strong>Frequency:</strong> {item.frequency}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
                              <span className="text-slate-600"><strong>Duration:</strong> {item.duration}</span>
                            </div>
                          </div>
                          {item.notes && (
                            <div className="mt-3 p-3 bg-blue-50 rounded-xl border border-blue-200">
                              <p className="text-sm text-blue-800"><strong>Note:</strong> {item.notes}</p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Availability Toggle */}
                      <button
                        onClick={() => toggleAvailability(item.medicineName)}
                        className={`w-full py-3 px-6 rounded-xl font-bold text-sm transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 ${
                          availability[item.medicineName]
                            ? "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
                            : "bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white"
                        }`}
                      >
                        <div className="flex items-center justify-center gap-2">
                          {availability[item.medicineName] ? (
                            <>
                              <CheckCircle2 className="w-5 h-5" />
                              Available in Stock
                            </>
                          ) : (
                            <>
                              <AlertCircle className="w-5 h-5" />
                              Not Available
                            </>
                          )}
                        </div>
                      </button>
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

export default Requests;