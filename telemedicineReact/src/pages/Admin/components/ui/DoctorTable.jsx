import { FaEdit, FaTrashAlt } from "react-icons/fa";

const DoctorTable = ({ doctors, handleEditClick, handleDeleteClick }) => {
  return (
    <div className="overflow-hidden rounded-xl shadow-md">
      <table className="min-w-full divide-y divide-teal-200">
        <thead className="bg-gradient-to-r from-teal-600 to-teal-700">
          <tr>
            <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
              Name
            </th>
            <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
              Specialization
            </th>
            <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
              Phone
            </th>
            <th className="px-6 py-4 text-center text-xs font-bold text-white uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-teal-100">
          {doctors.map((doctor) => (
            <tr 
              key={doctor.doctorId} 
              className="hover:bg-teal-50 transition-colors duration-150 ease-in-out"
            >
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="font-medium text-gray-800">{doctor.fullName}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="px-3 py-1 inline-flex text-sm text-teal-700 bg-teal-100 rounded-full">
                  {doctor.specialization}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                {doctor.phoneNumber}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-center">
                <div className="flex justify-center gap-3">
                  <button
                    className="flex items-center px-3 py-2 text-sm font-medium rounded-lg text-teal-700 bg-teal-50 hover:bg-teal-100 border border-teal-200 transition-colors duration-150"
                    onClick={() => handleEditClick(doctor.doctorId)}
                  >
                    <FaEdit size={16} className="mr-2" />
                    Edit
                  </button>
                  <button
                    className="flex items-center px-3 py-2 text-sm font-medium rounded-lg text-white bg-red-500 hover:bg-red-600 transition-colors duration-150"
                    onClick={() => handleDeleteClick(doctor.doctorId)}
                  >
                    <FaTrashAlt size={16} className="mr-2" />
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
          {doctors.length === 0 && (
            <tr>
              <td colSpan="4" className="px-6 py-12 text-center text-gray-500">
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
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
                    />
                  </svg>
                  <p className="text-lg">No doctors found</p>
                  <p className="text-sm mt-1">Try adjusting your search or register a new doctor</p>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DoctorTable;