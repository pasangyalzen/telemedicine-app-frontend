import React from "react";
import SearchBar from "./ui/SearchBar";
import PharmacistTable from "./ui/PharmacistTable";
import ConfirmationModal from "../../../components/ConfirmationModal";
import PharmacistCreateForm from "./ui/RegisterPharmacistForm";
import PharmacistEditForm from "./ui/PharmacistEditForm";
import usePharmacistManagement from "../../../hooks/usePharmacistManagement";

const PharmacistManagement = () => {
  const {
    pharmacists,
    filteredPharmacists,
    searchQuery,
    showConfirmationModal,
    selectedPharmacistId,
    operation,
    showCreateModal,
    showEditModal,
    editPharmacist,
    formData,
    setSearchQuery,
    cancelCreateForm,
    handleConfirmUpdateStatus,
    handleCreatePharmacist,
    handleDeletePharmacist,
    handleUpdatePharmacist,
    setShowConfirmationModal,
    closeCreateModal,
    openCreateModal,
    showDeleteModal,
    setShowDeleteModal,
    setEditPharmacist,
    closeEditModal,
    handleEditClick,
    handleDeleteClick,
    setShowEditModal,
    handleEditPharmacistClick,
    setFormData,
    handleUpdate,
  } = usePharmacistManagement(); // Custom hook managing state and logic

  console.log("Modal Status:", showCreateModal, "Edit Pharmacist:", editPharmacist);

  const cancelEdit = () => {
    setEditPharmacist(null);
    navigate(-1); // Go back to the previous page
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">Pharmacist Manager</h2>

      {/* Create Pharmacist Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-primary bg-opacity-80 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl relative">
            <PharmacistCreateForm
              handleCreatePharmacist={handleCreatePharmacist}
              cancelCreateForm={closeCreateModal} // Closing the create modal
              setFormData={setFormData}
              formData={formData}
              
            />
            <button
              onClick={() => closeCreateModal()} // Close the modal when clicked
              className="absolute top-2 right-2 text-xl text-gray-700"
            >
              X
            </button>
          </div>
        </div>
      )}

      {/* Edit Pharmacist Modal */}
      {showEditModal && editPharmacist && (
        <div className="fixed inset-0 bg-primary bg-opacity-80 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl relative">
            <PharmacistEditForm
              formData={formData}
              setFormData={setFormData}
              handleUpdatePharmacist={handleUpdatePharmacist}
              cancelEdit={cancelEdit}
            />
            <button
              onClick={() => cancelEdit()} // Close form when clicked
              className="absolute top-2 right-5 text-xl text-teal-700 bg-teal-900 hover:bg-teal-600 hover:text-black"
            >
              X
            </button>
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
          Create Pharmacist
        </button>
      </div>

      <PharmacistTable
        pharmacists={filteredPharmacists}
        handleEditPharmacistClick={handleEditPharmacistClick}
        handleDeleteClick={handleDeleteClick}
      />

      {/* Confirmation Modal for Update/Delete */}
      {showConfirmationModal && (
        <ConfirmationModal
          message={
            operation === "update"
              ? `Are you sure you want to update this pharmacist's details?`
              : "Are you sure you want to delete this pharmacist?"
          }
          actionLabel={operation === "update" ? "Confirm Update" : "Confirm Delete"}
          onConfirm={operation === "update"
            ? handleConfirmUpdateStatus
            : () => handleDeletePharmacist(selectedPharmacistId)}
          onCancel={() => setShowConfirmationModal(false)} // Close the confirmation modal
        />
      )}
    </div>
  );
};

export default PharmacistManagement;