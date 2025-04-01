import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import ConfirmationModal from "../components/ConfirmationModal";
import {
  fetchPharmacists as fetchPharmacistsApi,
  createPharmacist as createPharmacistApi,
  fetchPharmacistById as fetchPharmacistByIdApi,
  updatePharmacist as updatePharmacistApi,
  deletePharmacist as deletePharmacistApi,
  fetchUserIdByPharmacistId
} from "../pages/Admin/services/pharmacistApi"; // Adjust path based on your project

const usePharmacistManagement = () => {
  const [pharmacists, setPharmacists] = useState([]);
  const [filteredPharmacists, setFilteredPharmacists] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingCreate, setLoadingCreate] = useState(false);
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [editPharmacist, setEditPharmacist] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentPharmacistId, setCurrentPharmacistId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [pharmacistIdToDelete, setPharmacistIdToDelete] = useState(null);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const openCreateModal = () => setShowCreateModal(true);
  const [operation, setOperation] = useState(""); // Added state for operation type

  const [selectedPharmacistId, setSelectedPharmacistId] = useState(null);
  const closeCreateModal = () => setShowCreateModal(false);

  const [formData, setFormData] = useState({
    fullName: "",                    // Full Name
    email: "",                       // Email Address
    phoneNumber: "",                 // Phone Number (backend expects "phoneNumber")
    gender: "",                      // Gender (e.g., male, female, other)
    dateOfBirth: "",                 // Date of Birth (should be in a proper date format)
    pharmacyName: "",                // Pharmacy Name
    licenseNumber: "",               // License Number
    pharmacyAddress: "",             // Pharmacy Address
    workingHours: "",                // Working Hours
    servicesOffered: "",             // Services Offered
    profileImage: "",              // Profile Picture (file upload or URL, backend expects "profileImage")
    password: "",                    // Password (for login)
    confirmPassword: "",             // Confirm Password (for matching password)
  });
  const cancelCreateForm = () => {
    closeCreateModal(); // This will close the modal when called
  };

  // Fetch all pharmacists
  const fetchPharmacists = async () => {
    setLoading(true);
    try {
      console.log("📢 Fetching pharmacists...");
      const response = await fetchPharmacistsApi(); // Use pharmacistApi's fetchPharmacists method
      setPharmacists(response);
      setFilteredPharmacists(response);
      console.log("✅ Pharmacists updated in state:", response);
    } catch (err) {
      console.error("❌ Error fetching pharmacists:", err);
      setError(`Error fetching pharmacists: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPharmacists();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredPharmacists(pharmacists);
    } else {
      setFilteredPharmacists(
        pharmacists.filter((pharmacist) =>
          pharmacist.fullName.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }
  }, [searchQuery, pharmacists]);
  
  // Handle create pharmacist
  const handleCreatePharmacist = async (pharmacistData) => {
    console.log(pharmacistData);
    setLoadingCreate(true);
    try {
      const response = await createPharmacistApi(pharmacistData); // Use pharmacistApi's createPharmacist method
      
      console.log("Full Response from registerPharmacist:", response.data);
      console.log("response.status type:", typeof response.status);
      
      if (response.status === 200) {
        console.log("toast");
        toast.success(response.data); 
        await fetchPharmacists(); 
        navigate(-1);
        // Show success toast
        
        // Close the modal after success
        //closeCreateModal(); // Close modal
        setShowCreateModal(false);
        
      } else {
        toast.error(response.data); // Show error toast if not successful
        // Handle error from the API response
      }
    } catch (error) {
      console.error("Error during pharmacist creation:", error);
      toast.error("An error occurred during registration."); // Show error toast
      return { status: 500, data: { message: "An error occurred during registration." } };
    } finally {
      setLoadingCreate(false);  // Reset loading state
    }
  };

  // Handle edit pharmacist click
  const handleEditPharmacistClick = async (pharmacistId) => {
    console.log(pharmacistId);
    try {
      const response = await fetchPharmacistByIdApi(pharmacistId);
      setCurrentPharmacistId(pharmacistId);
      if (response) {
        setEditPharmacist(response);
        console.log("UserId",response);// This sets the pharmacist data correctly
        
        // Setting the formData for edit
        setFormData({
          pharmacistId: response.pharmacistId || "",
          fullName: response.fullName || "",
          email: response.email || "",
          phoneNumber: response.phoneNumber || "",
          gender: response.gender || "",
          dateOfBirth: response.dateOfBirth ? formatDate(response.dateOfBirth) : "",
          pharmacyName: response.pharmacyName || "",
          licenseNumber: response.licenseNumber || "",
          pharmacyAddress: response.pharmacyAddress || "",
          workingHours: response.workingHours || "",
          servicesOffered: response.servicesOffered || "",
          profileImage: response.profileImage || "",
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
      setCurrentPharmacistId(pharmacistId);
    } catch (err) {
      setError(`Error fetching pharmacist details: ${err.message}`);
    }
  };

  // Handle update pharmacist
  const handleUpdatePharmacist = async (updatedData) => {
    console.log("Goood");
    console.log("Goood",updatedData);
    setLoadingUpdate(true);
    try {
        
      await updatePharmacistApi(currentPharmacistId, updatedData); // Use pharmacistApi's updatePharmacist method
      toast.success("Pharmacist updated successfully!");
      fetchPharmacists();
      setShowEditModal(false);
    } catch (err) {
      setError(`Error updating pharmacist: ${err.message}`);
      toast.error(err.message);
    } finally {
      setLoadingUpdate(false);
    }
  };

  // Handle delete pharmacist
  const handleDeleteClick = async (pharmacistId) => {
    console.log("Delete pharmacist");  
    const userIdToDelete = await fetchUserIdByPharmacistId(pharmacistId);
    setSelectedPharmacistId(userIdToDelete); // Store the pharmacistId to delete
    setOperation("delete");          // Set the operation to delete
    setShowConfirmationModal(true);  // Show the confirmation modal
  };

  // Handle delete pharmacist
  const handleDeletePharmacist = async (pharmacistId) => {
    setLoadingDelete(true);
    try {
      const response = await deletePharmacistApi(pharmacistId); // Ensure this function is correct
      console.log(response);
      toast.success("Pharmacist deleted successfully!");
  
      // ✅ Ensure table data is refreshed
      await fetchPharmacists(); // Wait for data refresh before closing modal
  
      // ✅ Close modal & reset state after deletion
      setShowConfirmationModal(false);
      setPharmacistIdToDelete(null);
    } catch (err) {
      console.error("Error deleting pharmacist:", err);
      toast.error("Failed to delete pharmacist.");
    } finally {
      setLoadingDelete(false);
    }
  };

  return {
    pharmacists,
    filteredPharmacists,
    loading,
    loadingCreate,
    loadingUpdate,
    loadingDelete,
    error,
    searchQuery,
    setSearchQuery,
    formData,
    setFormData,
    handleCreatePharmacist,
    handleEditPharmacistClick,
    handleUpdatePharmacist,
    handleDeletePharmacist,
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
    selectedPharmacistId,
    editPharmacist,
    setEditPharmacist,
  };
};

export default usePharmacistManagement;