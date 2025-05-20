import { useNavigate } from "react-router-dom";
import useDoctorManagement from "../../../hooks/useDoctorManagement";
import DoctorTable from "./ui/DoctorTable";
import EditDoctorForm from "./ui/EditDoctorForm";
import ConfirmationModal from "../../../components/ConfirmationModal";
import SearchBar from "./ui/SearchBar";
import { deleteDoctor } from "../services/doctorApi";
import useUserManagement from "../../../hooks/useUserManagement";
import RegisterDoctorForms from "./ui/RegisterDoctor";

const DoctorManagement = () => {
  const navigate = useNavigate();
  const {
    handleRegisterClick,  
    showRegisterForm,
    setShowRegisterForm,
  } = useUserManagement();
  const {
    doctors,
    loadDoctors,
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
    errorMessage,
    setErrorMessage,
    setEditDoctor,
    searchQuery,
    setSearchQuery,
    sortColumn,
    setSortColumn,
    sortOrder,
    setSortOrder,
    userIdToDelete,
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
  }

  // Handle Delete Confirmation
  const handleDeleteDoctor = async (userId) => {
    console.log("hellosdas");
    console.log("her",userId);
    setUserIdToDelete(userId);
    setShowDeleteModal(true);
  };

  // Delete doctor after confirmation
  const handleConfirmDelete = async () => {
    console.log("sfgfsdgsdfGSDF",userIdToDelete);
    try {
      const responseMessage = await deleteDoctor(userIdToDelete);
      console.log("hello");
      setSuccessMessage(responseMessage);
      setErrorMessage("");
      setShowDeleteModal(false);
      
      setTimeout(() => setSuccessMessage(""), 5000);
    } catch (error) {
      setErrorMessage(error.message);
      setSuccessMessage("");
      setShowDeleteModal(false);

      setTimeout(() => setErrorMessage(""), 5000);
    }
  };

  return (
    <div className="p-8 bg-gradient-to-br from-white to-teal-50 shadow-lg rounded-xl border border-teal-100">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-teal-800">Doctor Management</h2>
        
        {/* Register Doctor Button */}
        <button 
          onClick={handleRegisterClick}
          className="px-6 py-3 text-white font-semibold rounded-lg shadow-md bg-teal-700 hover:bg-teal-600 transition-all flex items-center gap-2"
        >
          {/* <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
          </svg> */}
          Register Doctor
        </button>
      </div>

      {/* Display Success Message */}
      {successMessage && (
        <div className="bg-gradient-to-r from-teal-500 to-green-500 text-white p-4 mb-6 rounded-lg text-center font-medium shadow-md flex items-center justify-center space-x-2 animate-fadeIn">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span>{successMessage}</span>
        </div>
      )}

      {/* Display Error Message */}
      {errorMessage && (
        <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-4 mb-6 rounded-lg text-center font-medium shadow-md flex items-center justify-center space-x-2 animate-fadeIn">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Search Bar Component */}
      <div className="mb-8">
        <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      </div>

      {/* Doctor Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden border border-teal-100">
        <DoctorTable
          doctors={doctors}
          handleEditClick={handleEditClick}
          refreshDoctors={loadDoctors}
          handleDeleteClick={handleDeleteClick}
        />
      </div>

      {/* Show Registration Form Modal */}
      {showRegisterForm && (
  <div className="fixed inset-0 bg-teal-900 bg-opacity-70 flex justify-center items-center z-50 backdrop-blur-sm">
    <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-2xl relative border-l-4 border-teal-600">
      <h3 className="text-2xl font-bold text-teal-800 mb-6">Register New Doctor</h3>

      {/* Pass the setter so child can close modal */}
        <RegisterDoctorForms isOpen={showRegisterForm} onClose={() => setShowRegisterForm(false)} setShowRegisterForm={setShowRegisterForm} />

        {/* Close button */}
            <button
              onClick={() => setShowRegisterForm(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-teal-800 transition-colors p-2 rounded-full hover:bg-teal-50"
              aria-label="Close modal"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Show Edit Form as a Modal */}
      {editDoctor && (
        <div className="fixed inset-0 bg-teal-900 bg-opacity-70 flex justify-center items-center z-50 backdrop-blur-sm">
          <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-2xl relative border-l-4 border-teal-600">
            <h3 className="text-2xl font-bold text-teal-800 mb-6">Edit Doctor Information</h3>
            <EditDoctorForm
              formData={formData}
              setFormData={setFormData}
              handleUpdate={handleUpdate}
              cancelEdit={cancelEdit}
            />
            <button
              onClick={(e) => cancelEdit(e)}
              className="absolute top-4 right-4 text-gray-500 hover:text-teal-800 transition-colors p-2 rounded-full hover:bg-teal-50"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <ConfirmationModal
          message="Are you sure you want to delete this doctor? This action cannot be undone."
          actionLabel="Delete"
          onConfirm={handleConfirmDelete}
          onCancel={() => setShowDeleteModal(false)}
        />
      )}
    </div>
  );
};

export default DoctorManagement;