import { useEffect, useState } from "react";
import { apiClient } from "../usePharmacistData";
import { Eye } from "lucide-react";

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
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-black to-gray-800 rounded-2xl p-6 text-white shadow-lg">
        <h3 className="text-xl font-bold mb-2">Prescription Management</h3>
        <p className="text-sm text-gray-300">Manage and review patient prescriptions efficiently</p>
      </div>

      {error && <p className="text-red-500 text-center">{error}</p>}

      <div className="grid grid-cols-1 gap-4">
        {prescriptions.length > 0 ? (
          prescriptions.map((p) => (
            <div
              key={p.prescriptionId}
              className="bg-gray-900 rounded-xl p-6 border border-gray-700 shadow hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <i className="fas fa-pills text-teal-400 text-2xl mr-4" />
                  <div>
                    <p className="font-semibold text-white">Prescription #{p.prescriptionId}</p>
                    <p className="text-sm text-gray-300">Consultation ID: {p.consultationId}</p>
                    <p className="text-sm text-gray-400">
                      Prescribed At: {new Date(p.prescribedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedPrescription(p)}
                  className="px-3 py-1 bg-teal-700 text-white rounded-full text-sm font-medium hover:bg-teal-600"
                >
                  <Eye className="inline-block w-4 h-4 mr-1" /> View
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-400 text-center">No prescriptions available.</p>
        )}
      </div>

      {selectedPrescription && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-xl relative">
            <button
              onClick={() => setSelectedPrescription(null)}
              className="absolute top-2 right-3 text-gray-600 hover:text-gray-900 text-xl"
            >
              &times;
            </button>
            <h4 className="text-xl font-bold mb-4 text-teal-700">Prescription Details</h4>
            <ul className="text-sm space-y-3 max-h-[300px] overflow-y-auto pr-2">
              {selectedPrescription.prescriptionItems?.map((item, index) => (
                <li key={index} className="border-b pb-2">
                  <p><strong>Medicine:</strong> {item.medicineName}</p>
                  <p><strong>Dosage:</strong> {item.dosage}</p>
                  <p><strong>Frequency:</strong> {item.frequency}</p>
                  <p><strong>Duration:</strong> {item.duration}</p>
                  <p><strong>Notes:</strong> {item.notes}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default Prescriptions;