import Input from "../../../../components/ui/Input";
import Button from "../../../../components/Button";

const EditDoctorForm = ({ formData = {}, setFormData, handleUpdate, cancelEdit }) => {
  return (
    <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-lg overflow-hidden">
      <h2 className="text-2xl font-semibold text-teal-800 text-center mb-6">Edit Doctor Information</h2>

      {/* Scrollable form container */}
      <div className="max-h-[600px] overflow-y-auto p-4 border border-gray-300 rounded-lg">
        <form onSubmit={handleUpdate} className="space-y-4">
          <table className="table-auto w-full text-left">
            <tbody>
              {[
                { label: "Full Name", name: "fullName", type: "text", required: true },
                { label: "Email", name: "email", type: "email", required: true },
                { label: "Phone Number", name: "phoneNumber", type: "text", required: true },
                { label: "Gender", name: "gender", type: "text", required: true },
                { label: "Date of Birth", name: "dateOfBirth", type: "date", required: true },
                { label: "License Number", name: "licenseNumber", type: "text" },
                { label: "Medical College", name: "medicalCollege", type: "text" },
                { label: "Specialization", name: "specialization", type: "text" },
                { label: "Years of Experience", name: "yearsOfExperience", type: "number" },
                { label: "Clinic Name", name: "clinicName", type: "text" },
                { label: "Clinic Address", name: "clinicAddress", type: "text" },
                { label: "Consultation Fee", name: "consultationFee", type: "number" }
              ].map((field, index) => (
                <tr key={index}>
                  <td className="py-2 px-4 font-medium text-gray-700">{field.label}</td>
                  <td className="py-2 px-4">
                    <input
                      id={field.name}
                      type={field.type}
                      name={field.name}
                      value={formData[field.name] || ""}
                      onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                      className="p-3 border rounded-lg w-full text-gray-800 focus:ring-2 focus:ring-teal-600 focus:outline-none bg-white"
                      placeholder={`Enter ${field.label}`}
                      required={field.required}
                    />
                  </td>
                </tr>
              ))}
              <tr>
                <td colSpan="2" className="py-4 px-4 text-center">
                  <button
                    onClick={handleUpdate}
                    className="bg-teal-600 text-white py-2 px-6 rounded-lg hover:bg-teal-700"
                  >
                    Update Doctor
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </form>
      </div>
    </div>
  );
};

export default EditDoctorForm;