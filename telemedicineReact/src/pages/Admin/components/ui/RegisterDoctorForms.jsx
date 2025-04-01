import React, { useState } from 'react';
import useUserManagement from '../../../../hooks/useUserManagement'; // Ensure the hook is imported correctly
import toast from 'react-hot-toast';

const RegisterDoctorForms = ({ setShowRegisterForm }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    phoneNumber: '',
    gender: '',
    dateOfBirth: '',
    licenseNumber: '',
    medicalCollege: '',
    specialization: '',
    yearsOfExperience: '',
    clinicName: '',
    clinicAddress: '',
    consultationFee: ''
  });

  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const { handleRegisterUser } = useUserManagement();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      setSuccessMessage("");
      return;
    }

    try {
      const response = await handleRegisterUser({ ...formData, role: 'Doctor' });
      if (response?.success) {
        toast.success(response.message); // Show success message
        setShowRegisterForm(false); // Close the form after success
        setSuccessMessage(response.message);
        setError('');
        setFormData({
          email: '',
          password: '',
          confirmPassword: '',
          fullName: '',
          phoneNumber: '',
          gender: '',
          dateOfBirth: '',
          licenseNumber: '',
          medicalCollege: '',
          specialization: '',
          yearsOfExperience: '',
          clinicName: '',
          clinicAddress: '',
          consultationFee: ''
        });
      } else {
        setError(response.message);
        setSuccessMessage('');
      }
    } catch (err) {
      setError('An error occurred during registration. Please try again.');
      setSuccessMessage('');
      console.log(err);
    }
  };

  const formFields = [
    { label: 'Full Name', name: 'fullName', type: 'text', placeholder: 'Full Name' },
    { label: 'Email', name: 'email', type: 'email', placeholder: 'Email' },
    { label: 'Password', name: 'password', type: 'password', placeholder: 'Password' },
    { label: 'Confirm Password', name: 'confirmPassword', type: 'password', placeholder: 'Confirm Password' },
    { label: 'Phone Number', name: 'phoneNumber', type: 'text', placeholder: 'Phone Number' },
    { label: 'Gender', name: 'gender', type: 'text', placeholder: 'Gender' },
    { label: 'Date of Birth', name: 'dateOfBirth', type: 'date', placeholder: 'Date of Birth' },
    { label: 'License Number', name: 'licenseNumber', type: 'text', placeholder: 'License Number' },
    { label: 'Medical College', name: 'medicalCollege', type: 'text', placeholder: 'Medical College' },
    { label: 'Specialization', name: 'specialization', type: 'text', placeholder: 'Specialization' },
    { label: 'Years of Experience', name: 'yearsOfExperience', type: 'number', placeholder: 'Years of Experience' },
    { label: 'Clinic Name', name: 'clinicName', type: 'text', placeholder: 'Clinic Name' },
    { label: 'Clinic Address', name: 'clinicAddress', type: 'text', placeholder: 'Clinic Address' },
    { label: 'Consultation Fee', name: 'consultationFee', type: 'number', placeholder: 'Consultation Fee' }
  ];

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-lg overflow-hidden">
      <h2 className="text-2xl font-semibold text-teal-800 text-center mb-6">Register a New Doctor</h2>

      {/* Scrollable form container */}
      <div className="max-h-[600px] overflow-y-auto p-4 border border-gray-300 rounded-lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <table className="table-auto w-full text-left">
            <tbody>
              {formFields.map((field, index) => (
                <tr key={index}>
                  <td className="py-2 px-4 font-medium text-gray-700">{field.label}</td>
                  <td className="py-2 px-4">
                    <input
                      type={field.type}
                      name={field.name}
                      value={formData[field.name]}
                      onChange={handleChange}
                      placeholder={field.placeholder}
                      required
                      className="p-3 border rounded-lg w-full text-gray-800 focus:ring-2 focus:ring-teal-600 focus:outline-none bg-white"
                     
                    />
                  </td>
                </tr>
              ))}

              {/* Submit Button */}
              <tr>
                <td colSpan="2" className="py-4 px-4 text-center">
                  <button
                    type="submit"
                    className="bg-teal-600 text-white py-2 px-6 rounded-lg hover:bg-teal-700"
                  >
                    Register Doctor
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

export default RegisterDoctorForms;
