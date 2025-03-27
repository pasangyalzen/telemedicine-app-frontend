import React, { useState, useEffect } from "react";
import Input from "../../../../components/ui/Input";
import Button from "../../../../components/Button"; // Assuming you have a reusable Button component
import Select from "../../../../components/ui/Select";

const AppointmentEditForm = ({ appointment, handleUpdate, cancelEdit }) => {
  const [formData, setFormData] = useState({
    appointmentId: "",
    patientName: "",
    doctorName: "",
    status: "Scheduled",
    scheduledTime: "",
  });

  useEffect(() => {
    if (appointment) {
      const formattedScheduledTime = new Date(appointment.scheduledTime).toISOString().slice(0, 16);
      setFormData({
        appointmentId: appointment.appointmentId || "",
        patientName: appointment.patientName || "",
        doctorName: appointment.doctorName || "",
        status: appointment.status || "Scheduled",
        scheduledTime: formattedScheduledTime, // Format the scheduled time
      });
    }
  }, [appointment]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitting form data:", formData);
    handleUpdate(e, formData); // Pass updated appointment data to parent component
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96 max-w-full">
        <h3 className="text-xl font-semibold mb-4">Edit Appointment</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <Input
              type="text"
              name="appointmentId"
              value={formData?.appointmentId ?? ""}
              onChange={handleInputChange}
              placeholder="Appointment ID"
              disabled
              className="bg-white p-2 rounded-md border border-gray-300 text-black"
            />
          </div>
          <div className="mb-4">
            <Input
              type="text"
              name="patientName"
              value={formData.patientName || ""}
              onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
              placeholder="Patient Name"
              required
              className="bg-white p-2 rounded-md border border-gray-300 text-black"
            />
          </div>
          <div className="mb-4">
            <Input
              type="text"
              name="doctorName"
              value={formData.doctorName || ""}
              onChange={(e) => setFormData({ ...formData, doctorName: e.target.value })}
              placeholder="Doctor Name"
              required
              className="bg-white p-2 rounded-md border border-gray-300 text-black"
            />
          </div>
          <div className="mb-4">
            <Select
              name="status"
              value={formData?.status || "Scheduled"}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
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
              value={formData.scheduledTime || ""}
              onChange={(e) => {
                console.log("Raw Input Value:", e.target.value); // Debugging log
                setFormData({ ...formData, scheduledTime: e.target.value });
              }}
              required
              className="bg-white p-2 rounded-md border border-gray-300 text-black"
            />
          </div>
          {/* Video Call Link */}
        <div className="mb-4">
          <Input
            type="text"
            name="videoCallLink"
            value={formData.videoCallLink || ""}
            onChange={(e) => setFormData({ ...formData, videoCallLink: e.target.value })}
            placeholder="Video Call Link"
            className="bg-white text-black p-3 rounded-md border-2 border-gray-300 focus:ring-2 focus:ring-teal-500"
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