import React, { useState } from "react";
import { apiClient } from "../services/doctorAppointmentApi";
import toast from "react-hot-toast";

const Consultation = ({ appointmentId, setShowConsultationForm, onClose, refetchAppointments }) => {
  const [formData, setFormData] = useState({
    appointmentId: appointmentId,
    notes: "",
    recommendations: "",
  });
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await apiClient.post("/CreateConsultation", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSuccessMessage("Consultation created successfully!");
      toast.success("Consulation created successfully");
      await refetchAppointments();
      console.log(response.data);
      setShowConsultationForm(false);
    } catch (error) {
      console.error("Error creating consultation:", error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="relative max-w-xl w-full bg-white p-6 rounded-2xl shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-xl font-bold"
        >
          &times;
        </button>

        {/* Form Content */}
        <h2 className="text-2xl font-bold mb-6 text-center text-indigo-600">Create Consultation</h2>
        {successMessage && <p className="text-green-500 text-center mb-4">{successMessage}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="number"
            name="appointmentId"
            value={formData.appointmentId}
            onChange={handleChange}
            placeholder="Appointment ID"
            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-400"
            required
            readOnly
          />
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Notes"
            className="w-full p-3 border border-gray-300 rounded-xl h-24 resize-none focus:ring-2 focus:ring-indigo-400"
            required
          />
          <textarea
            name="recommendations"
            value={formData.recommendations}
            onChange={handleChange}
            placeholder="Recommendations"
            className="w-full p-3 border border-gray-300 rounded-xl h-24 resize-none focus:ring-2 focus:ring-indigo-400"
            required
          />
          <button
            type="submit"
            className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition duration-200"
          >
            Submit Consultation
          </button>
        </form>
      </div>
    </div>
  );
};

export default Consultation;