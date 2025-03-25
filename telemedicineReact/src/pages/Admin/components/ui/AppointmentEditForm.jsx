import React, { useState, useEffect } from "react";
import Input from "../../../../components/ui/Input";
import Button from "../../../../components/Button"; // Assuming you have a reusable Button component
import Select from "../../../../components/ui/Select";

const AppointmentEditForm = ({ appointment, handleUpdate, cancelEdit }) => {
  const [formData, setFormData] = useState(appointment || {
    patientName: "",
    doctorName: "",
    status: "Scheduled",
    scheduledTime: "",
  });

  useEffect(() => {
    if (appointment) {
      console.log("Editing appointment:", appointment); // Debugging
      setFormData({ ...appointment });  // Update the formData only once
    }
  }, [appointment]);

  if (!formData) return <div>Loading...</div>;
  console.log("FormData:", formData); // This logs the updated form data
  console.log("Rendering AppointmentEditForm", appointment); // Logs the appointment data being passed to the form
  if (!appointment) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    handleUpdate(formData); // Pass updated appointment data to parent component
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
      <div className="p-6 bg-white shadow-md rounded-lg w-96">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">Edit Appointment</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <Input
              type="text"
              name="patientName"
              value={formData?.patientName ?? ""}
              onChange={(e) => setFormData((prevState) => ({
                ...prevState,
                patientName: e.target.value
              }))}
              placeholder="Patient Name"
              required
              className="bg-gray-100 text-gray-800 p-3 rounded-md border border-gray-300"
            />
          </div>
          <div className="mb-4">
            <Input
              type="text"
              name="doctorName"
              value={formData?.doctorName ?? ""}
              onChange={(e) => setFormData((prevState) => ({
                ...prevState,
                doctorName: e.target.value
              }))}
              placeholder="Doctor Name"
              required
              className="bg-gray-100 text-gray-800 p-3 rounded-md border border-gray-300"
            />
          </div>
          <div className="mb-4">
            <Select
              name="status"
              value={formData?.status || "Scheduled"}
              onChange={(e) => setFormData((prevState) => ({
                ...prevState,
                status: e.target.value
              }))}
              required
              className="bg-gray-100 text-gray-800 p-3 rounded-md border border-gray-300"
            >
              <option value="Scheduled">Scheduled</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
              <option value="Pending">Pending</option>
              <option value="NoShow">NoShow</option>
              <option value="Rescheduled">Rescheduled</option>
              <option value="InProgress">InProgress</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Rejected">Rejected</option>
              <option value="AwaitingPayment">AwaitingPayment</option>
            </Select>
          </div>
          <div className="mb-4">
            <Input
              type="datetime-local"
              name="scheduledTime"
              value={formData?.scheduledTime ?? ""}
              onChange={(e) => setFormData((prevState) => ({
                ...prevState,
                scheduledTime: e.target.value
              }))}
              required
              className="bg-gray-100 text-gray-800 p-3 rounded-md border border-gray-300"
            />
          </div>
          <div className="flex justify-between">
            <Button type="submit" className="bg-teal-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-200 transform hover:scale-105">
              Update Appointment
            </Button>
            <Button
              type="button"
              onClick={cancelEdit}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all duration-200 transform hover:scale-105"
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AppointmentEditForm;