import React, { useState } from 'react';

const RescheduleForm = ({ appointmentId, onSubmit, onCancel }) => {
  const [newDate, setNewDate] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("newDate before ISO conversion:", newDate);

    // Convert the local time (from input) to UTC using toISOString
    const localDate = new Date(newDate); // Create Date object from input
    const isoDate = localDate.toISOString(); // This automatically converts to UTC

    console.log("ISO formatted date being sent to backend:", isoDate); // Logging to verify

    try {
      // Pass the appointmentId and newDate (in ISO format) to the onSubmit function
      await onSubmit(appointmentId, isoDate);
      alert('Appointment rescheduled!');
      onCancel(); // Close the form once rescheduling is done
    } catch (err) {
      console.error('Failed to reschedule:', err);
      alert('Error rescheduling appointment.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white w-96 max-w-full rounded-md border border-gray-300 shadow-lg p-6">
        <h3 className="text-xl font-semibold text-center text-teal-600 mb-6">Reschedule Appointment</h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="newDate" className="text-sm font-medium">Select New Date and Time:</label>
            <input
              id="newDate"
              type="datetime-local"
              value={newDate}
              onChange={(e) => {
                setNewDate(e.target.value);
                console.log("New date set:", e.target.value); // Log the value immediately after setting
              }}
              required
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div className="flex justify-between gap-2">
            <button
              type="button"
              onClick={onCancel}
              className="w-full py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-full py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 disabled:opacity-50"
              disabled={!newDate}
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RescheduleForm;