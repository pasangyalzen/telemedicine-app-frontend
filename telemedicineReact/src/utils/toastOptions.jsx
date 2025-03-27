// src/utils/toastOptions.js
const toastOptions = {
  position: "top-left", // Positioning of the toast on the screen
  toastOptions: {
    duration: 4000, // Duration for which the toast will appear
    className: "text-white text-base px-5 py-3 rounded-lg shadow-lg", // Base styling for all toasts

    success: {
      icon: "✅", // Icon for success toasts
      className: "bg-green-500 !important", // Background color for success toast
    },

    error: {
      icon: "❌", // Icon for error toasts
      className: "bg-red-500 !important", // Background color for error toast
    },
  },
};

export default toastOptions;