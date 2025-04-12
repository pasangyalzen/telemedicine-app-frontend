import { FaEdit, FaTrashAlt } from "react-icons/fa";
import usePharmacistManagement from "../../../../hooks/usePharmacistManagement";

const PharmacistTable = ({ pharmacists, handleEditPharmacistClick, handleDeleteClick }) => {
  return (
    <div className="overflow-hidden rounded-xl shadow-md">
      <table className="min-w-full divide-y divide-teal-200">
        <thead className="bg-gradient-to-r from-teal-600 to-teal-700">
          <tr>
            <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
              Name
            </th>
            <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
              Gender
            </th>
            <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
              Phone
            </th>
            <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
              Pharmacy
            </th>
            <th className="px-6 py-4 text-center text-xs font-bold text-white uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-teal-100">
          {pharmacists.length === 0 ? (
            <tr>
              <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                <div className="flex flex-col items-center">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-12 w-12 text-teal-300 mb-4" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" 
                    />
                  </svg>
                  <p className="text-lg font-medium">No pharmacists found</p>
                  <p className="text-sm mt-1">Try adjusting your search or register a new pharmacist</p>
                </div>
              </td>
            </tr>
          ) : (
            pharmacists.map((pharmacist) => (
              <tr 
                key={pharmacist.pharmacistId} 
                className="hover:bg-teal-50 transition-colors duration-150 ease-in-out"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="font-medium text-gray-800">{pharmacist.fullName}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-3 py-1 inline-flex text-sm rounded-full ${
                    pharmacist.gender === 'Male' 
                      ? 'bg-blue-100 text-blue-700' 
                      : pharmacist.gender === 'Female'
                        ? 'bg-pink-100 text-pink-700'
                        : 'bg-purple-100 text-purple-700'
                  }`}>
                    {pharmacist.gender}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                  <a href={`tel:${pharmacist.phoneNumber}`} className="hover:text-teal-600">
                    {pharmacist.phoneNumber}
                  </a>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-3 py-1 inline-flex text-sm bg-teal-100 text-teal-700 rounded-full">
                    {pharmacist.pharmacyName}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex justify-center gap-3">
                    <button
                      className="flex items-center px-3 py-2 text-sm font-medium rounded-lg text-teal-700 bg-teal-50 hover:bg-teal-100 border border-teal-200 transition-colors duration-150"
                      onClick={() => handleEditPharmacistClick(pharmacist.pharmacistId)}
                      aria-label="Edit pharmacist"
                    >
                      <FaEdit size={16} className="mr-2" />
                      Edit
                    </button>
                    <button
                      className="flex items-center px-3 py-2 text-sm font-medium rounded-lg text-white bg-red-500 hover:bg-red-600 transition-colors duration-150"
                      onClick={() => handleDeleteClick(pharmacist.pharmacistId)}
                      aria-label="Delete pharmacist"
                    >
                      <FaTrashAlt size={16} className="mr-2" />
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default PharmacistTable;