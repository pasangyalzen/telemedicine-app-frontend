import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { fetchTodaysAppointments } from '../services/doctorAppointmentApi';
import { Calendar, Clock, X, Check } from 'lucide-react';

const RescheduleForm = ({ appointmentId, onSubmit, onCancel }) => {
  const [newDate, setNewDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    console.log("newDate before ISO conversion:", newDate);

    // Convert the local time (from input) to UTC using toISOString
    const localDate = new Date(newDate); // Create Date object from input

    // Create a new Date object with the same values but manually treating it as UTC
    const isoDate = new Date(Date.UTC(
      localDate.getFullYear(),       // Year
      localDate.getMonth(),          // Month (0-based index)
      localDate.getDate(),           // Day
      localDate.getHours(),          // Hour
      localDate.getMinutes(),        // Minutes
      localDate.getSeconds(),        // Seconds
      localDate.getMilliseconds()    // Milliseconds
    )).toISOString(); // Get ISO string in UTC format
    
    console.log("KOKOKOKKOKO", appointmentId); // This automatically converts to UTC
    console.log("ISO formatted date being sent to backend:", isoDate); // Logging to verify

    try {
      // Pass the appointmentId and newDate (in ISO format) to the onSubmit function
      await onSubmit(appointmentId, isoDate);
      toast.success("Appointment successfully rescheduled");
      onCancel(); // Close the form once rescheduling is done
    } catch (err) {
      console.error('Failed to reschedule:', err);
      toast.error("Failed to reschedule");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-lg rounded-xl border border-gray-100 shadow-xl p-6 animate-fadeIn">
        {/* Header with close button */}
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
          <h3 className="text-xl font-semibold text-gray-800 flex items-center">
            <Calendar size={20} className="text-indigo-600 mr-2" />
            Reschedule Appointment
          </h3>
          <button 
            onClick={onCancel}
            className="p-1 rounded-full hover:bg-gray-100 transition-colors duration-200"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>
        
        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="newDate" className="text-sm font-medium text-gray-700 flex items-center">
              <Clock size={16} className="mr-2 text-indigo-500" />
              Select New Date and Time:
            </label>
            
            <div className="relative">
              <input
                id="newDate"
                type="datetime-local"
                value={newDate}
                onChange={(e) => {
                  setNewDate(e.target.value);
                  console.log("New date set:", e.target.value); // Log the value immediately after setting
                }}
                required
                className="w-full p-3 pl-4 border text-white border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
              />
              {newDate && (
                <div className="mt-2 text-sm text-white">
                  <p>Selected: {new Date(newDate).toLocaleString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Tips section */}
          <div className="bg-indigo-50 rounded-lg p-3 text-sm text-indigo-700">
            <p>Tip: Please ensure the new time is within working hours and is available.</p>
          </div>
          
          {/* Buttons */}
          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onCancel}
              className="px-5 py-2.5 bg-white text-gray-700 rounded-lg hover:bg-gray-100 border border-gray-300 transition-colors duration-200 font-medium flex items-center justify-center"
            >
              <X size={16} className="mr-2" />
              Cancel
            </button>
            <button
              type="submit"
              disabled={!newDate || isSubmitting}
              className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 font-medium flex items-center justify-center"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : (
                <>
                  <Check size={16} className="mr-2" />
                  Reschedule
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RescheduleForm;