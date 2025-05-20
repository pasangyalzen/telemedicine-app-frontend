import React, { useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:5186/api";

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

const PatientTable = ({ patients, refreshPatients }) => {
  const patientList = patients?.patients || [];

  const [expandedPatientId, setExpandedPatientId] = useState(null);
  const [modalData, setModalData] = useState({ open: false, patientId: null, currentStatus: false });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Local state for patient list to update status optimistically
  const [localPatients, setLocalPatients] = useState(patientList);

  // Update localPatients if the prop changes
  React.useEffect(() => {
    setLocalPatients(patientList);
  }, [patientList]);

  const toggleExpand = (patientId) => {
    setExpandedPatientId((prev) => (prev === patientId ? null : patientId));
  };

  const openConfirmationModal = (patientId, currentStatus) => {
    setModalData({ open: true, patientId, currentStatus });
    setError(null);
  };

  const closeModal = () => {
    setModalData({ open: false, patientId: null, currentStatus: false });
    setError(null);
  };

  const confirmToggleStatus = async () => {
    if (!modalData.patientId) return;
    setLoading(true);
    setError(null);

    try {
      await apiClient.put(`/Patient/TogglePatientStatus/${modalData.patientId}`);
      
      // Optimistically update localPatients
      setLocalPatients((prevPatients) =>
        prevPatients.map((p) =>
          p.patientId === modalData.patientId ? { ...p, status: !modalData.currentStatus } : p
        )
      );

      setLoading(false);
      closeModal();

      // Call refreshPatients to sync with backend (optional)
      if (typeof refreshPatients === "function") {
        refreshPatients();
      }
    } catch (err) {
      setLoading(false);
      setError("Failed to toggle status. Please try again.");
      console.error(err);
    }
  };

  return (
    <div className="w-full overflow-x-auto rounded-xl shadow-xl bg-white p-4">
      <table className="w-full table-auto text-sm text-gray-700">
        <thead className="bg-gradient-to-r from-teal-600 to-teal-700 text-white text-[13px] uppercase">
          <tr>
            <th className="px-3 py-3 text-left">Patient</th>
            <th className="px-3 py-3 text-left">Gender</th>
            <th className="px-3 py-3 text-left">DOB</th>
            <th className="px-3 py-3 text-left">Phone</th>
            <th className="px-3 py-3 text-center">Status</th>
            <th className="px-3 py-3 text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-teal-100">
          {localPatients.length > 0 ? (
            localPatients.map((patient) => (
              <React.Fragment key={patient.patientId}>
                <tr className="hover:bg-teal-50 transition-all duration-200">
                  <td className="px-3 py-4 whitespace-nowrap flex items-center space-x-3">
                    <img
                      src={
                        patient.profileImage?.startsWith("http")
                          ? patient.profileImage
                          : `http://localhost:5186${patient.profileImage || ""}`
                      }
                      alt="Patient"
                      className="w-10 h-10 rounded-full object-cover border border-teal-500"
                    />
                    <span className="font-medium">{patient.fullName}</span>
                  </td>
                  <td className="px-3 py-4">{patient.gender}</td>
                  <td className="px-3 py-4">{new Date(patient.dateOfBirth).toLocaleDateString()}</td>
                  <td className="px-3 py-4">{patient.phoneNumber}</td>
                  <td className="px-3 py-4 text-center">
                    <button
                      onClick={() => openConfirmationModal(patient.patientId, patient.status)}
                      className={`inline-block px-4 py-2 rounded-full font-semibold text-white transition-colors duration-300 focus:outline-none ${
                        patient.status
                          ? "bg-teal-600 hover:bg-teal-700 focus:ring-teal-400"
                          : "bg-rose-600 hover:bg-rose-700 focus:ring-rose-400"
                      }`}
                    >
                      {patient.status ? "Active" : "Inactive"}
                    </button>
                  </td>
                  <td className="px-3 py-4 text-center">
                    <button
                      onClick={() => toggleExpand(patient.patientId)}
                      className="text-sm text-teal-700 bg-teal-100 hover:bg-teal-200 px-3 py-1 rounded-full transition"
                    >
                      {expandedPatientId === patient.patientId ? "Hide" : "See Full Detail"}
                    </button>
                  </td>
                </tr>

                {expandedPatientId === patient.patientId && (
                  <tr>
                    <td colSpan="6" className="px-6 py-4 bg-gray-50 border-t border-teal-100 text-xs text-gray-800">
                      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                        <div><strong>Email:</strong> {patient.email}</div>
                        <div><strong>Address:</strong> {patient.address}</div>
                        <div><strong>Blood Group:</strong> {patient.bloodGroup}</div>
                        <div><strong>Emergency Contact:</strong> {patient.emergencyContactName} ({patient.emergencyContactNumber})</div>
                        <div><strong>Insurance:</strong> {patient.healthInsuranceProvider}</div>
                        <div><strong>Medical History:</strong> {patient.medicalHistory}</div>
                        <div><strong>Allergies:</strong> {patient.allergies}</div>
                        <div><strong>Chronic Diseases:</strong> {patient.chronicDiseases}</div>
                        <div><strong>Medications:</strong> {patient.medications}</div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                <div className="flex flex-col items-center space-y-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-10 w-10 text-teal-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <p className="text-md">No patients found</p>
                  <p className="text-xs text-gray-400">Try adjusting your search or add a new patient.</p>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Confirmation Modal */}
      {modalData.open && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-lg p-6 w-80 max-w-full shadow-lg">
            <h3 className="text-lg font-semibold mb-4">
              {modalData.currentStatus ? "Deactivate Patient" : "Activate Patient"}
            </h3>
            <p className="mb-6">
              Are you sure you want to {modalData.currentStatus ? "deactivate" : "activate"} this patient?
            </p>
            {error && <p className="text-red-600 mb-2">{error}</p>}
            <div className="flex justify-end space-x-3">
              <button
                onClick={closeModal}
                disabled={loading}
                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmToggleStatus}
                disabled={loading}
                className="px-4 py-2 rounded bg-teal-600 text-white hover:bg-teal-700 disabled:opacity-50"
              >
                {loading ? "Processing..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientTable;