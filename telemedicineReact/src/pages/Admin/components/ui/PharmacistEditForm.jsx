import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import usePharmacistManagement from "../../../../hooks/usePharmacistManagement";

const PharmacistEditForm = ({ formData = {}, setFormData, handleUpdatePharmacist, cancelEdit }) => {
  const { setShowEditModal, showEditModal } = usePharmacistManagement();
  const [errors, setErrors] = useState({});
  console.log("adsfdsafdasf",formData);

  const formFields = [
    { label: "Full Name", name: "fullName", type: "text", required: true },
    { label: "Email", name: "email", type: "email", required: true },
    { label: "Phone Number", name: "phoneNumber", type: "text", required: true },
    { label: "Gender", name: "gender", type: "select", options: ["Male", "Female", "Other"], required: true },
    { label: "Date of Birth", name: "dateOfBirth", type: "date", required: true },
    { label: "Pharmacy Name", name: "pharmacyName", type: "text", required: true },
    { label: "License Number", name: "licenseNumber", type: "text", required: true },
    { label: "Pharmacy Address", name: "pharmacyAddress", type: "text", required: true },
    { label: "Working Hours", name: "workingHours", type: "text" },
    { label: "Services Offered", name: "servicesOffered", type: "text" },
    { label: "Profile Image URL", name: "profileImage", type: "url", required: true },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  useEffect(() => {
    console.log("Modal state has changed:", showEditModal);
  }, [showEditModal]);

  const validateForm = () => {
    const newErrors = {};

    formFields.forEach((field) => {
      if (field.required && !formData[field.name]) {
        newErrors[field.name] = `${field.label} is required.`;
      }

      if (field.name === "dateOfBirth" && formData.dateOfBirth && new Date(formData.dateOfBirth) > new Date()) {
        newErrors.dateOfBirth = "Date of birth cannot be in the future.";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    // Check if the form data has changed before submitting
    const hasChanges = Object.keys(formData).some(key => formData[key] !== "");
    if (!hasChanges) {
      toast.warning("No changes detected.");
      return;
    }

    try {
      const response = await handleUpdatePharmacist(formData);
      if (response?.success) {
        toast.success(response.message);
        setShowEditModal(false);
      }
    } catch (error) {
      console.error("Error during pharmacist edit:", error);
      toast.error("Error during pharmacist edit: " + error.message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-lg overflow-hidden">
      <h2 className="text-2xl font-semibold text-teal-800 text-center mb-6">Edit Pharmacist Information</h2>

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
                    Save Changes
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

export default PharmacistEditForm;