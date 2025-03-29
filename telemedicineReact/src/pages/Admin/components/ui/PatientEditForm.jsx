import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import usePatientManagement from "../../../../hooks/usePatientManagement";

const PatientEditForm = ({ formData = {},patientData,setFormData}) => {
  console.log(patientData);
  // const [formData, setFormData] = useState({
  //   fullName: "",
  //   phoneNumber: "",
  //   gender: "Female",
  //   dateOfBirth: "2025-03-28T20:50:45.475Z",
  //   bloodGroup: "",
  //   address: "",
  //   emergencyContactName: "",
  //   emergencyContactNumber: "",
  //   healthInsuranceProvider: "",
  //   medicalHistory: "",
  //   profileImage: "",
  //   maritalStatus: "",
  //   allergies: "",
  //   chronicDiseases: "",
  //   medications: "",
  //   status: true,
  // });

  const [errors, setErrors] = useState({});
  const { handleUpdatePatient, editPatient } = usePatientManagement();
  console.log("I am also here",editPatient);

  // Update formData whenever patientData changes
  useEffect(() => {
    console.log("Now here", editPatient); // Check if editPatient is updating
    if (editPatient) {
      setFormData({
        fullName: editPatient.fullName || "",
        phoneNumber: editPatient.phoneNumber || "",
        gender: editPatient.gender || "Female",
        dateOfBirth: editPatient.dateOfBirth || "2025-03-28T20:50:45.475Z",
        bloodGroup: editPatient.bloodGroup || "",
        address: editPatient.address || "",
        emergencyContactName: editPatient.emergencyContactName || "",
        emergencyContactNumber: editPatient.emergencyContactNumber || "",
        healthInsuranceProvider: editPatient.healthInsuranceProvider || "",
        medicalHistory: editPatient.medicalHistory || "",
        profileImage: editPatient.profileImage || "",
        maritalStatus: editPatient.maritalStatus || "",
        allergies: editPatient.allergies || "",
        chronicDiseases: editPatient.chronicDiseases || "",
        medications: editPatient.medications || "",
        status: editPatient.status ?? true, // Ensures boolean value is properly set
      });
    }
}, [editPatient]); // Triggers when editPatient updates // Only update formData when patientData changes

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  
    // Handle form submission logic here
    // You can call your API or update state to save patient data
    toast.success("Patient updated successfully!");
    handleUpdatePatient(formData); // Pass the updated formData back for processing
  };

  // Form fields configuration
  const formFields = [
    { name: "fullName", label: "Full Name", type: "text", required: true },
    { name: "phoneNumber", label: "Phone Number", type: "text", required: true },
    { name: "gender", label: "Gender", type: "select", options: ["Female", "Male", "Other"], required: true },
    { name: "dateOfBirth", label: "Date of Birth", type: "date", required: true },
    { name: "bloodGroup", label: "Blood Group", type: "text" },
    { name: "address", label: "Address", type: "text" },
    { name: "emergencyContactName", label: "Emergency Contact Name", type: "text" },
    { name: "emergencyContactNumber", label: "Emergency Contact Number", type: "text" },
    { name: "healthInsuranceProvider", label: "Health Insurance Provider", type: "text" },
    { name: "medicalHistory", label: "Medical History", type: "textarea" },
    { name: "profileImage", label: "Profile Image URL", type: "url", required: true },
    { name: "maritalStatus", label: "Marital Status", type: "text" },
    { name: "allergies", label: "Allergies", type: "text" },
    { name: "chronicDiseases", label: "Chronic Diseases", type: "text" },
    { name: "medications", label: "Medications", type: "text" },
  ];

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-lg overflow-hidden">
      <h2 className="text-2xl font-semibold text-teal-800 text-center mb-6">Update Patient</h2>

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
                        onChange={handleChange}
                        className="p-3 border rounded-lg w-full text-white focus:ring-2 focus:ring-teal-600 focus:outline-none"
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
                        onChange={handleChange}
                        className="p-3 border rounded-lg w-full text-gray-800 focus:ring-2 focus:ring-teal-600 focus:outline-none"
                        placeholder={`Enter ${field.label}`}
                      />
                    ) : (
                      <input
                        id={field.name}
                        type={field.type}
                        name={field.name}
                        value={formData[field.name]}
                        onChange={handleChange}
                        required={field.required}
                        className="p-3 border rounded-lg w-full text-white focus:ring-2 focus:ring-teal-600 focus:outline-none"
                        placeholder={`Enter ${field.label}`}
                      />
                    )}
                  </td>
                </tr>
              ))}
              <tr>
                <td colSpan="2" className="py-4 px-4 text-center">
                  <button
                    type="submit"
                    className="bg-teal-600 text-white py-2 px-6 rounded-lg hover:bg-teal-700"
                  >
                    Update Patient
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

export default PatientEditForm;