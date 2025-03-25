import React from 'react';

const SortingDropdown = ({ sortColumn, setSortColumn, sortOrder, setSortOrder }) => {
  return (
    <div className="flex gap-2 w-full">
      <select
        value={sortColumn}
        onChange={(e) => setSortColumn(e.target.value)}
        className="p-3 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-teal-500"
        style={{ height: '40px' }} // Adjust height to make it bigger
      >
        <option value="FullName">Sort by Name</option>
        <option value="Specialization">Sort by Specialization</option>
        <option value="CreatedAt">Sort by Date</option>
      </select>

      <select
        value={sortOrder}
        onChange={(e) => setSortOrder(e.target.value)}
        className="p-3 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-teal-500"
        style={{ height: '40px' }} // Adjust height to make it bigger
      >
        <option value="ASC">Ascending</option>
        <option value="DESC">Descending</option>
      </select>
    </div>
  );
};

export default SortingDropdown;