import { useState, useEffect } from "react";
import Input from "../../../components/ui/Input";
import Button from "../../../components/Button";
import { Table, Thead, Tbody, Tr, Th, Td } from "../../../components/ui/Table";
import Select from "../../../components/ui/Select";
import { Pencil, Trash } from "lucide-react";

const DoctorManagement = () => {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [specialtyFilter, setSpecialtyFilter] = useState("all");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newDoctor, setNewDoctor] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    gender: "",
    dateOfBirth: "",
    licenseNumber: "",
    medicalCollege: "",
    specialization: "",
    yearsOfExperience: 0,
    clinicName: "",
    clinicAddress: "",
    consultationFee: 0,
  });

  useEffect(() => {
    // Fetch doctors data from the API
    const fetchDoctors = async () => {
      try {
        const response = await fetch("http://localhost:5186/api/Admin/GetDoctors");
        if (!response.ok) {
          throw new Error(`Error fetching doctors: ${response.statusText}`);
        }
        const data = await response.json();
        setDoctors(data);
        setFilteredDoctors(data);
      } catch (error) {
        console.error("Error fetching doctors:", error);
      }
    };
    fetchDoctors();
  }, []);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    filterDoctors(e.target.value, specialtyFilter);
  };

  const handleSpecialtyChange = (e) => {
    setSpecialtyFilter(e.target.value);
    filterDoctors(searchQuery, e.target.value);
  };

  const filterDoctors = (query, specialty) => {
    let filtered = doctors;

    if (query) {
      filtered = filtered.filter((doctor) =>
        doctor.fullName.toLowerCase().includes(query.toLowerCase()) ||
        doctor.specialization.toLowerCase().includes(query.toLowerCase())
      );
    }

    if (specialty !== "all") {
      filtered = filtered.filter((doctor) => doctor.specialization === specialty);
    }

    setFilteredDoctors(filtered);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this doctor?")) {
      const updatedDoctors = doctors.filter((doctor) => doctor.doctorId !== id);
      setDoctors(updatedDoctors);
      setFilteredDoctors(updatedDoctors);
    }
  };

  const handleUpdateStatus = (id, newStatus) => {
    const updatedDoctors = doctors.map((doctor) =>
      doctor.doctorId === id ? { ...doctor, status: newStatus } : doctor
    );
    setDoctors(updatedDoctors);
    setFilteredDoctors(updatedDoctors);
  };

  const handleCreateDoctor = () => {
    const newDoctorData = { ...newDoctor, doctorId: doctors.length + 1 };
    setDoctors([newDoctorData, ...doctors]);
    setFilteredDoctors([newDoctorData, ...doctors]);
    setShowCreateModal(false);
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-semibold mb-4">Doctor Management</h2>
      <div className="flex justify-between mb-4">
        <Input
          placeholder="Search by doctor name or specialty..."
          value={searchQuery}
          onChange={handleSearch}
          className="w-1/3"
        />
        <Select value={specialtyFilter} onChange={handleSpecialtyChange} className="w-1/4">
          <option value="all">All Specialties</option>
          <option value="Cardiology">Cardiology</option>
          <option value="General Medicine">General Medicine</option>
          {/* Add more specialties as needed */}
        </Select>
        <Button onClick={() => setShowCreateModal(true)} className="ml-4">Create Doctor</Button>
      </div>

      {/* Modal for creating doctor */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-primary bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-xl font-semibold mb-4">Create New Doctor</h3>
            <div>
              <Input
                placeholder="Full Name"
                value={newDoctor.fullName}
                onChange={(e) => setNewDoctor({ ...newDoctor, fullName: e.target.value })}
                className="mb-2"
              />
              <Input
                placeholder="Email"
                value={newDoctor.email}
                onChange={(e) => setNewDoctor({ ...newDoctor, email: e.target.value })}
                className="mb-2"
              />
              <Input
                placeholder="Phone Number"
                value={newDoctor.phoneNumber}
                onChange={(e) => setNewDoctor({ ...newDoctor, phoneNumber: e.target.value })}
                className="mb-2"
              />
              <Input
                placeholder="Gender"
                value={newDoctor.gender}
                onChange={(e) => setNewDoctor({ ...newDoctor, gender: e.target.value })}
                className="mb-2"
              />
              <Input
                placeholder="Date of Birth"
                type="date"
                value={newDoctor.dateOfBirth}
                onChange={(e) => setNewDoctor({ ...newDoctor, dateOfBirth: e.target.value })}
                className="mb-2"
              />
              <Input
                placeholder="License Number"
                value={newDoctor.licenseNumber}
                onChange={(e) => setNewDoctor({ ...newDoctor, licenseNumber: e.target.value })}
                className="mb-2"
              />
              <Input
                placeholder="Medical College"
                value={newDoctor.medicalCollege}
                onChange={(e) => setNewDoctor({ ...newDoctor, medicalCollege: e.target.value })}
                className="mb-2"
              />
              <Input
                placeholder="Specialization"
                value={newDoctor.specialization}
                onChange={(e) => setNewDoctor({ ...newDoctor, specialization: e.target.value })}
                className="mb-2"
              />
              <Input
                placeholder="Years of Experience"
                type="number"
                value={newDoctor.yearsOfExperience}
                onChange={(e) => setNewDoctor({ ...newDoctor, yearsOfExperience: e.target.value })}
                className="mb-2"
              />
              <Input
                placeholder="Clinic Name"
                value={newDoctor.clinicName}
                onChange={(e) => setNewDoctor({ ...newDoctor, clinicName: e.target.value })}
                className="mb-2"
              />
              <Input
                placeholder="Clinic Address"
                value={newDoctor.clinicAddress}
                onChange={(e) => setNewDoctor({ ...newDoctor, clinicAddress: e.target.value })}
                className="mb-2"
              />
              <Input
                placeholder="Consultation Fee"
                type="number"
                value={newDoctor.consultationFee}
                onChange={(e) => setNewDoctor({ ...newDoctor, consultationFee: e.target.value })}
                className="mb-2"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button onClick={() => setShowCreateModal(false)} variant="destructive">
                Cancel
              </Button>
              <Button onClick={handleCreateDoctor}>Create</Button>
            </div>
          </div>
        </div>
      )}

      <Table>
        <Thead>
          <Tr>
            <Th>ID</Th>
            <Th>Doctor Name</Th>
            <Th>Specialization</Th>
            <Th>Phone</Th>
            <Th>Email</Th>
            <Th>Consultation Fee</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {filteredDoctors.length === 0 ? (
            <Tr>
              <Td colSpan="7" className="text-center text-black">
                No doctors found
              </Td>
            </Tr>
          ) : (
            filteredDoctors.map((doctor) => (
              <Tr key={doctor.doctorId}>
                <Td>{doctor.doctorId}</Td>
                <Td>{doctor.fullName}</Td>
                <Td>{doctor.specialization}</Td>
                <Td>{doctor.phoneNumber}</Td>
                <Td>{doctor.email || "Not Provided"}</Td>
                <Td>{doctor.consultationFee}</Td>
                <Td className="flex space-x-2">
                  <Button size="sm" onClick={() => handleUpdateStatus(doctor.doctorId, doctor.status === "active" ? "inactive" : "active")}>
                    <Pencil className="w-4 h-4 mr-1" /> Toggle Status
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => handleDelete(doctor.doctorId)}>
                    <Trash className="w-4 h-4 mr-1" /> Delete
                  </Button>
                </Td>
              </Tr>
            ))
          )}
        </Tbody>
      </Table>
    </div>
  );
};

export default DoctorManagement;