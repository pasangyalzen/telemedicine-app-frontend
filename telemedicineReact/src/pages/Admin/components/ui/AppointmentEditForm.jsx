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
      // Ensure the scheduled time is in the correct format for datetime-local input
      const formattedScheduledTime = new Date(appointment.scheduledTime).toISOString().slice(0, 16);
      setFormData({
        ...appointment,
        scheduledTime: formattedScheduledTime, // Format the scheduled time
      });
    }
  }, [appointment]);

  if (!formData) return <div>Loading...</div>;
  console.log("FormData:", formData); // This logs the updated form data
  console.log("Rendering AppointmentEditForm", appointment); // Logs the appointment data being passed to the form
  if (!appointment) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log(`Changing ${name} to ${value}`); // Debugging
    setFormData((prevState) => ({
      ...prevState,  // Preserve other fields
      [name]: value, // Update only the changed field
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleUpdate(formData); // Pass updated appointment data to parent component
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex text-black justify-center items-center">
      <div className="p-6 bg-white shadow-md rounded-lg w-96">
        <h3 className="text-xl font-semibold mb-4">Edit Appointment</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <Input
              type="text"
              name="patientName"
              value={formData?.patientName ?? ""}
              onChange={handleInputChange}
              placeholder="Patient Name"
              required
              className="bg-white p-2 rounded-md border border-gray-300"
            />
          </div>
          <div className="mb-4">
            <Input
              type="text"
              name="doctorName"
              value={formData?.doctorName ?? ""}
              onChange={handleInputChange}
              placeholder="Doctor Name"
              required
              className="bg-white p-2 rounded-md border border-gray-300"
            />
          </div>
          <div className="mb-4  bg-white">
            <Select
              name="status"
              value={formData?.status || "Scheduled"}
              onChange={handleInputChange}
              required
              className="bg-white text-black border border-gray-300"
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
              onChange={handleInputChange}
              required
              className="bg-white p-2 rounded-md border border-gray-300"
            />
          </div>
          <div className="flex justify-between">
            <Button type="submit" className="bg-teal-600 text-white px-4 py-2 rounded-lg">
              Update Appointment
            </Button>
            <Button
              type="button"
              onClick={cancelEdit}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg"
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