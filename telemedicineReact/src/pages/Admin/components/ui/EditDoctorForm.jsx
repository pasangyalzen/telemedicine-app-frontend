import Input from "../../../../components/ui/Input";
import Button from "../../../../components/Button";

const EditDoctorForm = ({ formData = {}, setFormData, handleUpdate, cancelEdit }) => {
  return (
    <div className="p-6 border border-gray-500 rounded bg-gray-100 shadow-md">
      <h3 className="text-lg text-black font-bold mb-4">Edit Doctor</h3>

      <div className="grid grid-cols-2 gap-4 text-gray-500">
        <Input
          placeholder="Full Name"
          value={formData.fullName || ""}
          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
          className="bg-white p-2 rounded-md border border-gray-300"
        />
        <Input
          placeholder="Email"
          value={formData.email || ""}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="bg-white p-2 rounded-md border border-gray-300"
        />
        <Input
          placeholder="Phone Number"
          value={formData.phoneNumber || ""}
          onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
          className="bg-white p-2 rounded-md border border-gray-300"
        />
        <Input
          placeholder="Gender"
          value={formData.gender || ""}
          onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
          className="bg-white p-2 rounded-md border border-gray-300"
        />
        <Input
          type="date"
          placeholder="Date of Birth"
          value={formData.dateOfBirth ? formData.dateOfBirth.split("T")[0] : ""}
          onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
          className="bg-white p-2 rounded-md border border-gray-300"
        />
        <Input
          placeholder="License Number"
          value={formData.licenseNumber || ""}
          onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
          className="bg-white p-2 rounded-md border border-gray-300"
        />
        <Input
          placeholder="Medical College"
          value={formData.medicalCollege || ""}
          onChange={(e) => setFormData({ ...formData, medicalCollege: e.target.value })}
          className="bg-white p-2 rounded-md border border-gray-300"
        />
        <Input
          placeholder="Specialization"
          value={formData.specialization || ""}
          onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
          className="bg-white p-2 rounded-md border border-gray-300"
        />
        <Input
          type="number"
          placeholder="Years of Experience"
          value={formData.yearsOfExperience || 0}
          onChange={(e) => setFormData({ ...formData, yearsOfExperience: Number(e.target.value) })}
          className="bg-white p-2 rounded-md border border-gray-300"
        />
        <Input
          placeholder="Clinic Name"
          value={formData.clinicName || ""}
          onChange={(e) => setFormData({ ...formData, clinicName: e.target.value })}
          className="bg-white p-2 rounded-md border border-gray-300"
        />
        <Input
          placeholder="Clinic Address"
          value={formData.clinicAddress || ""}
          onChange={(e) => setFormData({ ...formData, clinicAddress: e.target.value })}
          className="bg-white p-2 rounded-md border border-gray-300"
        />
        <Input
          type="number"
          placeholder="Consultation Fee"
          value={formData.consultationFee || 0}
          onChange={(e) => setFormData({ ...formData, consultationFee: Number(e.target.value) })}
          className="bg-white p-2 rounded-md border border-gray-300"
        />
      </div>

      <div className="flex justify-end gap-4 mt-6">
        <Button
          onClick={handleUpdate}
          className="bg-teal-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50 transition duration-300"
        >
          Update Doctor
        </Button>
        <Button
          onClick={cancelEdit}
          className="bg-gray-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 transition duration-300"
        >
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default EditDoctorForm;