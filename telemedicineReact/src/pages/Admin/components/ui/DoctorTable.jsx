import { FaEdit, FaTrashAlt } from "react-icons/fa";

const DoctorTable = ({ doctors, handleEditClick, handleDeleteClick }) => {
  return (
    <div className="overflow-x-auto shadow-lg rounded-lg bg-white">
      <table className="min-w-full table-auto text-left border-separate border-spacing-0">
        <thead className="bg-teal-600 text-white">
          <tr>
            <th className="p-4 border border-gray-300 text-sm font-semibold">Name</th>
            <th className="p-4 border border-gray-300 text-sm font-semibold">Specialization</th>
            <th className="p-4 border border-gray-300 text-sm font-semibold">Phone</th>
            <th className="p-4 border border-gray-300 text-sm font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody className="text-gray-800">
          {doctors.map((doctor) => (
            <tr key={doctor.doctorId} className="border-b hover:bg-gray-50">
              <td className="p-4 border border-gray-300">{doctor.fullName}</td>
              <td className="p-4 border border-gray-300">{doctor.specialization}</td>
              <td className="p-4 border border-gray-300">{doctor.phoneNumber}</td>
              <td className="p-4 border border-gray-300 text-center">
                <div className="flex justify-center gap-4">
                  {/* Edit Button */}
                  <button
                    className=".flex items-center text-teal-600 border-teal-600 bg-white hover:bg-teal-100"
                    onClick={() => handleEditClick(doctor.doctorId)}
                  >
                    <FaEdit size={18} className="mr-2" />
                    Edit
                  </button>
                  {/* Delete Button */}
                  <button
                    className=".flex items-center bg-red-600 border-teal-600 text-white hover:bg-red-700"
                    onClick={() => handleDeleteClick(doctor.doctorId)}  // Pass the delete function
                  >
                    <FaTrashAlt size={18} className="mr-2" />
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DoctorTable;