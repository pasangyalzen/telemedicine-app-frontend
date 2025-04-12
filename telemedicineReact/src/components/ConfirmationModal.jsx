import React from "react";
import { AlertTriangle, X } from "lucide-react";

export default function ConfirmationModal({
  message,
  actionLabel,
  onConfirm,
  onCancel,
}) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md transform transition-all duration-300 scale-100">
        {/* Header with icon */}
        <div className="p-6 pb-0">
          <div className="flex justify-center">
            <div className="bg-red-50 p-3 rounded-full">
              <AlertTriangle size={28} className="text-red-500" />
            </div>
          </div>
        </div>

        {/* Modal Message */}
        <div className="px-6 pt-4 pb-6">
          <h2 className="text-xl font-semibold text-gray-800 text-center mb-2">{message}</h2>
          <p className="text-gray-500 text-center text-sm mb-6">
            This action cannot be undone. Please confirm your choice.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {/* Cancel Button */}
            <button
              onClick={onCancel}
              className="order-2 sm:order-1 px-5 py-2.5 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-700 font-medium transition-colors duration-200 flex-1"
            >
              Cancel
            </button>

            {/* Confirm Button */}
            <button
              onClick={onConfirm}
              className="order-1 sm:order-2 px-5 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition-colors duration-200 flex-1 flex items-center justify-center"
            >
              {actionLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}