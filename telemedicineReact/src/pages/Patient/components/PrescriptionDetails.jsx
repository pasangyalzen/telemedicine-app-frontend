import React, { useEffect, useState } from "react";
import axios from "axios";

const PrescriptionDetails = ({ prescriptionId }) => {
  const [prescription, setPrescription] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!prescriptionId) return;

    const fetchPrescription = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5186/api/Doctor/GetPrescription?prescriptionId=${prescriptionId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setPrescription(response.data);
        setError("");
      } catch (err) {
        setError("Unable to fetch prescription details.");
        setPrescription(null);
      }
    };

    fetchPrescription();
  }, [prescriptionId]);

  return (
    <div className="p-4 bg-white rounded-2xl shadow-md max-w-xl mx-auto mt-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Prescription Details</h2>

      {error && <p className="text-red-500">{error}</p>}

      {prescription ? (
        <div className="space-y-3 text-gray-700">
          <p><span className="font-semibold">Prescription ID:</span> {prescription.prescriptionId}</p>
          <p><span className="font-semibold">Consultation ID:</span> {prescription.consultationId}</p>
          <p><span className="font-semibold">Prescribed At:</span> {new Date(prescription.prescribedAt).toLocaleString()}</p>

          <h3 className="text-lg font-semibold mt-4 mb-2">Prescribed Medicines:</h3>
          {prescription.prescriptionItems.length > 0 ? (
            prescription.prescriptionItems.map((item, index) => (
              <div key={item.prescriptionItemId} className="p-3 border rounded-xl mb-3 bg-gray-50">
                <p><span className="font-semibold">Medicine Name:</span> {item.medicineName}</p>
                <p><span className="font-semibold">Dosage:</span> {item.dosage}</p>
                <p><span className="font-semibold">Frequency:</span> {item.frequency} times/day</p>
                <p><span className="font-semibold">Duration:</span> {item.duration}</p>
                <p><span className="font-semibold">Notes:</span> {item.notes}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No medicines prescribed.</p>
          )}
        </div>
      ) : !error ? (
        <p className="text-gray-500">Loading prescription...</p>
      ) : null}
    </div>
  );
};

export default PrescriptionDetails;