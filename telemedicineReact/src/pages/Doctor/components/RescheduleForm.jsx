import React, { useEffect, useState } from "react";
import axios from "axios";
import { getDoctorIdByUserId } from "../services/doctorAppointmentApi";
import { getUserIdFromToken } from "../../auth/auth";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { rescheduleAppointment } from "../services/doctorAppointmentApi";
import { Calendar, Clock, X, RefreshCw } from "lucide-react";

const API_URL = "http://localhost:5186/api";

const RescheduleForm = ({ appointmentId, doctorId: propDoctorId, onClose, onRescheduleSuccess }) => {
  const navigate = useNavigate();  // Moved inside component

  const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  const [formData, setFormData] = useState({
    doctorId: "",
    appointmentDate: "",
    startTime: "",
    endTime: "",
  });

  const [availabilities, setAvailabilities] = useState([]);
  const [availableTimes, setAvailableTimes] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
  if (propDoctorId) {
    setFormData((prev) => ({ ...prev, doctorId: propDoctorId }));
    return;
  }

  const userId = getUserIdFromToken();
  if (!userId) return;

  const fetchDoctorId = async () => {
    try {
      const doctorId = await getDoctorIdByUserId(userId);
      setFormData((prev) => ({ ...prev, doctorId }));
    } catch (error) {
      console.error("Failed to fetch doctorId:", error);
      toast.error("Failed to retrieve doctor information");
    }
  };

  fetchDoctorId();
}, [propDoctorId]);

  useEffect(() => {
    if (!formData.doctorId) return;

    apiClient
      .get(`/Doctor/GetAvailability/${formData.doctorId}`)
      .then((res) => setAvailabilities(res.data))
      .catch((err) => {
        console.error("Failed to fetch availabilities:", err);
        setAvailabilities([]);
        toast.error("Could not retrieve available time slots");
      });
  }, [formData.doctorId]);

  useEffect(() => {
    if (!formData.appointmentDate || !availabilities.length) {
      setAvailableTimes([]);
      return;
    }

    const selectedDay = new Date(formData.appointmentDate).getDay();
    const times = availabilities
      .filter((a) => a.dayOfWeek === selectedDay)
      .map((a) => ({ startTime: a.startTime, endTime: a.endTime }));

    setAvailableTimes(times);

    setFormData((prev) => ({
      ...prev,
      startTime: "",
      endTime: "",
    }));
  }, [formData.appointmentDate, availabilities]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const payload = {
      appointmentId,
      appointmentDate: formData.appointmentDate,
      startTime: formData.startTime,
      endTime: formData.endTime,
      status: "Rescheduled",
    };
    console.log("PPOPOOOPOO",payload);

    try {
      const message = await rescheduleAppointment(appointmentId, payload);
      toast.success(message);
      // await fetchAppointments?.();

      onRescheduleSuccess?.(appointmentId, formData.appointmentDate);
      onClose?.();
    } catch (err) {
      toast.error(err.message || "Failed to reschedule appointment");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg transform transition-all animate-in fade-in-0 scale-in-95 duration-300">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-600 to-teal-700 text-white p-6 rounded-t-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500 opacity-20 rounded-full transform translate-x-8 -translate-y-8"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-teal-800 opacity-20 rounded-full transform -translate-x-4 translate-y-4"></div>
          <div className="relative flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white bg-opacity-20 rounded-lg">
                <RefreshCw size={24} className="text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Reschedule Appointment</h2>
                <p className="text-teal-100 text-sm mt-1">Select a new date and time</p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors duration-200"
              disabled={isSubmitting}
            >
              <X size={20} className="text-white" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {/* Date Selection */}
          <div className="space-y-2">
            <label className="flex items-center space-x-2 font-semibold text-gray-700 text-sm uppercase tracking-wide">
              <Calendar size={16} className="text-teal-600" />
              <span>Appointment Date</span>
            </label>
            <div className="relative">
              <input
                type="date"
                className="w-full border-2 border-gray-200 p-4 rounded-xl focus:outline-none focus:ring-4 focus:ring-teal-100 focus:border-teal-500 transition-all duration-200 text-gray-700 font-medium bg-gray-50 hover:bg-white"
                value={formData.appointmentDate}
                onChange={(e) =>
                  setFormData({ ...formData, appointmentDate: e.target.value })
                }
                required
                min={new Date().toISOString().split("T")[0]}
              />
            </div>
          </div>

          {/* Time Selection */}
          <div className="space-y-2">
            <label className="flex items-center space-x-2 font-semibold text-gray-700 text-sm uppercase tracking-wide">
              <Clock size={16} className="text-teal-600" />
              <span>Available Time Slot</span>
            </label>
            <div className="relative">
              <select
                className="w-full border-2 border-gray-200 p-4 rounded-xl focus:outline-none focus:ring-4 focus:ring-teal-100 focus:border-teal-500 transition-all duration-200 text-gray-700 font-medium bg-gray-50 hover:bg-white disabled:opacity-60 disabled:cursor-not-allowed appearance-none cursor-pointer"
                value={
                  formData.startTime && formData.endTime
                    ? `${formData.startTime}-${formData.endTime}`
                    : ""
                }
                onChange={(e) => {
                  if (e.target.value) {
                    const [start, end] = e.target.value.split("-");
                    setFormData({ ...formData, startTime: start, endTime: end });
                  } else {
                    setFormData({ ...formData, startTime: "", endTime: "" });
                  }
                }}
                required
                disabled={!availableTimes.length}
              >
                <option value="">-- Select Time Slot --</option>
                {availableTimes.map((t, idx) => (
                  <option key={idx} value={`${t.startTime}-${t.endTime}`}>
                    {t.startTime} - {t.endTime}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none">
                <Clock size={18} className="text-gray-400" />
              </div>
            </div>
            {formData.appointmentDate && !availableTimes.length && (
              <div className="flex items-center space-x-2 mt-3 p-3 bg-teal-50 border border-teal-200 rounded-lg">
                <div className="w-2 h-2 bg-teal-500 rounded-full animate-pulse"></div>
                <p className="text-sm text-teal-700 font-medium">
                  No time slots available for selected date
                </p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 rounded-xl border-2 border-gray-200 text-gray-600 font-semibold hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-gray-100 disabled:opacity-60"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-8 py-3 bg-gradient-to-r from-teal-600 to-teal-700 text-white rounded-xl font-semibold hover:from-teal-700 hover:to-teal-800 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-teal-200 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center space-x-2"
              disabled={isSubmitting || !formData.startTime || !formData.endTime}
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <RefreshCw size={16} />
                  <span>Reschedule</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Decorative Elements */}
        <div className="absolute -bottom-2 -right-2 w-20 h-20 bg-teal-100 rounded-full opacity-50 blur-xl"></div>
        <div className="absolute -top-2 -left-2 w-16 h-16 bg-teal-200 rounded-full opacity-30 blur-lg"></div>
      </div>
    </div>
  );
};

export default RescheduleForm;