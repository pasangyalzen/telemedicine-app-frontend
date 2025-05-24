import { useEffect, useState } from "react";
import { apiClient } from "../usePharmacistData"; // Reuse your apiClient with auth headers
import { X } from "lucide-react";

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
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-2xl p-6 border border-teal-200/50 shadow-lg">
        <h3 className="text-xl font-bold mb-2 text-teal-800">Medication Requests</h3>
        <p className="text-teal-600">Review all patient prescription requests</p>
      </div>

      {loading && <p className="text-center text-teal-600">Loading requests...</p>}
      {error && <p className="text-red-500 text-center">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {prescriptionsArray.length > 0 ? (
          prescriptionsArray.map((prescription) => {
            const imgUrl = prescription.patientPhoto
              ? `${baseUrl}${prescription.patientPhoto}`
              : null;

            return (
              <div
                key={prescription.prescriptionId}
                className="bg-white rounded-2xl p-6 border border-teal-200 shadow hover:shadow-lg transition duration-300"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    {/* Patient Image */}
                    {imgUrl ? (
                      <img
                        src={imgUrl}
                        alt={`${prescription.patientName} profile`}
                        className="w-12 h-12 rounded-xl object-cover mr-4 border border-teal-300"
                        onError={(e) => {
                          e.currentTarget.src = "/default-profile.png"; // fallback image
                        }}
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center text-white mr-4 text-lg font-bold">
                        {prescription.patientName.charAt(0)}
                      </div>
                    )}

                    <div>
                      <p className="font-bold text-teal-800">Patient: {prescription.patientName}</p>
                      <p className="text-sm text-teal-600">
                        Requested At: {new Date(prescription.prescribedAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium">
                    Pending
                  </span>
                </div>
                <button
                  onClick={() => setSelectedPrescription(prescription)}
                  className="w-full py-2 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-lg hover:from-teal-600 hover:to-cyan-600 transition duration-300 font-medium"
                >
                  View Prescription
                </button>
              </div>
            );
          })
        ) : (
          !loading && (
            <p className="text-gray-400 col-span-2 text-center">No medication requests found.</p>
          )
        )}
      </div>

      {/* Modal for prescription details */}
      {selectedPrescription && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto relative">
            <button
              onClick={() => setSelectedPrescription(null)}
              className="absolute top-3 right-4 text-gray-500 hover:text-gray-700"
              aria-label="Close prescription modal"
            >
              <X className="w-6 h-6" />
            </button>
            <h3 className="text-xl font-bold text-teal-700 mb-4">Prescription Details</h3>
            <p className="text-sm mb-2 text-gray-700 font-semibold">
              Patient: {selectedPrescription.patientName}
            </p>
            <p className="text-sm mb-4 text-gray-700 font-semibold">
              Requested At: {new Date(selectedPrescription.prescribedAt).toLocaleString()}
            </p>

            <ul className="list-disc list-inside text-sm text-gray-700 space-y-4">
              {selectedPrescription.items.map((item, idx) => (
                <li key={idx} className="flex flex-col">
                  <div>
                    <strong>{item.medicineName}</strong> — {item.dosage}, {item.frequency}, {item.duration}
                    {item.notes && (
                      <span className="block text-xs text-gray-500 mt-1">Note: {item.notes}</span>
                    )}
                  </div>
                  <button
                    onClick={() => toggleAvailability(item.medicineName)}
                    className={`mt-2 px-3 py-1 rounded-full text-sm font-semibold transition ${
                      availability[item.medicineName]
                        ? "bg-green-600 text-white hover:bg-green-700"
                        : "bg-red-600 text-white hover:bg-red-700"
                    }`}
                  >
                    {availability[item.medicineName] ? "Available" : "Not Available"}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default Requests;