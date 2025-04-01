import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import ConfirmationModal from "../components/ConfirmationModal";
import {
  fetchPatients as fetchPatientsApi,
  createPatient as createPatientApi,
  fetchPatientById as fetchPatientByIdApi,
  updatePatient as updatePatientApi,
  deletePatient as deletePatientApi,
  fetchUserIdByPatientId} from "../pages/Admin/services/patientApi"// Import the methods from patientApi

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
      const response = await fetchPatientByIdApi(patientId);
      setCurrentPatientId(patientId);
      if (response) {
        setEditPatient(response); // This sets the patient data correctly
        
        // Setting the formData just like handleEdit for doctor
        setFormData({
          patientId: response.patientId || "",
          fullName: response.fullName || "",
          email: response.email || "",
          phoneNumber: response.phoneNumber || "",
          gender: response.gender || "",
          dateOfBirth: response.dateOfBirth ? formatDate(response.dateOfBirth) : "",
          bloodGroup: response.bloodGroup || "",
          address: response.address || "",
          emergencyContactName: response.emergencyContactName || "",
          emergencyContactNumber: response.emergencyContactNumber || "",
          healthInsuranceProvider: response.healthInsuranceProvider || "",
          medicalHistory: response.medicalHistory || "",
          profileImage: response.profileImage || "",
          maritalStatus: response.maritalStatus || "",
          allergies: response.allergies || "",
          chronicDiseases: response.chronicDiseases || "",
          medications: response.medications || "",
          updatedAt: response.updatedAt || "",
        });
        function formatDate(date) {
          const d = new Date(date);
          const year = d.getFullYear();
          const month = String(d.getMonth() + 1).padStart(2, '0'); // Ensure two digits for the month
          const day = String(d.getDate()).padStart(2, '0'); // Ensure two digits for the day
          return `${year}-${month}-${day}`;
        }
        
        setShowEditModal(true); // This triggers the modal visibility
      } else {
        console.log("No data returned from API.");
      }
      setCurrentPatientId(patientId);
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
    //e.preventDefault();
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
    const userIdToDelete = await fetchUserIdByPatientId(patientId);
    setSelectedPatientId(userIdToDelete); // Store the patientId to delete
    setOperation("delete");          // Set the operation to delete
    setShowConfirmationModal(true);  // Show the confirmation modal
  };
  
  // Handle the confirmation of the delete action
  // const handleDeleteConfirm = async () => {
  //   if (operation === "delete") {
  //     try {
  //       // Proceed with the delete action using selectedPatientId
  //       await handleDeletePatient(selectedPatientId); // Your delete logic here
  //       setShowConfirmationModal(false); // Close the modal after delete
  //     } catch (error) {
  //       // Handle any errors here
  //       console.error("Error during delete:", error);
  //     }
  //   }
  // };
  
  // // Handle cancel
  // const handleDeleteCancel = () => {
  //   setShowConfirmationModal(false); // Close the modal on cancel
  // };

  // Handle delete patient
  const handleDeletePatient = async (patientId) => {
    setLoadingDelete(true);
    try {
      const response = await deletePatientApi(patientId); // Ensure this function is correct
      console.log(response);
      toast.success("Patient deleted successfully!");
  
      // ✅ Ensure table data is refreshed
      await fetchPatients(); // Wait for data refresh before closing modal
  
      // ✅ Close modal & reset state after deletion
      setShowConfirmationModal(false);
      setPatientIdToDelete(null);
    } catch (err) {
      console.error("Error deleting patient:", err);
      toast.error("Failed to delete patient.");
    } finally {
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
    selectedPatientId,
    editPatient,
    setEditPatient,
  };
};

export default usePatientManagement;