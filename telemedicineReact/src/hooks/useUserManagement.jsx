import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../pages/Admin/services/adminApi";

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
      if (response?.status === 200) {
        return response; // Return the full response here so we can handle it in RegisterUser
      } else {
        // Handle error from the API response
        return response; // Return error response to handle it in RegisterUser
      }
    } catch (error) {
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