import React from "react";
import Select from "../../../../components/ui/Select";  // Ensure correct import

const AppointmentStatusSelect = ({ value, onChange }) => {
  // Handle the change event and pass the formatted event to parent
  const handleStatusChange = (e) => {
    const event = {
      target: {
        name: "status", // Ensure the name matches the field in formData
        value: e.target.value,
      },
    };
    onChange(event); // Pass the custom event to the parent component
  };

  return (
    <Select
      name="status"
      value={value}
      onChange={handleStatusChange} // Using the handleStatusChange function here
      required
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
  );
};

export default AppointmentStatusSelect;