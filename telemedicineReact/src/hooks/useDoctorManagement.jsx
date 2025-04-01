import { useState, useEffect } from "react";
import { fetchDoctors, fetchDoctorById, updateDoctor, deleteDoctor, fetchUserIdByDoctorId } from "../pages/Admin/services/doctorApi";

const useDoctorManagement = (searchQuery, sortColumn, sortOrder) => {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [editDoctor, setEditDoctor] = useState(null);
  const [userIdToDelete, setUserIdToDelete] = useState(null); // Ensure we track the userId for deletion
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState(""); // State to store success messages
  const [errorMessage, setErrorMessage] = useState('');
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    gender: "",
    dateOfBirth: "",
    licenseNumber: "",
    medicalCollege: "",
    specialization: "",
    yearsOfExperience: 0,
    clinicName: "",
    clinicAddress: "",
    consultationFee: 0,
    updatedAt: "",
  });

  // Fetch doctors
  useEffect(() => {
    const loadDoctors = async () => {
      try {
        const data = await fetchDoctors(0, 10, searchQuery, sortColumn, sortOrder); // Pagination added
        setDoctors(data);
        setFilteredDoctors(data);
      } catch (error) {
        console.error("Error loading doctors:", error);
      }
    };
    loadDoctors();
  }, [searchQuery, sortColumn, sortOrder]);

  // Edit doctor functionality
  const handleEditClick = async (doctorId) => {
    try {
      const doctor = await fetchDoctorById(doctorId);
      console.log(doctor.email);
      setEditDoctor(doctor);
      setFormData({
        doctorId: doctor.doctorId || "",
        fullName: doctor.fullName || "",
        email: doctor.email || "",
        phoneNumber: doctor.phoneNumber || "",
        gender: doctor.gender || "",
        dateOfBirth: doctor.dateOfBirth || "",
        licenseNumber: doctor.licenseNumber || "",
        medicalCollege: doctor.medicalCollege || "",
        specialization: doctor.specialization || "",
        yearsOfExperience: doctor.yearsOfExperience || 0,
        clinicName: doctor.clinicName || "",
        clinicAddress: doctor.clinicAddress || "",
        consultationFee: doctor.consultationFee || 0,
        updatedAt: doctor.updatedAt || "",
      });
    } catch (error) {
      console.error("Error fetching doctor details:", error);
    }
  };

  // Update doctor functionality
  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editDoctor) return;

    try {
      const updatedDoctorData = {
        ...formData, // Spread the formData, making sure it includes all fields
        dateOfBirth: formData.dateOfBirth, // Ensure correct date format
      };

      // Call updateDoctor API with the updatedDoctorData
      const response = await updateDoctor(editDoctor.doctorId, updatedDoctorData);

      if (response && response.message === "Doctor updated successfully.") {
        setDoctors(doctors.map((d) => (d.doctorId === editDoctor.doctorId ? { ...d, ...formData } : d)));
        setFilteredDoctors(filteredDoctors.map((d) => (d.doctorId === editDoctor.doctorId ? { ...d, ...formData } : d)));
        setEditDoctor(null); // Close the edit form after updating
        setSuccessMessage("Doctor updated successfully!"); // Set success message
        setTimeout(() => setSuccessMessage(""), 5000); // Clear message after 5 seconds
        navigate(-1);
      } else {
        console.error("Error updating doctor:", response ? response.message : "Unknown error");
      }
    } catch (error) {
      console.error("Error updating doctor:", error);
    }
  };

  // Delete doctor functionality
  const handleDeleteClick = async (doctorId) => {
    try {
      const userId = await fetchUserIdByDoctorId(doctorId);
      setUserIdToDelete(userId);
      console.log("fdfsadsfd",userId);
      setShowDeleteModal(true);
      
    } catch (error) {
      console.error("Error fetching userId for doctor:", error);
    }
  };

  // Confirm deletion
  const handleDeleteDoctor = async (userIdToDelete) => {
    console.log("ID",userIdToDelete);
    try {
      const responseMessage = await deleteDoctor(userIdToDelete); // Call deleteDoctor
      setSuccessMessage(responseMessage); // Set success message if deletion is successful
      const data = await fetchDoctors(); // Call the fetchDoctors function you defined
      setDoctors(data);
      setFilteredDoctors(data);
      setErrorMessage(""); // Clear error message in case of success
    } catch (error) {
      setErrorMessage(error.message); // Set error message if deletion fails
      setSuccessMessage(""); // Clear success message in case of error
      console.log(error);
    }
  };
  return {
    doctors,
    filteredDoctors,
    editDoctor,
    setEditDoctor,
    formData,
    handleEditClick,
    handleUpdate,
    handleDeleteClick,
    handleDeleteDoctor,
    setFormData,
    setUserIdToDelete, // Return the setter for userId to delete
    setShowDeleteModal,
    showDeleteModal,
    successMessage,
    setSuccessMessage, // Return success message
    errorMessage,  // Return errorMessage state
    setErrorMessage,
    userIdToDelete,
  };
};

export default useDoctorManagement;