import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import ConfirmationModal from "../components/ConfirmationModal";
import {
  fetchPatients as fetchPatientsApi,
  createPatient as createPatientApi,
  fetchPatientById as fetchPatientByIdApi,
  updatePatient as updatePatientApi,
  deletePatient as deletePatientApi} from "../pages/Admin/services/patientApi"// Import the methods from patientApi

const usePatientManagement = () => {
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingCreate, setLoadingCreate] = useState(false);
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [editPatient, setEditPatient] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentPatientId, setCurrentPatientId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [patientIdToDelete, setPatientIdToDelete] = useState(null);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const openCreateModal = () => setShowCreateModal(true);
  const [operation, setOperation] = useState(""); // Added state for operation type

  const [selectedPatientId, setSelectedPatientId] = useState(null);
  const closeCreateModal = () => setShowCreateModal(false);

  const [formData, setFormData] = useState({
    fullName: "",                    // Full Name
    email: "",                       // Email Address
    phoneNumber: "",                 // Phone Number (backend expects "phoneNumber")
    gender: "",                      // Gender (e.g., male, female, other)
    dateOfBirth: "",                 // Date of Birth (should be in a proper date format)
    bloodGroup: "",                  // Blood Group (backend expects "bloodGroup")
    address: "",                     // Address
    emergencyContactName: "",        // Emergency contact name (backend expects "emergencyContactName")
    emergencyContactNumber: "",      // Emergency contact number (backend expects "emergencyContactNumber")
    healthInsuranceProvider: "",     // Health Insurance Provider (backend expects "healthInsuranceProvider")
    medicalHistory: "",              // Medical History
    profileImage: null,              // Profile Picture (file upload or URL, backend expects "profileImage")
    maritalStatus: "",               // Marital Status
    allergies: "",                   // Allergies (backend expects "allergies")
    chronicDiseases: "",             // Chronic Diseases (backend expects "chronicDiseases")
    medications: "",                 // Medications (backend expects "medications")
    password: "",                    // Password (for login)
    confirmPassword: "",             // Confirm Password (for matching password)
  });
  const cancelCreateForm = () => {
    closeCreateModal(); // This will close the modal when called
  };

  // Fetch all patients
  const fetchPatients = async () => {
    setLoading(true);
    try {
      console.log("📢 Fetching patients...");
      const response = await fetchPatientsApi(); // Use patientApi's fetchPatients method
      setPatients(response);
      setFilteredPatients(response);
      console.log("✅ Patients updated in state:", response);
    } catch (err) {
      console.error("❌ Error fetching patients:", err);
      setError(`Error fetching patients: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("Modal visibility changed:", showCreateModal);
  }, [showCreateModal]);

  useEffect(() => {
    fetchPatients();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredPatients(patients);
    } else {
      setFilteredPatients(
        patients.filter((patient) =>
          patient.fullName.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }
  }, [searchQuery, patients]);

  // Handle create patient
  const handleCreatePatient = async (patientData) => {
    setLoadingCreate(true);
    try {
      const response = await createPatientApi(patientData); // Use patientApi's createPatient method
      
      console.log("Full Response from registerUser:", response.data);
      console.log("response.status type:", typeof response.status);
      
      if (response.status == 200) {
        console.log("toast");
        toast.success(response.data); // Show success toast
        
        // Close the modal after success
        console.log(showCreateModal);
        closeCreateModal();  // Close modal (you can change this depending on how you manage the modal state)
        
        // Optionally, you can return the response to handle it further in the parent component
      } else {
        toast.error(response.data); // Show error toast if not successful
        // Handle error from the API response
      }
    } catch (error) {
      console.error("Error during patient creation:", error);
      toast.error("An error occurred during registration."); // Show error toast
      return { status: 500, data: { message: "An error occurred during registration." } };
    } finally {
      setLoadingCreate(false);  // Reset loading state
    }
  };

  // Handle edit patient click
  const handleEditPatientClick = async (patientId) => {
    try {
      console.log("Hello");
      const response = await fetchPatientByIdApi(patientId);
      if (response) {
        setEditPatient(response);  // This should set the patient data correctly
        setCurrentPatientId(patientId);
        console.log("Setting showEditModal to true");
        setShowEditModal(true);  // This should trigger the modal visibility
      } else {
        console.log("No data returned from API.");
      }
      setCurrentPatientId(patientId);
      setShowEditModal(true);
      console.log(showEditModal);
    } catch (err) {
      setError(`Error fetching patient details: ${err.message}`);
    }
  };
  useEffect(() => {
    if (editPatient && Object.keys(editPatient).length > 0) {
      console.log("Updated editPatient in useEffect:", editPatient);
      setShowEditModal(true); // Ensure modal opens
      console.log("Modal should now be open");
    }
  }, [editPatient]);
  // Handle update patient
  const handleUpdatePatient = async (updatedData) => {
    e.preventDefault();
    setLoadingUpdate(true);
    try {
      await updatePatientApi(currentPatientId, updatedData); // Use patientApi's updatePatient method
      toast.success("Patient updated successfully!");
      fetchPatients();
      setShowEditModal(false);
    } catch (err) {
      setError(`Error updating patient: ${err.message}`);
      toast.error(err.message);
    } finally {
      setLoadingUpdate(false);
    }
  };
  const handleDeleteClick = async (patientId) => {
    console.log("Delete");  
    setSelectedPatientId(patientId); // Store the patientId to delete
    setOperation("delete");          // Set the operation to delete
    setShowConfirmationModal(true);  // Show the confirmation modal
  };
  
  // Handle the confirmation of the delete action
  const handleDeleteConfirm = async () => {
    if (operation === "delete") {
      try {
        // Proceed with the delete action using selectedPatientId
        await handleDeletePatient(selectedPatientId); // Your delete logic here
        setShowConfirmationModal(false); // Close the modal after delete
      } catch (error) {
        // Handle any errors here
        console.error("Error during delete:", error);
      }
    }
  };
  
  // Handle cancel
  const handleDeleteCancel = () => {
    setShowConfirmationModal(false); // Close the modal on cancel
  };

  // Handle delete patient
  const handleDeletePatient = async (patientId) => {
    setLoadingDelete(true);
    try {
      await deletePatientApi(patientId); // Use patientApi's deletePatient method
      toast.success("Patient deleted successfully!");

      // Optionally, refresh the patient list after deletion
      fetchPatients();

      // Close the modal after successful deletion
      setShowDeleteModal(false);
      setPatientIdToDelete(null);  // Reset the patientId
    } catch (err) {
      toast.error(`Error deleting patient: ${err.message}`);
      setLoadingDelete(false);
    }
  };

  return {
    patients,
    filteredPatients,
    loading,
    loadingCreate,
    loadingUpdate,
    loadingDelete,
    error,
    searchQuery,
    setSearchQuery,
    formData,
    setFormData,
    handleCreatePatient,
    handleEditPatientClick,
    handleUpdatePatient,
    handleDeletePatient,
    showCreateModal,
    setShowCreateModal,
    showEditModal,
    setShowEditModal,
    openCreateModal,
    closeCreateModal,
    cancelCreateForm,
    handleDeleteClick,
    showDeleteModal,
    setShowDeleteModal,
    showConfirmationModal,
    setShowConfirmationModal,
  };
};

export default usePatientManagement;