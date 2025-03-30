import { useNavigate } from "react-router-dom";
import useDoctorManagement from "../../../hooks/useDoctorManagement";
import DoctorTable from "./ui/DoctorTable";
import EditDoctorForm from "./ui/EditDoctorForm";
import ConfirmationModal from "../../../components/ConfirmationModal";
import SearchBar from "./ui/SearchBar"; // Import SearchBar
import { deleteDoctor } from "../services/doctorApi";
import useUserManagement from "../../../hooks/useUserManagement";
import RegisterUser from "../../../components/RegisterUser";

const DoctorManagement = () => {
  const navigate = useNavigate();
  const {
    handleRegisterClick,  
    showRegisterForm, // From useUserManagement hook
    setShowRegisterForm, // Ensure this is destructured properly
  } = useUserManagement();
  const {
    doctors,
    editDoctor,
    formData,
    setFormData,
    handleEditClick,
    handleRegister,
    handleUpdate,
    handleDeleteClick,
    handleDelete,
    setShowDeleteModal,
    showDeleteModal,
    successMessage,
    setSuccessMessage,
    errorMessage, // Add state for error message
    setErrorMessage, // Function to set error message
    setEditDoctor,
    searchQuery,
    setSearchQuery,
    sortColumn,
    setSortColumn,
    sortOrder,
    setSortOrder,
    userIdToDelete, // To store the userId of the doctor to be deleted
    setUserIdToDelete, 
  } = useDoctorManagement();

  // Handling the cancel action in the edit form
  const cancelEdit = (e) => {
    e.preventDefault();
    setEditDoctor(null);
    navigate(-1); // Go back to the previous page
  };

  const handleSubmit = async () => {
  
   handleRegisterClick();
   console.log(handleRegisterClick);
     // See if it's a function in the console
  //  console.log("Button Clicked");
  }

  // Handle Delete Confirmation
  const handleDeleteDoctor = async (userId) => {
    console.log("hellosdas");
    console.log("her",userId)// Set the userId to be deleted and show the confirmation modal
    setUserIdToDelete(userId);
    
    setShowDeleteModal(true);
  };

  // Delete doctor after confirmation
  const handleConfirmDelete = async () => {
    console.log("sfgfsdgsdfGSDF",userIdToDelete);
    try {
      const responseMessage = await deleteDoctor(userIdToDelete);
      console.log("hello");
      setSuccessMessage(responseMessage); // Set success message
      setErrorMessage(""); // Clear error message
      setShowDeleteModal(false); // Close modal after successful deletion
      
      // Clear the success message after 5 seconds
      setTimeout(() => setSuccessMessage(""), 5000); // Clear after 5 seconds
    } catch (error) {
      setErrorMessage(error.message); // Set error message
      setSuccessMessage(""); // Clear success message
      setShowDeleteModal(false); // Close modal after failed deletion

      // Clear the error message after 5 seconds
      setTimeout(() => setErrorMessage(""), 5000); // Clear after 5 seconds
    }
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-lg border border-gray-300">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">Doctor Management</h2>

      {/* Display Success Message */}
      {successMessage && (
        <div className="bg-green-500 text-white p-4 mb-4 rounded-lg text-center font-medium">
          {successMessage}
        </div>
      )}

      {/* Display Error Message */}
      {errorMessage && (
        <div className="bg-red-500 text-white p-4 mb-4 rounded-lg text-center font-medium">
          {errorMessage}
        </div>
      )}

      {/* Search and Action Section */}
      <div className="flex justify-between items-center mb-6 gap-4">
        {/* Search Bar Component */}
        <div className="w-3/4">
          <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        </div>

        {/* Register Doctor Button */}
        <button 
          onClick={handleRegisterClick} // Directly show the form when clicked
          className="w-1/4 px-6 py-3 text-lg text-white font-semibold rounded-lg shadow-md bg-teal-800 hover:bg-teal-600 transition-all"
        >
          Register Doctor
        </button>
      </div>

      {/* Show Registration Form Modal */}
      {showRegisterForm && (
      <div className="fixed inset-0 bg-primary bg-opacity-80 flex justify-center items-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl relative">
          {/* Modal content */}
          <RegisterUser setShowRegisterForm={setShowRegisterForm} />
          
          {/* Close button */}
          <button
            onClick={() => setShowRegisterForm(false)} // Close form when clicked
            className="absolute top-2 right-5 text-xl text-teal-700 bg-teal-900 hover:bg-teal-600 hover:text-black"
          >
            X
          </button>
        </div>
      </div>
    )}

      {/* Show Edit Form as a Modal */}
      {editDoctor && (
      <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl relative">
          <EditDoctorForm
            formData={formData}
            setFormData={setFormData}
            handleUpdate={handleUpdate}
            cancelEdit={cancelEdit} // Pass cancel function to navigate back
          />
          <button
            onClick={(e) => cancelEdit(e)} // Close form when clicked
            className="absolute top-2 right-5 text-xl text-teal-700 bg-teal-900 hover:bg-teal-600 hover:text-black"
          >
            X
          </button>
        </div>
      </div>
    )}

      {/* Doctor Table */}
      <DoctorTable
        doctors={doctors}
        handleEditClick={handleEditClick}
        handleDeleteClick={handleDeleteClick} // Call the handleDeleteDoctor function here
      />

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <ConfirmationModal
          message="Are you sure you want to delete this doctor? This action cannot be undone."
          actionLabel="Delete"
          onConfirm={handleConfirmDelete} // Call handleConfirmDelete on confirmation
          onCancel={() => setShowDeleteModal(false)} // Close modal without deleting
        />
      )}
    </div>
  );
};

export default DoctorManagement;