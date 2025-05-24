import { useEffect, useState } from "react";
import { apiClient } from "../usePharmacistData";
import { Eye } from "lucide-react";

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
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-2xl p-6 text-white">
        <h3 className="text-xl font-bold mb-2">Consultation History</h3>
        <p>Review past consultations and follow-ups</p>
      </div>

      {error && <p className="text-red-500 text-center">{error}</p>}

      <div className="grid grid-cols-1 gap-4">
        {consultations.map((c) => (
          <div
            key={c.consultationId}
            className="bg-white rounded-xl p-6 border border-gray-200 shadow hover:shadow-lg transition"
          >
            <div className="mb-2">
              <p className="font-semibold text-gray-800">Consultation ID: {c.consultationId}</p>
              <p className="text-sm text-gray-600">Appointment ID: {c.appointmentId}</p>
            </div>
            <button
              onClick={() => setSelected(c)}
              className="px-4 py-2 mt-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-sm font-medium rounded hover:from-emerald-700 hover:to-teal-700"
            >
              <Eye className="inline-block w-4 h-4 mr-1" /> View Details
            </button>
          </div>
        ))}
      </div>

      {selected && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl relative">
            <button
              onClick={() => setSelected(null)}
              className="absolute top-2 right-3 text-gray-600 hover:text-gray-900 text-xl"
            >
              &times;
            </button>
            <h4 className="text-xl font-bold mb-4 text-teal-700">Consultation Details</h4>
            <p className="text-sm mb-2 text-gray-700">Notes: {selected.notes}</p>
            <p className="text-sm text-gray-700">Recommendations: {selected.recommendations}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Consultations;