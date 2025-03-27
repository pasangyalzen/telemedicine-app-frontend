import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../pages/Admin/services/adminApi";
import { fetchDoctors } from "../pages/Admin/services/doctorApi";
import toast from "react-hot-toast";

const useUserManagement = () => {
  const navigate = useNavigate();

  // State variables to manage form input and messages
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "Doctor", // Default role can be Doctor, Patient, Pharmacist, or Admin
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // State for toggling form visibility
  const [showRegisterForm, setShowRegisterForm] = useState(false);

  // Handle Register Button Click
  const handleRegisterClick = () => {
    setShowRegisterForm(true); // Show the registration form
  };

  // Handle form submission
  const handleRegisterUser = async (formData) => {
    try {
      const response = await registerUser(formData); // Call the register function from adminApi
      
      // Check if response is successful
      if (response.status == 200) {
        fetchDoctors();
        console.log("toast");
        toast.success(response.data); 
        return response; // Return the full response here so we can handle it in RegisterUser 
        
      } else {
        toast.error("Registration failed!"); 
        // Handle error from the API response
        return response; // Return error response to handle it in RegisterUser
      }
    } catch (error) {
      toast.error("An error occurred during registration."); 
      return { status: 500, data: { message: "An error occurred during registration." } };
    }
  };

  // handleSubmit that calls handleRegister with formData
  const handleSubmit = async (formData) => {
    await registerUser(formData);
  };

  return {
    formData,
    setFormData,
    errorMessage,
    successMessage,
    showRegisterForm,
    setShowRegisterForm,
    handleRegisterClick, // Expose handleRegisterClick
    handleSubmit,
    handleRegisterUser,
  };
};

export default useUserManagement;