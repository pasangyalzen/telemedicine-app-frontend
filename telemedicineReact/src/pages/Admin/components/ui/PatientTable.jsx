import { FaEdit, FaTrashAlt } from "react-icons/fa";
import usePatientManagement from "../../../../hooks/usePatientManagement";

const PatientTable = ({ patients, handleEditPatientClick, handleDeleteClick }) => {
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
            <th className="px-6 py-4 text-center text-xs font-bold text-white uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-teal-100">
          {patients.length === 0 ? (
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
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" 
                    />
                  </svg>
                  <p className="text-lg font-medium">No patients found</p>
                  <p className="text-sm mt-1">Try adjusting your search or register a new patient</p>
                </div>
              </td>
            </tr>
          ) : (
            patients.map((patient) => (
              <tr 
                key={patient.patientId} 
                className="hover:bg-teal-50 transition-colors duration-150 ease-in-out"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="font-medium text-gray-800">{patient.fullName}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-3 py-1 inline-flex text-sm rounded-full ${
                    patient.gender === 'Male' 
                      ? 'bg-blue-100 text-gray-600' 
                      : patient.gender === 'Female'
                        ? 'bg-pink-100 text-gray-700'
                        : 'bg-purple-100 text-gray-700'
                  }`}>
                    {patient.gender}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                  <a href={`tel:${patient.phoneNumber}`} className="hover:text-teal-600">
                    {patient.phoneNumber}
                  </a>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex justify-center gap-3">
                    <button
                      className="flex items-center px-3 py-2 text-sm font-medium rounded-lg text-teal-700 bg-teal-50 hover:bg-teal-100 border border-teal-200 transition-colors duration-150"
                      onClick={() => handleEditPatientClick(patient.patientId)}
                      aria-label="Edit patient"
                    >
                      <FaEdit size={16} className="mr-2" />
                      Edit
                    </button>
                    <button
                      className="flex items-center px-3 py-2 text-sm font-medium rounded-lg text-white bg-red-500 hover:bg-red-600 transition-colors duration-150"
                      onClick={() => handleDeleteClick(patient.patientId)}
                      aria-label="Delete patient"
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

export default PatientTable;