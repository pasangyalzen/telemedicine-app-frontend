import React, { useState } from 'react';
import useUserManagement from '../hooks/useUserManagement'; // Make sure the hook is imported correctly
import toast from 'react-hot-toast';

const RegisterUser = ({ setShowRegisterForm }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState(''); // New state for confirm password
  const [role, setRole] = useState('Doctor'); // Default role set to Doctor
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Access the registration functionality from useUserManagement hook
  const { handleRegisterUser } = useUserManagement(); // Assuming you have a `handleRegisterUser` function in the hook

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Validate that passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setSuccessMessage("");
      return;
    }
  
    const model = { email, password, confirmPassword, role };
  
    try {
      const response = await handleRegisterUser(model); // Call the function from the hook
      console.log(response.message); // Log the response message for debugging

      // Check for successful registration (success = true in response)
      if (response?.success) { // Use response.success to check success
        setSuccessMessage(response.message); // Use the message from the response
        //toast.success(response.message);
        setError('');
        
        // Clear form fields after success
        setEmail('');
        setPassword('');
        setConfirmPassword(''); // Clear confirm password
      } else {
        // If registration is not successful, use the message from response
        setError(response.message); // Show the error message from response
        setSuccessMessage('');
      }
    } catch (err) {
      // Handle any errors that occur during the registration process
      setError('An error occurred during registration. Please try again.');
      setSuccessMessage('');
      console.log(err);
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white p-8 rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold text-teal-800 text-center mb-6">Register a New User</h2>
      
      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input 
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-2 border border-gray-300 rounded bg-white text-black"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Password</label>
          <input 
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-2 border border-gray-300 rounded bg-white text-black"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
          <input 
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="w-full p-2 border border-gray-300 rounded bg-white text-black"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Role</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="mt-2 p-3 border rounded-lg w-full text-gray-800 focus:ring-2 focus:ring-teal-600 focus:outline-none"
          >
            <option value="Doctor">Doctor</option>
            <option value="Patient">Patient</option>
            <option value="Admin">Admin</option>
            <option value="Pharmacist">Pharmacist</option>
          </select>
        </div>

        {/* Register Button */}
        <button 
          type="submit" 
          className="w-full px-6 py-3 text-lg text-white font-semibold rounded-lg shadow-md bg-teal-800 hover:bg-teal-600 transition-all"
        >
          Register
        </button>
      </form>

      {/* Display error or success message */}
      {error && <div className="mt-4 text-red-600 text-center">{error}</div>}
      {successMessage && <div className="mt-4 text-green-600 text-center">{successMessage}</div>}

      {/* Cancel Button */}
      <button
        onClick={() => setShowRegisterForm(false)} // Close form when clicked
        className="mt-4 w-full px-6 py-3 text-lg text-white font-semibold rounded-lg shadow-md bg-gray-400 hover:bg-gray-300 transition-all"
      >
        Cancel
      </button>
    </div>
  );
};

export default RegisterUser;