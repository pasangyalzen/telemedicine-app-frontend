import React, { useState } from "react";
import { apiClient } from "../services/doctorAppointmentApi"; // Adjust path as needed
import toast from "react-hot-toast";

const Prescription = ({ consultationId, setConsultationId, setShowPrescriptionForm, onClose }) => {
//   const [consultationId, setConsultationId] = useState("");
  const [items, setItems] = useState([
    { medicineName: "", dosage: "", frequency: "", duration: "", notes: "" },
  ]);
  const [message, setMessage] = useState("");

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...items];
    updatedItems[index][field] = value;
    setItems(updatedItems);
  };

  const addItem = () => {
    setItems([
      ...items,
      { medicineName: "", dosage: "", frequency: "", duration: "", notes: "" },
    ]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const payload = {
      consultationId: parseInt(consultationId),
      prescriptionItems: items,
    };

    try {
      const response = await apiClient.post(
        "/CreatePrescription",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage("Prescription created successfully!");
      toast.success("Prescription created successfully");
      console.log(response.data);
      setShowPrescriptionForm(false);
    } catch (error) {
      console.error("Error creating prescription:", error);
      setMessage("Error creating prescription");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="relative max-w-3xl mx-auto mt-10 bg-white p-6 rounded-2xl shadow-xl">
        <h2 className="text-2xl font-bold text-center text-indigo-600 mb-6">Create Prescription</h2>
        {message && <p className="text-center mb-4 text-green-500">{message}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="number"
            placeholder="Consultation ID"
            value={consultationId}
            onChange={(e) => setConsultationId(e.target.value)}
            className="w-full p-3 border text-white border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-400"
            required
          />

          {/* Scrollable container for prescription items */}
          <div className="max-h-96 overflow-y-auto space-y-4">
            {items.map((item, index) => (
              <div key={index} className="grid text-white grid-cols-1 md:grid-cols-2 gap-4 border p-4 rounded-xl">
                <input
                  type="text"
                  placeholder="Medicine Name"
                  value={item.medicineName}
                  onChange={(e) => handleItemChange(index, "medicineName", e.target.value)}
                  className="p-2 border border-gray-300 rounded-xl"
                  required
                />
                <input
                  type="text"
                  placeholder="Dosage"
                  value={item.dosage}
                  onChange={(e) => handleItemChange(index, "dosage", e.target.value)}
                  className="p-2 border text-white border-gray-300 rounded-xl"
                  required
                />
                <input
                  type="text"
                  placeholder="Frequency"
                  value={item.frequency}
                  onChange={(e) => handleItemChange(index, "frequency", e.target.value)}
                  className="p-2 border text-white border-gray-300 rounded-xl"
                  required
                />
                <input
                  type="text"
                  placeholder="Duration"
                  value={item.duration}
                  onChange={(e) => handleItemChange(index, "duration", e.target.value)}
                  className="p-2 border text-white border-gray-300 rounded-xl"
                  required
                />
                <textarea
                  placeholder="Notes"
                  value={item.notes}
                  onChange={(e) => handleItemChange(index, "notes", e.target.value)}
                  className="col-span-1 text-white md:col-span-2 p-2 border border-gray-300 rounded-xl resize-none"
                />
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={addItem}
            className="w-full py-2 bg-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-300"
          >
            + Add Another Medicine
          </button>

          <button
            type="submit"
            className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700"
          >
            Submit Prescription
          </button>
        </form>
        <button
          onClick={() => {
            onClose();
            setShowPrescriptionForm(false);
          }}
          className="absolute top-2 right-2 p-2 text-white bg-gray-700 rounded-full"
        >
          X
        </button>
      </div>
    </div>
  );
};

export default Prescription;