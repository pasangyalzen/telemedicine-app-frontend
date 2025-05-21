import React, { useEffect, useState } from "react";
import axios from "axios";
import { getDoctorIdByUserId } from "../services/doctorAppointmentApi";
import { getUserIdFromToken } from "../../auth/auth";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { rescheduleAppointment } from "../services/doctorAppointmentApi";

const API_URL = "http://localhost:5186/api";

const RescheduleForm = ({ appointmentId, onClose, onRescheduleSuccess }) => {
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
  }, []);

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

    try {
      const message = await rescheduleAppointment(appointmentId, payload);
      toast.success(message);

      onClose?.();
      onRescheduleSuccess?.();
      navigate(-1);
    } catch (err) {
      toast.error(err.message || "Failed to reschedule appointment");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md transform transition-all">
        <div className="bg-teal-700 text-white p-4 rounded-t-xl">
          <h2 className="text-xl font-bold">Reschedule Appointment</h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-5">
            <label className="block mb-2 font-medium text-gray-700">
              Appointment Date
            </label>
            <input
              type="date"
              className="w-full border-2 border-teal-100 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
              value={formData.appointmentDate}
              onChange={(e) =>
                setFormData({ ...formData, appointmentDate: e.target.value })
              }
              required
              min={new Date().toISOString().split("T")[0]}
            />
          </div>

          <div className="mb-5">
            <label className="block mb-2 font-medium text-gray-700">
              Available Time Slot
            </label>
            <select
              className="w-full border-2 border-teal-100 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
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
            {formData.appointmentDate && !availableTimes.length && (
              <p className="mt-1 text-sm text-teal-600">
                No time slots available for selected date
              </p>
            )}
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border-2 border-teal-200 text-teal-700 font-medium hover:bg-teal-50 transition focus:outline-none focus:ring-2 focus:ring-teal-500"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 transition focus:outline-none focus:ring-2 focus:ring-teal-500 disabled:opacity-70"
              disabled={isSubmitting || !formData.startTime || !formData.endTime}
            >
              {isSubmitting ? "Processing..." : "Reschedule"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RescheduleForm;