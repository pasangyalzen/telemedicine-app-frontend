import React from "react";
import { X } from "lucide-react";

const PatientProfileModal = ({ patient, onClose }) => {
  if (!patient) return null;
  
  // Format date properly
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl relative overflow-hidden">
        {/* Header Section with Teal Gradient */}
        <div className="bg-gradient-to-r from-teal-600 to-teal-400 p-6 text-white">
          <h2 className="text-2xl font-bold">{patient.fullName}</h2>
          <div className="flex gap-4 mt-2 text-teal-50">
            <span className="flex items-center gap-1">
              <span className="text-sm">{patient.gender}</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="text-sm">{formatDate(patient.dateOfBirth)}</span>
            </span>
            <span className="bg-teal-700 px-2 py-1 rounded-full text-xs">
              {patient.bloodGroup}
            </span>
          </div>
        </div>
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 bg-white rounded-full p-1 text-teal-600 hover:bg-teal-50 transition-colors"
        >
          <X size={20} />
        </button>

        <div className="p-6">
          <div className="flex gap-6 flex-col md:flex-row">
            {/* Left column with photo and primary details */}
            <div className="md:w-1/3">
              <div className="flex flex-col items-center">
                <img
                  src={`http://localhost:5186${patient.profileImage}`}
                  alt={patient.fullName}
                  className="w-32 h-32 rounded-full object-cover border-4 border-teal-100 shadow-md"
                />
                
                <div className="bg-teal-50 rounded-lg p-4 mt-4 w-full">
                  <h3 className="font-medium text-teal-700 border-b border-teal-100 pb-2 mb-2">Contact</h3>
                  <p className="text-sm mb-2">{patient.email}</p>
                  <p className="text-sm mb-2">{patient.phoneNumber}</p>
                  <p className="text-sm">{patient.address}</p>
                </div>
              </div>
            </div>
            
            {/* Right column with medical details */}
            <div className="md:w-2/3">
              {/* Medical Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-teal-50 to-white rounded-lg p-4 border border-teal-100">
                  <h3 className="font-medium text-teal-700 mb-2">Medical Information</h3>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium text-gray-600">Allergies:</span> {patient.allergies || "None reported"}</p>
                    <p><span className="font-medium text-gray-600">Chronic Diseases:</span> {patient.chronicDiseases || "None reported"}</p>
                    <p><span className="font-medium text-gray-600">Medications:</span> {patient.medications || "None reported"}</p>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-teal-50 to-white rounded-lg p-4 border border-teal-100">
                  <h3 className="font-medium text-teal-700 mb-2">Health Insurance</h3>
                  <p className="text-sm">{patient.healthInsuranceProvider || "Not specified"}</p>
                </div>
                
                <div className="bg-gradient-to-br from-teal-50 to-white rounded-lg p-4 border border-teal-100 md:col-span-2">
                  <h3 className="font-medium text-teal-700 mb-2">Emergency Contact</h3>
                  <p className="text-sm">{patient.emergencyContactName} ({patient.emergencyContactNumber})</p>
                </div>
                
                <div className="bg-gradient-to-br from-teal-50 to-white rounded-lg p-4 border border-teal-100 md:col-span-2">
                  <h3 className="font-medium text-teal-700 mb-2">Medical History</h3>
                  <p className="text-sm">{patient.medicalHistory || "No history recorded"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientProfileModal;