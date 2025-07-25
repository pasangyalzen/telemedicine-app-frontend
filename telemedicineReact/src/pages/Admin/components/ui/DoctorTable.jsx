"use client"

import React, { useState, useEffect } from "react"
import axios from "axios"

const API_URL = "http://localhost:5186/api"

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
})

const DoctorTable = ({ handleEditClick, handleDeleteClick, searchQuery = "" }) => {
  const [doctors, setDoctors] = useState([])
  const [expandedDoctorId, setExpandedDoctorId] = useState(null)
  const [modalData, setModalData] = useState({ open: false, doctorId: null, currentStatus: false })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(5)
  const [totalDoctors, setTotalDoctors] = useState(0)
  const [sortColumn, setSortColumn] = useState("CreatedAt")
  const [sortOrder, setSortOrder] = useState("ASC")
  const [fetchLoading, setFetchLoading] = useState(false)

  // Fetch doctors with pagination
  const fetchDoctors = async (page = currentPage, search = searchQuery) => {
    setFetchLoading(true)
    try {
      const response = await apiClient.get("/admin/GetDoctors", {
        params: {
          search: search,
          sortColumn: sortColumn,
          sortOrder: sortOrder,
          page: page,
          pageSize: pageSize,
        },
      })

      if (response.data) {
        setDoctors(response.data.doctors || [])
        setTotalDoctors(response.data.totalDoctors || 0)
        setCurrentPage(response.data.currentPage || page)
      }
    } catch (err) {
      console.error("Error fetching doctors:", err)
      setDoctors([])
      setTotalDoctors(0)
    } finally {
      setFetchLoading(false)
    }
  }

  // Initial fetch and when dependencies change
  useEffect(() => {
    fetchDoctors(1, searchQuery)
  }, [searchQuery, sortColumn, sortOrder, pageSize])

  // Calculate pagination info
  const totalPages = Math.ceil(totalDoctors / pageSize)
  const startIndex = (currentPage - 1) * pageSize + 1
  const endIndex = Math.min(currentPage * pageSize, totalDoctors)

  // Pagination handlers
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage)
      fetchDoctors(newPage, searchQuery)
    }
  }

  const handlePageSizeChange = (newPageSize) => {
    setPageSize(newPageSize)
    setCurrentPage(1)
  }

  const toggleExpand = (doctorId) => {
    setExpandedDoctorId((prev) => (prev === doctorId ? null : doctorId))
  }

  // Open confirmation modal on toggle button click
  const openConfirmationModal = (doctorId, currentStatus) => {
    console.log("Toggling doctorId:", doctorId)
    setModalData({ open: true, doctorId, currentStatus })
    setError(null)
  }

  // Close modal without changes
  const closeModal = () => {
    setModalData({ open: false, doctorId: null, currentStatus: false })
    setError(null)
  }

  // Call API to toggle status on confirm
  const confirmToggleStatus = async () => {
    if (!modalData.doctorId) return
    setLoading(true)
    setError(null)

    try {
      await apiClient.put(`/admin/ToggleDoctorStatus/${modalData.doctorId}`)
      setLoading(false)
      setModalData({ open: false, doctorId: null, currentStatus: false })

      // Refresh current page after successful toggle
      fetchDoctors(currentPage, searchQuery)
    } catch (err) {
      setLoading(false)
      setError("Failed to toggle status. Please try again.")
      console.error(err)
    }
  }

  return (
    <div className="w-full overflow-x-auto rounded-xl shadow-xl bg-white p-4">
      {/* Loading indicator */}
      {fetchLoading && (
        <div className="flex justify-center items-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
        </div>
      )}

      <table className="w-full table-auto text-sm text-gray-700">
        <thead className="bg-gradient-to-r from-teal-600 to-teal-700 text-white text-[13px] uppercase">
          <tr>
            <th className="px-3 py-3 text-left">Doctor</th>
            <th className="px-3 py-3 text-left">Specialization</th>
            <th className="px-3 py-3 text-left">Experience</th>
            <th className="px-3 py-3 text-left">Fee</th>
            <th className="px-3 py-3 text-left">Gender</th>
            <th className="px-3 py-3 text-center">Status</th>
            <th className="px-3 py-3 text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-teal-100">
          {doctors.length > 0 ? (
            doctors.map((doctor) => (
              <React.Fragment key={doctor.doctorId}>
                <tr className="hover:bg-teal-50 transition-all duration-200">
                  <td className="px-3 py-4 whitespace-nowrap flex items-center space-x-3">
                    <img
                      src={
                        doctor.profileImage?.startsWith("http")
                          ? doctor.profileImage
                          : `http://localhost:5186${doctor.profileImage || ""}`
                      }
                      alt="Doctor"
                      className="w-10 h-10 rounded-full object-cover border border-teal-500"
                    />
                    <span className="font-medium">{doctor.fullName}</span>
                  </td>
                  <td className="px-3 py-4">{doctor.specialization}</td>
                  <td className="px-3 py-4">{doctor.yearsOfExperience} yrs</td>
                  <td className="px-3 py-4">Rs. {doctor.consultationFee}</td>
                  <td className="px-3 py-4">{doctor.gender}</td>
                  <td className="px-3 py-4 text-center">
                    <button
                      onClick={() => openConfirmationModal(doctor.doctorId, doctor.isActive)}
                      type="button"
                      className={`inline-block px-4 py-2 rounded-full font-semibold text-white transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-1 ${
                        doctor.isActive
                          ? "bg-green-600 hover:bg-green-700 focus:ring-green-400"
                          : "bg-red-600 hover:bg-red-700 focus:ring-red-400"
                      }`}
                      title={doctor.isActive ? "Set Inactive" : "Set Active"}
                      aria-pressed={doctor.isActive}
                    >
                      {doctor.isActive ? "Active" : "Inactive"}
                    </button>
                  </td>
                  <td className="px-3 py-4 text-center">
                    <button
                      onClick={() => toggleExpand(doctor.doctorId)}
                      className="text-sm text-teal-700 bg-teal-100 hover:bg-teal-200 px-3 py-1 rounded-full transition"
                    >
                      {expandedDoctorId === doctor.doctorId ? "Hide" : "See Full Detail"}
                    </button>
                  </td>
                </tr>

                {expandedDoctorId === doctor.doctorId && (
                  <tr>
                    <td colSpan="7" className="px-6 py-4 bg-gray-50 border-t border-teal-100 text-xs text-gray-800">
                      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <strong>Email:</strong> {doctor.email}
                        </div>
                        <div>
                          <strong>Phone:</strong> {doctor.phoneNumber}
                        </div>
                        <div>
                          <strong>Clinic:</strong> {doctor.clinicName}
                        </div>
                        <div>
                          <strong>Clinic Address:</strong> {doctor.clinicAddress}
                        </div>
                        <div>
                          <strong>License No.:</strong> {doctor.licenseNumber}
                        </div>
                        <div>
                          <strong>Medical College:</strong> {doctor.medicalCollege}
                        </div>
                        <div>
                          <strong>Date of Birth:</strong>{" "}
                          {doctor.dateOfBirth ? new Date(doctor.dateOfBirth).toLocaleDateString() : "N/A"}
                        </div>
                        <div>
                          <strong>Status:</strong> {doctor.isActive ? "Active" : "Inactive"}
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
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
                  <p className="text-md">No doctors found</p>
                  <p className="text-xs text-gray-400">Try adjusting your search or add a new doctor.</p>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination Controls */}
      {totalDoctors > 0 && (
        <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4 bg-gray-50 p-4 rounded-lg">
          {/* Results info */}
          <div className="text-sm text-gray-700 font-medium">
            Showing {startIndex}-{endIndex} of {totalDoctors} doctors
          </div>

          {/* Pagination buttons */}
          <div className="flex items-center gap-2">
            {/* Previous button */}
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-gray-500 transition-colors"
            >
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Previous
            </button>

            {/* Page numbers */}
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(3, totalPages) }, (_, i) => {
                let pageNum
                if (totalPages <= 3) {
                  pageNum = i + 1
                } else if (currentPage <= 2) {
                  pageNum = i + 1
                } else if (currentPage >= totalPages - 1) {
                  pageNum = totalPages - 2 + i
                } else {
                  pageNum = currentPage - 1 + i
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      currentPage === pageNum
                        ? "text-white bg-teal-600 hover:bg-teal-700"
                        : "text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700"
                    }`}
                  >
                    {pageNum}
                  </button>
                )
              })}
            </div>

            {/* Next button */}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-gray-500 transition-colors"
            >
              Next
              <svg className="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </button>
          </div>

          {/* Page size selector */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Show:</span>
            <select
              value={pageSize}
              onChange={(e) => handlePageSizeChange(Number(e.target.value))}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {modalData.open && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-lg p-6 w-80 max-w-full shadow-lg">
            <h3 className="text-lg font-semibold mb-4">
              {modalData.currentStatus ? "Deactivate Doctor" : "Activate Doctor"}
            </h3>
            <p className="mb-6">
              Are you sure you want to {modalData.currentStatus ? "deactivate" : "activate"} this doctor?
            </p>
            {error && <p className="text-red-600 mb-2">{error}</p>}
            <div className="flex justify-end space-x-3">
              <button
                onClick={closeModal}
                disabled={loading}
                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 disabled:opacity-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmToggleStatus}
                disabled={loading}
                className="px-4 py-2 rounded bg-teal-600 text-white hover:bg-teal-700 disabled:opacity-50 transition"
              >
                {loading ? "Processing..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default DoctorTable