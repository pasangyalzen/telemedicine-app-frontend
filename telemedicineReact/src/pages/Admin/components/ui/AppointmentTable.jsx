import React, { useState, useEffect } from "react";
import { FaEdit, FaTrashAlt, FaCalendarAlt, FaClock } from "react-icons/fa";
import { Table, Thead, Tbody, Tr, Th, Td } from "../../../../components/ui/Table";
import ConfirmationModal from "../../../../components/ConfirmationModal";

const AppointmentTable = ({ appointments = [], handleEditAppointmentClick, handleDeleteClick, handleStatusChange }) => {
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [showDeleteConfirmationModal, setShowDeleteConfirmationModal] = useState(false);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isLastPage, setIsLastPage] = useState(false);
  
  const totalPages = Math.ceil(appointments.length / itemsPerPage);
  const paginatedAppointments = Array.isArray(appointments)
    ? appointments.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
    : [];

  // Handle status change dynamically
  const handleStatusChangeSelect = (appointmentId, status) => {
    setSelectedAppointmentId(appointmentId);
    setSelectedStatus(status);
    setShowConfirmationModal(true);
  };

  // Confirm status update
  const handleConfirmStatusChange = () => {
    handleStatusChange(selectedAppointmentId, selectedStatus);
    setShowConfirmationModal(false);
  };

  // Handle deletion confirmation
  const handleConfirmDelete = () => {
    handleDeleteClick(selectedAppointmentId);
    setShowDeleteConfirmationModal(false);
  };

  useEffect(() => {
    // Check if the current page is the last page
    setIsLastPage(currentPage === totalPages);
  }, [currentPage, totalPages]);

  // Function to determine status badge color
  const getStatusBadgeColor = (status) => {
    switch(status?.toLowerCase()) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="overflow-hidden shadow-xl rounded-xl border border-gray-200">
      <Table>
        <Thead className="bg-teal-600 text-white">
          <Tr>
            <Th className="p-4 border-b border-teal-700 text-sm font-bold tracking-wide text-center">ID</Th>
            <Th className="p-4 border-b border-teal-700 text-sm font-bold tracking-wide text-center">Patient Name</Th>
            <Th className="p-4 border-b border-teal-700 text-sm font-bold tracking-wide text-center">Doctor Name</Th>
            <Th className="p-4 border-b border-teal-700 text-sm font-bold tracking-wide text-center">Date</Th>
            <Th className="p-4 border-b border-teal-700 text-sm font-bold tracking-wide text-center">Time</Th>
            <Th className="p-4 border-b border-teal-700 text-sm font-bold tracking-wide text-center">Status</Th>
            <Th className="p-4 border-b border-teal-700 text-sm font-bold tracking-wide text-center">Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {paginatedAppointments.length > 0 ? (
            paginatedAppointments.map((appointment, index) => (
              <Tr key={appointment.appointmentId ?? index} className="border-b transition-colors hover:bg-gray-50">
                <Td className="p-4 text-center font-medium text-gray-900">{appointment.appointmentId}</Td>
                <Td className="p-4 text-center font-medium text-gray-900">{appointment.patientName}</Td>
                <Td className="p-4 text-center font-medium text-gray-900">{appointment.doctorName}</Td>
                <Td className="p-4 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <FaCalendarAlt className="text-teal-600" />
                    <span className="font-medium text-gray-900">{new Date(appointment.scheduledTime).toLocaleDateString()}</span>
                  </div>
                </Td>
                <Td className="p-4 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <FaClock className="text-teal-600" />
                    <span className="font-medium text-gray-900">{new Date(appointment.scheduledTime).toLocaleTimeString()}</span>
                  </div>
                </Td>
                <Td className="p-4 text-center">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeColor(appointment.status)} border`}>
                    {appointment.status}
                  </span>
                </Td>
                <Td className="p-4 text-center">
                  <div className="flex justify-center gap-3">
                    <button
                      className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-teal-700 bg-teal-50 border border-teal-200 hover:bg-teal-100 transition-colors"
                      onClick={() => handleEditAppointmentClick(appointment.appointmentId)}
                    >
                      <FaEdit size={16} className="mr-2" />
                      Edit
                    </button>
                    <button
                      className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-white bg-red-600 border border-red-700 hover:bg-red-700 transition-colors"
                      onClick={() => {
                        setSelectedAppointmentId(appointment.appointmentId);
                        setShowDeleteConfirmationModal(true);
                      }}
                    >
                      <FaTrashAlt size={16} className="mr-2" />
                      Delete
                    </button>
                  </div>
                </Td>
              </Tr>
            ))
          ) : (
            <Tr>
              <Td colSpan="7" className="p-8 text-center text-gray-500 font-medium">
                No appointments found.
              </Td>
            </Tr>
          )}
        </Tbody>
      </Table>

      {/* Confirmation Modal for Status Change */}
      {showConfirmationModal && (
        <ConfirmationModal
          message={`Are you sure you want to change the status to "${selectedStatus}"?`}
          actionLabel="Confirm"
          onConfirm={handleConfirmStatusChange}
          onCancel={() => setShowConfirmationModal(false)}
        />
      )}

      {/* Confirmation Modal for Deletion */}
      {showDeleteConfirmationModal && (
        <ConfirmationModal
          message="Are you sure you want to delete this appointment?"
          actionLabel="Confirm Delete"
          onConfirm={handleConfirmDelete}
          onCancel={() => setShowDeleteConfirmationModal(false)}
        />
      )}
    </div>
  );
};

export default AppointmentTable;