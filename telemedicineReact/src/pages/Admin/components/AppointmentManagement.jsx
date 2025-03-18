import { useState, useEffect } from "react";
import Input from "../../../components/ui/Input";
import Button from "../../../components/Button";
import { Table, Thead, Tbody, Tr, Th, Td } from "../../../components/ui/Table";
import Select from "../../../components/ui/Select";
import { Pencil, Trash } from "lucide-react";

const AppointmentManagement = () => {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showCreateModal, setShowCreateModal] = useState(false); // For toggling the modal visibility
  const [newAppointment, setNewAppointment] = useState({
    patientName: "",
    doctorName: "",
    scheduledTime: "",
    status: "upcoming",
    videoCallLink: "",
  });

  useEffect(() => {
    // Simulated API call to fetch appointments
    const fetchAppointments = async () => {
      try {
        const response = await fetch("http://localhost:5186/api/admin/appointments/GetTotalAppointments");
        if (!response.ok) {
          throw new Error(`Error fetching appointments: ${response.statusText}`);
        }
        const data = await response.json();
        setAppointments(data);
        setFilteredAppointments(data);
      } catch (error) {
        console.error("Error fetching appointments:", error);
      }
    };
    fetchAppointments();
  }, []);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    filterAppointments(e.target.value, statusFilter);
  };

  const handleStatusChange = (e) => {
    setStatusFilter(e.target.value);
    filterAppointments(searchQuery, e.target.value);
  };

  const filterAppointments = (query, status) => {
    let filtered = appointments;

    if (query) {
      filtered = filtered.filter((appointment) =>
        appointment.patientName.toLowerCase().includes(query.toLowerCase())
      );
    }

    if (status !== "all") {
      filtered = filtered.filter((appointment) => appointment.status === status);
    }

    setFilteredAppointments(filtered);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this appointment?")) {
      const updatedAppointments = appointments.filter((appointment) => appointment.id !== id);
      setAppointments(updatedAppointments);
      setFilteredAppointments(updatedAppointments);
    }
  };

  const handleUpdateStatus = (id, newStatus) => {
    const updatedAppointments = appointments.map((appointment) =>
      appointment.id === id ? { ...appointment, status: newStatus } : appointment
    );
    setAppointments(updatedAppointments);
    setFilteredAppointments(updatedAppointments);
  };

  const handleCreateAppointment = () => {
    // Simulate API call to create the appointment
    const newAppointmentData = { ...newAppointment, id: appointments.length + 1 };
    setAppointments([newAppointmentData, ...appointments]);
    setFilteredAppointments([newAppointmentData, ...appointments]);
    setShowCreateModal(false); // Close the modal after creation
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-semibold mb-4">Appointment Manager</h2>
      <div className="flex justify-between mb-4">
        <Input
          placeholder="Search by patient name..."
          value={searchQuery}
          onChange={handleSearch}
          className="w-1/3"
        />
        <Select value={statusFilter} onChange={handleStatusChange} className="w-1/4">
          <option value="all">All</option>
          <option value="upcoming">Upcoming</option>
          <option value="completed">Completed</option>
          <option value="canceled">Canceled</option>
        </Select>
        <Button onClick={() => setShowCreateModal(true)} className="ml-4">Create Appointment</Button>
      </div>

      {/* Modal for creating appointment */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-xl font-semibold mb-4">Create New Appointment</h3>
            <div>
              <Input
                placeholder="Patient Name"
                value={newAppointment.patientName}
                onChange={(e) => setNewAppointment({ ...newAppointment, patientName: e.target.value })}
                className="mb-2"
              />
              <Input
                placeholder="Doctor Name"
                value={newAppointment.doctorName}
                onChange={(e) => setNewAppointment({ ...newAppointment, doctorName: e.target.value })}
                className="mb-2"
              />
              <Input
                type="datetime-local"
                value={newAppointment.scheduledTime}
                onChange={(e) => setNewAppointment({ ...newAppointment, scheduledTime: e.target.value })}
                className="mb-2"
              />
              <Select
                value={newAppointment.status}
                onChange={(e) => setNewAppointment({ ...newAppointment, status: e.target.value })}
                className="mb-2"
              >
                <option value="upcoming">Upcoming</option>
                <option value="completed">Completed</option>
                <option value="canceled">Canceled</option>
              </Select>
              <Input
                placeholder="Video Call Link"
                value={newAppointment.videoCallLink}
                onChange={(e) => setNewAppointment({ ...newAppointment, videoCallLink: e.target.value })}
                className="mb-4"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button onClick={() => setShowCreateModal(false)} variant="destructive">
                Cancel
              </Button>
              <Button onClick={handleCreateAppointment}>Create</Button>
            </div>
          </div>
        </div>
      )}

      <Table>
        <Thead>
          <Tr>
            <Th>ID</Th>
            <Th>Patient Name</Th>
            <Th>Doctor Name</Th>
            <Th>Date</Th>
            <Th>Time</Th>
            <Th>Status</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {filteredAppointments.length === 0 ? (
            <Tr>
              <Td colSpan="7" className="text-center text-gray-500">
                No appointments found
              </Td>
            </Tr>
          ) : (
            filteredAppointments.map((appointment) => (
              <Tr key={appointment.id}>
                <Td>{appointment.id}</Td>
                <Td>{appointment.patientName}</Td>
                <Td>{appointment.doctorName}</Td>
                <Td>{new Date(appointment.scheduledTime).toLocaleDateString()}</Td>
                <Td>{new Date(appointment.scheduledTime).toLocaleTimeString()}</Td>
                <Td>
                  <span
                    className={`px-2 py-1 rounded text-white ${
                      appointment.status === "upcoming"
                        ? "bg-blue-500"
                        : appointment.status === "completed"
                        ? "bg-green-500"
                        : "bg-red-500"
                    }`}
                  >
                    {appointment.status}
                  </span>
                </Td>
                <Td className="flex space-x-2">
                  <Button size="sm" onClick={() => handleUpdateStatus(appointment.id, "completed")}>
                    <Pencil className="w-4 h-4 mr-1" /> Complete
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => handleDelete(appointment.id)}>
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

export default AppointmentManagement;