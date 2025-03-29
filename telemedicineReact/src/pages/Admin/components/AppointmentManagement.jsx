import React from "react";
import SearchBar from "./ui/SearchBar";
import AppointmentTable from "./ui/AppointmentTable";
import ConfirmationModal from "../../../components/ConfirmationModal";
import AppointmentCreateForm from "./ui/AppointmentCreateForm";
import AppointmentEditForm from "./ui/AppointmentEditForm"
import useAppointmentManagement from "../../../hooks/useAppointmentManagement";

const AppointmentManagement = () => {
  const {
    appointments,
    filteredAppointments,
    searchQuery,
    showConfirmationModal,
    selectedAppointmentId,
    selectedStatus,
    operation,
    showCreateModal,
    showEditModal,
    editAppointment,
    formData,
    setSearchQuery,
    cancelCreateForm,
    handleConfirmUpdateStatus,
    handleDeleteAppointment,
    handleCreateAppointment,
    closeCreateModal,
    openCreateModal,
    closeEditModal,
    handleEditClick,
    handleDeleteClick,
    handleStatusChange,
    setShowEditModal,
    handleEditAppointmentClick,
    setFormData,
    handleUpdate,
    cancelEdit,
  } = useAppointmentManagement(); // Custom hook managing state and logic

  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">Appointment Manager</h2>

      {/* Create Appointment Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-primary bg-opacity-80 flex justify-center items-center z-50">
          <AppointmentCreateForm
            handleCreateAppointment={handleCreateAppointment}
            cancelCreateForm={closeCreateModal} // Closing the create modal
            setFormData={setFormData}
            formData={formData}
          />
        </div>
      )}
      
      {editAppointment && (
  <div className="fixed inset-0 z-50 flex items-center justify-center">
    {/* Modal Content */}
    <div className="bg-white p-6 rounded-lg shadow-lg w-96 max-w-full">
      <AppointmentEditForm
        appointment={editAppointment}
        setFormData={setFormData}
        handleUpdate={handleUpdate}
        cancelEdit={cancelEdit}
      />
    </div>
  </div>
)}


      <div className="flex justify-between mb-4">
        <SearchBar 
          searchQuery={searchQuery} 
          setSearchQuery={setSearchQuery} 
          className="border p-4 rounded-lg w-3/4 bg-white text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-md h-12" 
        />
        <button
          onClick={openCreateModal}
          className="w-1/4 px-6 py-3 text-lg text-white font-semibold rounded-lg shadow-md bg-teal-800 hover:bg-teal-600 transition-all"
        >
          Create Appointment
        </button>
      </div>

      <AppointmentTable
        appointments={filteredAppointments}
        handleEditAppointmentClick={handleEditAppointmentClick}
        handleDeleteClick={handleDeleteClick}
        handleStatusChange={handleStatusChange}
      />

      {/* Confirmation Modal for Update/Delete */}
      {showConfirmationModal && (
        <ConfirmationModal
          message={
            operation === "update"
              ? `Are you sure you want to update the status to "${selectedStatus}"?`
              : "Are you sure you want to delete this appointment?"
          }
          actionLabel={operation === "update" ? "Confirm Update" : "Confirm Delete"}
          onConfirm={operation === "update" ? handleConfirmUpdateStatus : () => handleDeleteAppointment(selectedAppointmentId)}
          onCancel={() => setShowConfirmationModal(false)} // Close confirmation modal
        />
      )}
    </div>
  );
};

export default AppointmentManagement;