import React from "react";
import { FaSearch } from "react-icons/fa"; // Search Icon

const SearchBar = ({ searchQuery, setSearchQuery }) => {
  return (
    <div className="relative w-full">
      <input
        type="text"
        placeholder="Search by name or specialization"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="pl-12 pr-4 border border-gray-400 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-teal-500"
        style={{
          height: "52px", // Increased height for better spacing
          fontSize: "16px", // Larger font for readability
          lineHeight: "28px", // Prevents text cutoff
          paddingTop: "12px", // Balanced top padding
          paddingBottom: "12px", // Balanced bottom padding
          boxSizing: "border-box", // Ensures proper sizing
        }}
      />
      <FaSearch
        className="absolute left-4 text-gray-500"
        style={{ top: "50%", transform: "translateY(-50%)", fontSize: "18px" }} // Properly centers the icon
      />
    </div>
  );
};

export default SearchBar;