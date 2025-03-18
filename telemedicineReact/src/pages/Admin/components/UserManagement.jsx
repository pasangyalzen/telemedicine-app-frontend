import React, { useState } from "react";
import Button from "../../../components/Button"; // Assuming the Button component is available
import { FaEdit, FaTrashAlt, FaPlusCircle } from "react-icons/fa"; // Icons for actions

const UserManagement = () => {
  // Example data: list of users
  const [users, setUsers] = useState([
    { id: 1, username: "alice123", role: "Doctor", email: "alice@med.com" },
    { id: 2, username: "bob456", role: "Patient", email: "bob@med.com" },
    { id: 3, username: "charlie789", role: "Pharmacist", email: "charlie@med.com" },
  ]);

  // Function to handle adding a new user (simplified for demonstration)
  const handleAddUser = () => {
    // Logic to add a user
    console.log("Adding new user");
  };

  // Function to handle editing a user
  const handleEditUser = (id) => {
    // Logic to edit user with specific id
    console.log("Editing user with id:", id);
  };

  // Function to handle deleting a user
  const handleDeleteUser = (id) => {
    setUsers(users.filter(user => user.id !== id)); // Remove user from list
    console.log("Deleted user with id:", id);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-teal-500 to-teal-700 text-white p-6 flex justify-between items-center">
        <h2 className="text-3xl font-bold">User Management</h2>
        <Button onClick={handleAddUser} variant="primary" icon={FaPlusCircle}>
          Add New User
        </Button>
      </div>

      {/* User List Table Section */}
      <div className="container mx-auto p-6">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto text-left">
              <thead className="bg-gray-200">
                <tr>
                  <th className="py-3 px-6 text-sm font-medium text-gray-700">Username</th>
                  <th className="py-3 px-6 text-sm font-medium text-gray-700">Role</th>
                  <th className="py-3 px-6 text-sm font-medium text-gray-700">Email</th>
                  <th className="py-3 px-6 text-sm font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b hover:bg-gray-100">
                    <td className="py-3 px-6 text-sm text-gray-700">{user.username}</td>
                    <td className="py-3 px-6 text-sm text-gray-700">{user.role}</td>
                    <td className="py-3 px-6 text-sm text-gray-700">{user.email}</td>
                    <td className="py-3 px-6 text-sm">
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleEditUser(user.id)}
                          variant="secondary"
                          icon={FaEdit}
                          className="text-teal-600 hover:bg-teal-100"
                        >
                          Edit
                        </Button>
                        <Button
                          onClick={() => handleDeleteUser(user.id)}
                          variant="danger"
                          icon={FaTrashAlt}
                          className="text-red-600 hover:bg-red-100"
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Optional: User Details or Edit Form */}
      {/* You can add a modal or form to edit user details if necessary */}
    </div>
  );
};

export default UserManagement;