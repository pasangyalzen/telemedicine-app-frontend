import React, { useState, useEffect } from "react";
import { FaCalendarAlt, FaClock } from "react-icons/fa";
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

  const handleStatusChangeSelect = (appointmentId, status) => {
    setSelectedAppointmentId(appointmentId);
    setSelectedStatus(status);
    setShowConfirmationModal(true);
  };

  const handleConfirmStatusChange = () => {
    handleStatusChange(selectedAppointmentId, selectedStatus);
    setShowConfirmationModal(false);
  };

  const handleConfirmDelete = () => {
    handleDeleteClick(selectedAppointmentId);
    setShowDeleteConfirmationModal(false);
  };

  useEffect(() => {
    setIsLastPage(currentPage === totalPages);
  }, [currentPage, totalPages]);

  const getStatusBadgeColor = (status) => {
    switch (status?.toLowerCase()) {
      case "scheduled":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
        case "noshow":
      return "bg-gray-300 text-gray-800 border-gray-400";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="overflow-hidden shadow-xl rounded-xl border border-gray-200">
      <Table>
        <Thead className="bg-teal-600 text-white">
          <Tr>
            <Th className="p-4 border-b border-teal-700 text-sm font-bold tracking-wide text-center">Patient Name</Th>
            <Th className="p-4 border-b border-teal-700 text-sm font-bold tracking-wide text-center">Doctor Name</Th>
            <Th className="p-4 border-b border-teal-700 text-sm font-bold tracking-wide text-center">Date</Th>
            <Th className="p-4 border-b border-teal-700 text-sm font-bold tracking-wide text-center">Time</Th>
            <Th className="p-4 border-b border-teal-700 text-sm font-bold tracking-wide text-center">Status</Th>
          </Tr>
        </Thead>
        <Tbody>
          {paginatedAppointments.length > 0 ? (
            paginatedAppointments.map((appointment, index) => (
              <Tr key={index} className="border-b transition-colors hover:bg-gray-50">
                <Td className="p-4 text-center font-medium text-gray-900">{appointment.patientName}</Td>
                <Td className="p-4 text-center font-medium text-gray-900">{appointment.doctorName}</Td>
                <Td className="p-4 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <FaCalendarAlt className="text-teal-600" />
                    <span className="font-medium text-gray-900">
                      {new Date(appointment.appointmentDate).toLocaleDateString()}
                    </span>
                  </div>
                </Td>
                <Td className="p-4 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <FaClock className="text-teal-600" />
                    <span className="font-medium text-gray-900">
                      {appointment.startTime} - {appointment.endTime}
                    </span>
                  </div>
                </Td>
                <Td className="p-4 text-center">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeColor(appointment.status)} border`}>
                    {appointment.status}
                  </span>
                </Td>
              </Tr>
            ))
          ) : (
            <Tr>
              <Td colSpan="5" className="p-8 text-center text-gray-500 font-medium">
                No appointments found.
              </Td>
            </Tr>
          )}
        </Tbody>
      </Table>

      {showConfirmationModal && (
        <ConfirmationModal
          message={`Are you sure you want to change the status to "${selectedStatus}"?`}
          actionLabel="Confirm"
          onConfirm={handleConfirmStatusChange}
          onCancel={() => setShowConfirmationModal(false)}
        />
      )}

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