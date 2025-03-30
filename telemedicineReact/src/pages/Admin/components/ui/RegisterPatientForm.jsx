import React, { useState } from "react";
import toast from "react-hot-toast";
import usePatientManagement from "../../../../hooks/usePatientManagement";
import { useEffect } from "react";

const RegisterPatientForm = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
    gender: "",
    dateOfBirth: "",
    bloodGroup: "",
    address: "",
    emergencyContactName: "",
    emergencyContactNumber: "",
    healthInsuranceProvider: "",
    medicalHistory: "",
    profileImage: "",
    maritalStatus: "",
    allergies: "",
    chronicDiseases: "",
    medications: "",
  });
  const {handleCreatePatient, cancelCreateForm, setShowCreateModal,showCreateModal,closeCreateModal} = usePatientManagement();
  const [errors, setErrors] = useState({});

  // Form field configuration
  const formFields = [
    { label: "Full Name", name: "fullName", type: "text", required: true },
    { label: "Email", name: "email", type: "email", required: true },
    { label: "Password", name: "password", type: "password", required: true },
    { label: "Confirm Password", name: "confirmPassword", type: "password", required: true },
    { label: "Phone Number", name: "phoneNumber", type: "text", required: true },
    { label: "Gender", name: "gender", type: "select", options: ["Male", "Female", "Other"], required: true },
    { label: "Date of Birth", name: "dateOfBirth", type: "date", required: true },
    { label: "Blood Group", name: "bloodGroup", type: "text" },
    { label: "Address", name: "address", type: "text" },
    { label: "Emergency Contact Name", name: "emergencyContactName", type: "text" },
    { label: "Emergency Contact Number", name: "emergencyContactNumber", type: "text" },
    { label: "Health Insurance Provider", name: "healthInsuranceProvider", type: "text" },
    { label: "Medical History", name: "medicalHistory", type: "textarea" },
    { label: "Profile Image URL", name: "profileImage", type: "url", required: true },
    { label: "Marital Status", name: "maritalStatus", type: "text" },
    { label: "Allergies", name: "allergies", type: "text" },
    { label: "Chronic Diseases", name: "chronicDiseases", type: "text" },
    { label: "Medications", name: "medications", type: "text" },
  ];
  
  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  useEffect(() => {
    console.log("Modal state has changed:", showCreateModal);
  }, [showCreateModal]); // This will run every time showCreateModal changes

  // Validate the form before submitting
  const validateForm = () => {
    const newErrors = {};

    formFields.forEach((field) => {
      if (field.required && !formData[field.name]) {
        newErrors[field.name] = `${field.label} is required.`;
      }

      if (field.name === "confirmPassword" && formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match.";
      }

      if (field.name === "dateOfBirth" && formData.dateOfBirth && new Date(formData.dateOfBirth) > new Date()) {
        newErrors.dateOfBirth = "Date of birth cannot be in the future.";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
    };

    // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
  
    console.log("Hello");
  
    if (!validateForm()) return;
  
    try {
      const response = await handleCreatePatient(formData); // Pass only formData to handleCreatePatient
      if (response?.success) {
        toast.success(response.message);
        var poke = setShowCreateModal(false);
        console.log(showCreateModal);
        return response;
    } }catch (error) {
      console.error("Error during patient creation:", error);
      toast.error("Error during patient creation: " + error.message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-lg overflow-hidden">
      <h2 className="text-2xl font-semibold text-teal-800 text-center mb-6">Register a New User</h2>

      {/* Scrollable form container */}
      <div className="max-h-[600px] overflow-y-auto p-4 border border-gray-300 rounded-lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <table className="table-auto w-full text-left">
            <tbody>
              {formFields.map((field, index) => (
                <tr key={index}>
                  <td className="py-2 px-4 font-medium text-gray-700">{field.label}</td>
                  <td className="py-2 px-4">
                    {field.type === "select" ? (
                      <select
                        id={field.name}
                        name={field.name}
                        value={formData[field.name]}
                        onChange={handleInputChange}
                        className="p-3 border rounded-lg w-full text-gray-800 focus:ring-2 focus:ring-teal-600 focus:outline-none"
                      >
                        <option value="">Select {field.label}</option>
                        {field.options.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    ) : field.type === "textarea" ? (
                      <textarea
                        id={field.name}
                        name={field.name}
                        value={formData[field.name]}
                        onChange={handleInputChange}
                        className="p-3 border rounded-lg w-full text-gray-800 bg-white focus:ring-2 focus:ring-teal-600 focus:outline-none"
                        placeholder={`Enter ${field.label}`}
                      />
                    ) : (
                      <input
                        id={field.name}
                        type={field.type}
                        name={field.name}
                        value={formData[field.name]}
                        onChange={handleInputChange}
                        required={field.required}
                        className="p-3 border rounded-lg w-full text-gray-800 focus:ring-2 focus:ring-teal-600 focus:outline-none bg-white"
                        placeholder={`Enter ${field.label}`}
                      />
                    )}
                    {errors[field.name] && <span className="text-red-500 text-sm mt-1">{errors[field.name]}</span>}
                  </td>
                </tr>
              ))}
              <tr>
                <td colSpan="2" className="py-4 px-4 text-center">
                  <button
                    type="submit"
                    className="bg-teal-600 text-white py-2 px-6 rounded-lg hover:bg-teal-700"
                  >
                    Register Patient
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </form>
      </div>
    </div>
  );
};

export default RegisterPatientForm;