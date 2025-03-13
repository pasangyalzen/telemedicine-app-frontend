// src/pages/ActionConfirmationPage.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ConfirmationModal from "../components/ConfirmationModal";
import { PATHS } from "../constants/path";

export default function ActionConfirmationPage() {
  const [showModal, setShowModal] = useState(false);
  const [action, setAction] = useState("");
  const navigate = useNavigate(); // Hook to navigate between pages

  const handleAction = (actionType) => {
    setAction(actionType);
    setShowModal(true);
  };

  const handleConfirm = () => {
    // Logic for performing the action (e.g., delete, update, logout)
    console.log(`${action} confirmed`);

    // Redirect based on the action
    if (action === "Logout") {
      // If the action is Logout, redirect to the login page
      navigate(PATHS.LOGIN);
    } else {
      // If it's Delete or Update, just go back to the current page
      navigate(0); // This reloads the current page
    }

    setShowModal(false); // Close the modal after action
  };

  const handleCancel = () => {
    console.log(`${action} canceled`);
    setShowModal(false); // Close the modal on cancel
    navigate(0); // Go back to the current page
  };

  return (
    <div>
      <h1>Welcome to the Page</h1>

      {/* Buttons that trigger the modal */}
      <div className="flex gap-4">
        <button onClick={() => handleAction("Delete")} className="btn">
          Delete
        </button>
        <button onClick={() => handleAction("Update")} className="btn">
          Update
        </button>
        <button onClick={() => handleAction("Logout")} className="btn">
          Logout
        </button>
      </div>

      {/* Show Confirmation Modal if required */}
      {showModal && (
        <ConfirmationModal
          message={`Are you sure you want to ${action.toLowerCase()}?`}
          actionLabel={action}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
}