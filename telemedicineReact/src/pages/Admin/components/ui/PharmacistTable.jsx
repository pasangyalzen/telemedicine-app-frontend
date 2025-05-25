import React, { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "http://localhost:5186/api";

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

const PharmacistTable = ({ pharmacists, refreshPharmacists }) => {
  console.log("Hellllllooooo",pharmacists);
  const pharmacistList = pharmacists?.pharmacists || [];

  const [expandedId, setExpandedId] = useState(null);
  const [modalData, setModalData] = useState({ open: false, pharmacistId: null, currentStatus: false });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [localPharmacists, setLocalPharmacists] = useState(pharmacistList);

  useEffect(() => {
    setLocalPharmacists(pharmacistList);
  }, [pharmacistList]);

  const toggleExpand = (id) => {
    setExpandedId(prev => (prev === id ? null : id));
  };

  const openModal = (pharmacistId, currentStatus) => {
    setModalData({ open: true, pharmacistId, currentStatus });
    setError(null);
  };

  const closeModal = () => {
    setModalData({ open: false, pharmacistId: null, currentStatus: false });
    setError(null);
  };

  const confirmToggleStatus = async () => {
    if (!modalData.pharmacistId) return;
    setLoading(true);
    setError(null);
    try {
      await apiClient.put(`/Pharmacist/TogglePharmacistStatus/${modalData.pharmacistId}`);

      setLocalPharmacists(prev =>
        prev.map(p =>
          p.pharmacistId === modalData.pharmacistId
            ? { ...p, status: !modalData.currentStatus }
            : p
        )
      );

      setLoading(false);
      closeModal();
      if (typeof refreshPharmacists === "function") {
        refreshPharmacists();
      }
    } catch (err) {
      console.error(err);
      setError("Failed to toggle status.");
      setLoading(false);
    }
  };

  return (
    <div className="w-full overflow-x-auto rounded-xl shadow-xl bg-white p-4">
      <table className="w-full table-auto text-sm text-gray-700">
        <thead className="bg-gradient-to-r from-teal-600 to-teal-700 text-white text-[13px] uppercase">
          <tr>
            <th className="px-3 py-3 text-left">Pharmacist</th>
            <th className="px-3 py-3 text-left">Gender</th>
            <th className="px-3 py-3 text-left">DOB</th>
            <th className="px-3 py-3 text-left">Phone</th>
            <th className="px-3 py-3 text-center">Status</th>
            <th className="px-3 py-3 text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-green-100">
          {localPharmacists.length > 0 ? (
            localPharmacists.map((pharmacist) => (
              <React.Fragment key={pharmacist.pharmacistId}>
                <tr className="hover:bg-green-50 transition-all duration-200">
                  <td className="px-3 py-4 whitespace-nowrap flex items-center space-x-3">
                    <img
                      src={
                        pharmacist.profileImage?.startsWith("http")
                          ? pharmacist.profileImage
                          : `http://localhost:5186${pharmacist.profileImage || ""}`
                      }
                      alt="Pharmacist"
                      className="w-10 h-10 rounded-full object-cover border border-green-500"
                    />
                    <span className="font-medium">{pharmacist.fullName}</span>
                  </td>
                  <td className="px-3 py-4">{pharmacist.gender}</td>
                  <td className="px-3 py-4">{new Date(pharmacist.dateOfBirth).toLocaleDateString()}</td>
                  <td className="px-3 py-4">{pharmacist.phoneNumber}</td>
                  <td className="px-3 py-4 text-center">
                    <button
                      onClick={() => openModal(pharmacist.pharmacistId, pharmacist.status)}
                      className={`inline-block px-4 py-2 rounded-full font-semibold text-white transition-colors duration-300 ${
                        pharmacist.status
                          ? "bg-green-600 hover:bg-green-700"
                          : "bg-rose-600 hover:bg-rose-700"
                      }`}
                    >
                      {pharmacist.status ? "Active" : "Inactive"}
                    </button>
                  </td>
                  <td className="px-3 py-4 text-center">
                    <button
                      onClick={() => toggleExpand(pharmacist.pharmacistId)}
                      className="text-sm text-green-700 bg-green-100 hover:bg-green-200 px-3 py-1 rounded-full transition"
                    >
                      {expandedId === pharmacist.pharmacistId ? "Hide" : "See Full Detail"}
                    </button>
                  </td>
                </tr>

                {expandedId === pharmacist.pharmacistId && (
                  <tr>
                    <td colSpan="6" className="px-6 py-4 bg-gray-50 text-xs text-gray-800">
                      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                        <div><strong>Email:</strong> {pharmacist.email}</div>
                        <div><strong>Pharmacy Name:</strong> {pharmacist.pharmacyName}</div>
                        <div><strong>License Number:</strong> {pharmacist.licenseNumber}</div>
                        <div><strong>Pharmacy Address:</strong> {pharmacist.pharmacyAddress}</div>
                        <div><strong>Working Hours:</strong> {pharmacist.workingHours}</div>
                        <div><strong>Services Offered:</strong> {pharmacist.servicesOffered}</div>
                        <div><strong>Created At:</strong> {new Date(pharmacist.createdAt).toLocaleString()}</div>
                        <div><strong>Updated At:</strong> {new Date(pharmacist.updatedAt).toLocaleString()}</div>
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
                  <svg className="h-10 w-10 text-green-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414A1 1 0 0119 9.586V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="text-md">No pharmacists found</p>
                  <p className="text-xs text-gray-400">Try adjusting your search or add a new pharmacist.</p>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {modalData.open && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-lg p-6 w-80 max-w-full shadow-lg">
            <h3 className="text-lg font-semibold mb-4">
              {modalData.currentStatus ? "Deactivate Pharmacist" : "Activate Pharmacist"}
            </h3>
            <p className="mb-6">
              Are you sure you want to {modalData.currentStatus ? "deactivate" : "activate"} this pharmacist?
            </p>
            {error && <p className="text-red-600 mb-2">{error}</p>}
            <div className="flex justify-end space-x-3">
              <button onClick={closeModal} disabled={loading} className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 disabled:opacity-50">
                Cancel
              </button>
              <button onClick={confirmToggleStatus} disabled={loading} className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700 disabled:opacity-50">
                {loading ? "Processing..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PharmacistTable;