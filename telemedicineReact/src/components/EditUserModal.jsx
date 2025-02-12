import { useState } from "react";

const EditUserModal = ({ user, onClose, onSave }) => {
  const [formData, setFormData] = useState(user);

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = () => {
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-700 bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-lg w-1/3">
        <h2 className="text-xl font-bold mb-4">Edit User</h2>

        <label className="block">Name:</label>
        <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full border p-2 rounded mb-4" />

        <label className="block">Email:</label>
        <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full border p-2 rounded mb-4" />

        <label className="block">Role:</label>
        <select name="role" value={formData.role} onChange={handleChange} className="w-full border p-2 rounded mb-4">
          <option value="Doctor">Doctor</option>
          <option value="Patient">Patient</option>
          <option value="Pharmacist">Pharmacist</option>
          <option value="Admin">Admin</option>
        </select>

        <div className="flex justify-end space-x-2">
          <button onClick={onClose} className="bg-gray-500 text-white px-4 py-2 rounded">Cancel</button>
          <button onClick={handleSubmit} className="bg-blue-500 text-white px-4 py-2 rounded">Save</button>
        </div>
      </div>
    </div>
  );
};

export default EditUserModal;
