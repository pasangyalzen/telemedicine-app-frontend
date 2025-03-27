import React, { useState, useEffect } from "react";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { Table, Thead, Tbody, Tr, Th, Td } from "../../../../components/ui/Table";
import ConfirmationModal from "../../../../components/ConfirmationModal";

const AppointmentTable = ({ appointments = [], handleEditAppointmentClick, handleDeleteClick, handleStatusChange }) => {
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [showDeleteConfirmationModal, setShowDeleteConfirmationModal] = useState(false);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isLastPage, setIsLastPage] = useState(false); // State to check if it's the last page
  

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

  // Handle page change
  // const handlePageChange = (pageNumber) => {
  //   if (pageNumber >= 1 && pageNumber <= totalPages) {
  //     setCurrentPage(pageNumber);
  //     setIsLastPage(pageNumber === totalPages); // Set if it's the last page
  //   }
  // };

  useEffect(() => {
    // Check if the current page is the last page
    setIsLastPage(currentPage === totalPages);
  }, [currentPage, totalPages]);

  return (
    <div className="overflow-x-auto shadow-lg rounded-lg text-black">
      <Table>
        <Thead className="bg-teal-600 ">
          <Tr>
            <Th className="p-4 border border-gray-300 text-sm font-semibold text-center">ID</Th>
            <Th className="p-4 border border-gray-300 text-sm font-semibold text-center">Patient Name</Th>
            <Th className="p-4 border border-gray-300 text-sm font-semibold text-center">Doctor Name</Th>
            <Th className="p-4 border border-gray-300 text-sm font-semibold text-center">Date</Th>
            <Th className="p-4 border border-gray-300 text-sm font-semibold text-center">Time</Th>
            <Th className="p-4 border border-gray-300 text-sm font-semibold text-center">Status</Th>
            <Th className="p-4 border border-gray-300 text-sm font-semibold text-center">Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {paginatedAppointments.length > 0 ? (
            paginatedAppointments.map((appointment, index) => (
              <Tr key={appointment.appointmentId ?? index} className="border-b hover:bg-gray-100">
                <Td className="p-4 border border-gray-300 text-center text-black">{appointment.appointmentId}</Td>
                <Td className="p-4 border border-gray-300 text-center text-black">{appointment.patientName}</Td>
                <Td className="p-4 border border-gray-300 text-center text-black">{appointment.doctorName}</Td>
                <Td className="p-4 border border-gray-300 text-center text-black">{new Date(appointment.scheduledTime).toLocaleDateString()}</Td>
                <Td className="p-4 border border-gray-300 text-center text-black">{new Date(appointment.scheduledTime).toLocaleTimeString()}</Td>
                <Td className="p-4 border border-gray-300 text-center text-black">
                <span className="text-sm font-medium">{appointment.status}</span></Td>
                <Td className="p-4 border border-gray-300 text-center">
                  <div className="flex justify-center gap-4">
                    {/* Edit Button */}
                    <button
                      className=".flex items-center text-teal-600 border-teal-600 bg-white hover:bg-teal-100"
                      onClick={() => handleEditAppointmentClick(appointment.appointmentId)}
                    >
                      <FaEdit size={18} className="mr-2" />
                      Edit
                    </button>
                    {/* Delete Button */}
                    <button
                      className=".flex items-center bg-red-600 border-teal-600 text-white hover:bg-red-700"
                      onClick={() => {
                        setSelectedAppointmentId(appointment.appointmentId);
                        setShowDeleteConfirmationModal(true);
                      }}
                    >
                      <FaTrashAlt size={18} className="mr-2" />
                      Delete
                    </button>
                  </div>
                </Td>
              </Tr>
            ))
          ) : (
            <Tr>
              <Td colSpan="7" className="p-4 border border-gray-300 text-center text-gray-500">
                No appointments found.
              </Td>
            </Tr>
          )}
        </Tbody>
      </Table>

      {/* Pagination Controls */}
      {/* Pagination Controls */}
      {/* <div className="flex justify-center mt-4">
        <button 
          onClick={() => handlePageChange(currentPage - 1)} 
          disabled={currentPage === 1} 
          className="px-4 py-2 bg-teal-600 text-white rounded-lg mr-2 transition-all hover:bg-teal-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          Prev
        </button>
        <span className="text-lg font-semibold px-4 py-2">{`${currentPage} of ${totalPages}`}</span>
        <button 
          onClick={() => handlePageChange(currentPage + 1)} 
          disabled={currentPage === totalPages} 
          className="px-4 py-2 bg-teal-600 text-white rounded-lg ml-2 transition-all hover:bg-teal-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div> */}

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

      {/* Page End Message
      {isLastPage && <div className="text-center text-teal-600 mt-4">You have reached the last page.</div>} */}
    </div>
  );
};

export default AppointmentTable;