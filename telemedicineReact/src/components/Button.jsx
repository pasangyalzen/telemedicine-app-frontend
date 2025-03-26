import React from "react";
import { FaArrowRight } from "react-icons/fa"; // Example icon, but it can be any icon passed as a prop

const Button = ({
  children,
  onClick,
  variant = "primary",  // Button variant (primary, secondary, etc.)
  icon: Icon,           // Icon to be passed and rendered in the button (if any)
  className = "",       // Custom additional className for styling
  type = "button",      // Default type is "button"
  ...props              // Any additional props passed
}) => {
  // Base styles for the button
  const baseClasses =
    "font-sans font-semibold px-6 py-3 rounded-md transition-colors relative group flex items-center gap-2";

  // Define styles for different button variants
  const variantClasses = {
    primary: "bg-[#7FD1C7] text-[#012f33] hover:bg-opacity-90",
    secondary:
      "border border-[#7FD1C7] bg-transparent text-[#7FD1C7] hover:bg-[#7FD1C7] hover:text-primary-dark",
    danger: "bg-red-600 text-white hover:bg-red-700",
    success: "bg-green-600 text-white hover:bg-green-700",
    outline: "border-2 border-[#7FD1C7] text-[#7FD1C7] hover:bg-[#7FD1C7] hover:text-white",
  };

  return (
    <button
      onClick={onClick}
      type={type}  // Ensure it uses the type passed (default is "button")
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {Icon && <Icon className="w-5 h-5" />}  {/* Render the icon if passed */}
      <span className="transition-all duration-300 group-hover:mr-3">
        {children}
      </span>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="4"
        stroke="currentColor"
        className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-all duration-300"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
      </svg>
    </button>
  );
};

export default Button;