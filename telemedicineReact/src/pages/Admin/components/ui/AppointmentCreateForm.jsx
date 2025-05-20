import React, { useEffect } from "react";
import Input from "../../../../components/ui/Input";
import Button from "../../../../components/Button";
import AppointmentStatusSelect from "./AppointmentStatusSelect"; // Import the new component

const AppointmentCreateForm = ({
  handleCreateAppointment,
  cancelCreateForm,
  formData,
  setFormData,
  isModalOpen, // New prop to signal modal open state
}) => {
  useEffect(() => {
    // Only reset scheduledTime when the modal is opened
    if (isModalOpen) {
      setFormData((prev) => ({
        ...prev,
        scheduledTime: null, // Reset scheduledTime to null
      }));
    }
  }, [isModalOpen]);
  

  return (
    <div className="p-6 bg-gray-50 shadow-md rounded-lg w-96">
      <h3 className="text-xl font-semibold mb-4 text-teal-700">Create New Appointment</h3>
      <form onSubmit={(e) => { 
        e.preventDefault(); // Prevent default form submission behavior
        handleCreateAppointment(e, formData); // Call the handler and pass formData
      }}>
  {/* Ensure handleCreateAppointment is called on submit */} {/* Patient Name */} <div className="mb-4">


        {/* Doctor Name */}
        <div className="mb-4">
          <Input
            type="text"
            name="doctorName"
            value={formData.doctorName || ""}
            onChange={(e) => setFormData({ ...formData, doctorName: e.target.value })}
            placeholder="Doctor Name"
            required
            className="bg-white text-black p-3 rounded-md border-2 border-gray-300 focus:ring-2 focus:ring-teal-500"
          />
        </div>
        <Input
            type="text"
            name="patientName"
            value={formData.patientName || ""}
            onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
            placeholder="Patient Name"
            required
            className="bg-white text-black p-3 rounded-md border-2 border-gray-300 focus:ring-2 focus:ring-teal-500"
          />
        </div>

        {/* Scheduled Time */}
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
          className="bg-white text-black p-3 rounded-md border-2 border-gray-300 focus:ring-2 focus:ring-teal-500"
        />
      </div>

        {/* Status Dropdown */}
        {/* <div className="mb-4">
          <AppointmentStatusSelect
            value={formData.status || "Scheduled"}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            required
            className="bg-white p-3 rounded-md border-2 border-gray-300 focus:ring-2 focus:ring-teal-500"
          />
        </div> */}

        {/* Video Call Link */}
        <div className="mb-4">
          <Input
            type="text"
            name="videoCallLink"
            value={formData.videoCallLink || ""}
            onChange={(e) => setFormData({ ...formData, videoCallLink: e.target.value })}
            placeholder="Reason for the Appointment"
            className="bg-white text-black p-3 rounded-md border-2 border-gray-300 focus:ring-2 focus:ring-teal-500"
          />
        </div>

        {/* Buttons: Create & Cancel */}
        <div className="flex justify-end gap-4 mt-4">
        <Button type="submit" onClick={() => console.log("Current formData:", formData)}>
          Create
        </Button>
          {/* <Button
            type="button"  // Prevent form submission behavior
            onClick={(e) => handleCreateAppointment(e)}   // This should trigger the form submit and call handleCreateAppointment
            className="bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 transition duration-300"
            
          >
            Create
          </Button> */}
          <Button
            type="button"
            onClick={cancelCreateForm}
            className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition duration-300"
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AppointmentCreateForm;