import React, { useState, useEffect } from "react"
import axios from "axios"
import { getEmailFromToken } from "../../auth/auth"
import { getDoctorIdByEmail } from "../services/doctorAppointmentApi"
import { apiClient } from "../services/doctorAppointmentApi"
import toast from "react-hot-toast"
import { Calendar, Clock, User, X, Plus, CheckCircle, AlertCircle } from "lucide-react"

const daysOfWeek = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
]
const dayNameToNumber = {
  Sunday: 0,
  Monday: 1,
  Tuesday: 2,
  Wednesday: 3,
  Thursday: 4,
  Friday: 5,
  Saturday: 6,
};

export default function DoctorAvailabilityForm({ onSuccess, onClose }) {
  const [doctorId, setDoctorId] = useState(null)
  const [formData, setFormData] = useState({
    DayOfWeek: "Monday",
    StartTime: "",
    EndTime: "",
    AppointmentDurationInMinutes: 15, 
    BufferTimeInMinutes: 5,
  })
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchDoctorId = async () => {
      const email = getEmailFromToken()
      const id = await getDoctorIdByEmail(email)
      setDoctorId(id)
    }
    fetchDoctorId()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
  e.preventDefault();
  setMessage("");
  setError("");

  if (!doctorId) {
    setError("Doctor ID not found.");
    return;
  }
  const formatTimeWithSeconds = (time) => {
    if (time && time.length === 5) {
      // if format is "HH:mm" (length 5), add ":00"
      return time + ":00";
    }
    return time; // already has seconds or empty
  };

  try {
    const payload = {
      ...formData,
      DoctorId: doctorId,
      DayOfWeek: dayNameToNumber[formData.DayOfWeek], 
      StartTime: formatTimeWithSeconds(formData.StartTime),
      EndTime: formatTimeWithSeconds(formData.EndTime),
      AppointmentDurationInMinutes: parseInt(formData.AppointmentDurationInMinutes),
      BufferTimeInMinutes: parseInt(formData.BufferTimeInMinutes),
      AvailabilityId: 0,
    };
    console.log("Payload being sent:", payload);

    const response = await apiClient.post("/SetAvailability", payload, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    console.log("Response from server:", response.data);
    toast.success("Availability saved successfully!");

    setMessage(response.data);
    onSuccess?.();
  } catch (err) {
  const errorData = err.response?.data;
  
  if (typeof errorData === "string") {
    setError(errorData);
    toast.error(errorData);
  } else if (errorData?.title) {
    // This handles the object with `title`, `errors`, etc.
    setError(errorData.title);
  } else {
    setError("Failed to save availability.");
  }
}
};

  const getDayIcon = (day) => {
    const dayIcons = {
      Sunday: "🌅",
      Monday: "💼",
      Tuesday: "📅",
      Wednesday: "⚡",
      Thursday: "🎯",
      Friday: "🎉",
      Saturday: "🌙"
    };
    return dayIcons[day] || "📅";
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex items-center justify-center backdrop-blur-sm p-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 max-w-2xl w-full relative transform transition-all duration-300 scale-100 animate-in slide-in-from-bottom">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6 rounded-t-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white hover:bg-white/20 rounded-full p-2 transition-all duration-200 z-10"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-4 relative z-10">
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <Plus className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Set Your Availability</h2>
              <p className="text-blue-100 text-sm">Configure your appointment schedule</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          {/* Status Messages */}
          {message && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3 animate-in slide-in-from-top duration-200">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
              <p className="text-green-700 font-medium">{message}</p>
            </div>
          )}
          
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 animate-in slide-in-from-top duration-200">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
              <p className="text-red-700 font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Day Selection */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <Calendar className="w-4 h-4 text-blue-600" />
                Day of Week
              </label>
              <select
                name="DayOfWeek"
                value={formData.DayOfWeek}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white shadow-sm text-gray-900 font-medium"
              >
                {daysOfWeek.map((day) => (
                  <option key={day} value={day}>
                    {getDayIcon(day)} {day}
                  </option>
                ))}
              </select>
            </div>

            {/* Time Inputs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <Clock className="w-4 h-4 text-green-600" />
                  Start Time
                </label>
                <div className="relative">
                  <input
                    type="time"
                    name="StartTime"
                    value={formData.StartTime}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 shadow-sm bg-green-50/30"
                  />
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-green-400 rounded-full"></div>
                </div>
              </div>

              <div className="space-y-3">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <Clock className="w-4 h-4 text-red-600" />
                  End Time
                </label>
                <div className="relative">
                  <input
                    type="time"
                    name="EndTime"
                    value={formData.EndTime}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 shadow-sm bg-red-50/30"
                  />
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-red-400 rounded-full"></div>
                </div>
              </div>
            </div>

            {/* Duration Inputs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <User className="w-4 h-4 text-purple-600" />
                  Appointment Duration
                </label>
                <div className="relative">
                  <input
                    type="number"
                    name="AppointmentDurationInMinutes"
                    value={formData.AppointmentDurationInMinutes}
                    onChange={handleChange}
                    required
                    min="1"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 shadow-sm bg-purple-50/30"
                  />
                  <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-sm text-gray-500 font-medium">
                    minutes
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <Clock className="w-4 h-4 text-orange-600" />
                  Buffer Time
                </label>
                <div className="relative">
                  <input
                    type="number"
                    name="BufferTimeInMinutes"
                    value={formData.BufferTimeInMinutes}
                    onChange={handleChange}
                    required
                    min="0"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 shadow-sm bg-orange-50/30"
                  />
                  <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-sm text-gray-500 font-medium">
                    minutes
                  </span>
                </div>
              </div>
            </div>

            {/* Summary Card */}
            {formData.StartTime && formData.EndTime && (
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4 animate-in slide-in-from-bottom duration-300">
                <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-blue-600" />
                  Schedule Summary
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Selected Day:</span>
                    <span className="font-medium text-gray-900">{getDayIcon(formData.DayOfWeek)} {formData.DayOfWeek}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Time Slot:</span>
                    <span className="font-medium text-gray-900">{formData.StartTime} - {formData.EndTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Appointment:</span>
                    <span className="font-medium text-gray-900">{formData.AppointmentDurationInMinutes} min</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Buffer:</span>
                    <span className="font-medium text-gray-900">{formData.BufferTimeInMinutes} min</span>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 font-medium flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
              <button
                type="submit"
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 font-semibold flex items-center gap-2"
              >
                <CheckCircle className="w-4 h-4" />
                Save Availability
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}