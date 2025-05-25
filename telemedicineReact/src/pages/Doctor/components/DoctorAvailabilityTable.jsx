import React, { useEffect, useState } from "react";
import axios from "axios";
import Button from "../../../components/Button";
import { Pencil, Trash2, PlusCircle, Calendar, Clock, User } from "lucide-react";
import ConfirmationModal from "../../../components/ConfirmationModal";
import toast from "react-hot-toast";
import DoctorAvailabilityForm from "./DoctorAvailabilityForm";

const DoctorAvailabilityTable = ({ doctorId }) => {
  const [availabilityList, setAvailabilityList] = useState([]);
  const [editingAvailability, setEditingAvailability] = useState(null);
  const [deleteCandidateId, setDeleteCandidateId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleOpenModal = () => setIsModalOpen(true)
  const handleCloseModal = () => setIsModalOpen(false)
  const handleSuccess = () => {
    setIsModalOpen(false)
    fetchAvailability();
  }

  const apiClient = axios.create({
    baseURL: "http://localhost:5186/api/Doctor",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  const fetchAvailability = async () => {
    try {
      const response = await apiClient.get(`/GetAvailability/${doctorId}`);
      setAvailabilityList(response.data);
    } catch (error) {
      console.error("Error fetching availability:", error);
      // toast.error("Failed to fetch availability.", { id: "fetch-error" });
    }
  };

  const fetchAvailabilityById = async (availabilityId) => {
    try {
      const response = await apiClient.get(`/GetAvailabilityByAvailabilityId/${availabilityId}`);
      setEditingAvailability(response.data);
    } catch (error) {
      console.error("Error fetching by availabilityId:", error);
      toast.error("Failed to fetch availability details.", { id: "fetch-by-id-error" });
    }
  };

  const confirmDeleteAvailability = (availabilityId) => {
    setDeleteCandidateId(availabilityId);
    setShowDeleteModal(true);
  };

  const deleteAvailability = async () => {
  try {
    await apiClient.delete(`/DeleteAvailability/${deleteCandidateId}`);
    toast.dismiss("delete-toast");
    toast.success("Availability deleted successfully.", { id: "delete-toast" });
    setShowDeleteModal(false);
    setDeleteCandidateId(null);
    fetchAvailability();
  } catch (error) {
    toast.dismiss("delete-toast");
    toast.error("Failed to delete availability.", { id: "delete-toast" });
  }
};

  const formatToInputTime = (timeStr) => {
    if (!timeStr) return "";
    return timeStr.length >= 5 ? timeStr.slice(0, 5) : timeStr;
  };

  const formatToFullTime = (timeStr) => {
    if (!timeStr) return "00:00:00";
    return timeStr.length === 5 ? timeStr + ":00" : timeStr;
  };

  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const dayColors = ["bg-red-50 text-red-700 border-red-200", "bg-blue-50 text-blue-700 border-blue-200", "bg-green-50 text-green-700 border-green-200", "bg-yellow-50 text-yellow-700 border-yellow-200", "bg-purple-50 text-purple-700 border-purple-200", "bg-pink-50 text-pink-700 border-pink-200", "bg-indigo-50 text-indigo-700 border-indigo-200"];

  useEffect(() => {
    if (doctorId) fetchAvailability();
  }, [doctorId]);

  const handleEditClick = (availabilityId) => {
    fetchAvailabilityById(availabilityId);
  };

  const handleEditSubmit = async (e) => {
  e.preventDefault();
  try {
    const payload = {
      ...editingAvailability,
      startTime: formatToFullTime(editingAvailability.startTime),
      endTime: formatToFullTime(editingAvailability.endTime),
    };

    toast.dismiss("edit-toast");
    await apiClient.put(`/UpdateAvailability/${editingAvailability.availabilityId}`, payload);
    toast.success("Availability updated successfully.", { id: "edit-toast" });
    setEditingAvailability(null);
    fetchAvailability();
  } catch (error) {
    toast.dismiss("edit-toast");
    toast.error("The available time you are trying to create overlaps the previous one. Please set a different Availability Time. ", { id: "edit-toast" });
  }
};

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditingAvailability((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                  <User className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white">Doctor Availability</h1>
                  <p className="text-blue-100 text-lg">Manage your appointment schedule</p>
                </div>
              </div>
              <Button 
                className="bg-white text-blue-600 hover:bg-blue-50 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 px-6 py-3 text-base font-semibold" 
                onClick={handleOpenModal}
              >
                <PlusCircle className="w-5 h-5 mr-2" />
                Add New Availability
              </Button>
            </div>
          </div>

          {/* Stats Section */}
          <div className="px-8 py-6 bg-gray-50 border-b border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Calendar className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-gray-500 text-sm font-medium">Available Days</p>
                  <p className="text-2xl font-bold text-gray-900">{availabilityList.length}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <div className="p-3 bg-green-100 rounded-lg">
                  <Clock className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-gray-500 text-sm font-medium">Total Hours/Week</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {availabilityList.reduce((total, item) => {
                      const start = new Date(`2000-01-01T${formatToInputTime(item.startTime)}:00`);
                      const end = new Date(`2000-01-01T${formatToInputTime(item.endTime)}:00`);
                      return total + ((end - start) / (1000 * 60 * 60));
                    }, 0).toFixed(1)}h
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <User className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-gray-500 text-sm font-medium">Avg Duration</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {availabilityList.length > 0 
                      ? Math.round(availabilityList.reduce((sum, item) => sum + item.appointmentDurationInMinutes, 0) / availabilityList.length)
                      : 0}min
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal */}
        {isModalOpen && (
          <DoctorAvailabilityForm
            onClose={handleCloseModal}
            onSuccess={handleSuccess}
          />
        )}

        {/* Edit Form */}
        {editingAvailability && (
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 mb-8 animate-in slide-in-from-top duration-300">
            <form onSubmit={handleEditSubmit}>
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-blue-100 rounded-lg">
                <Pencil className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Edit Availability</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Day of Week</label>
                <select
                    name="dayOfWeek"
                    value={editingAvailability.dayOfWeek}
                    onChange={handleEditChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 bg-white shadow-sm"
                >
                    {dayNames.map((day, index) => (
                    <option key={index} value={index}>{day}</option>
                    ))}
                </select>
                </div>
                <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Start Time</label>
                <input
                    type="time"
                    name="startTime"
                    value={formatToInputTime(editingAvailability.startTime)}
                    onChange={handleEditChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 shadow-sm bg-white"
                />
                </div>
                <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">End Time</label>
                <input
                    type="time"
                    name="endTime"
                    value={formatToInputTime(editingAvailability.endTime)}
                    onChange={handleEditChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 shadow-sm bg-white"
                />
                </div>
                <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Appointment Duration (mins)</label>
                <input
                    type="number"
                    name="appointmentDurationInMinutes"
                    min="1"
                    value={editingAvailability.appointmentDurationInMinutes}
                    onChange={handleEditChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 shadow-sm bg-white"
                />
                </div>
                <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Buffer Time (mins)</label>
                <input
                    type="number"
                    name="bufferTimeInMinutes"
                    min="0"
                    value={editingAvailability.bufferTimeInMinutes}
                    onChange={handleEditChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 shadow-sm bg-white"
                />
                </div>
            </div>
            
            <div className="flex gap-4 pt-6 mt-6 border-t border-gray-200">
                <Button 
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                >
                Save Changes
                </Button>
                <Button 
                type="button" 
                variant="outline" 
                onClick={() => setEditingAvailability(null)}
                className="px-6 py-3 border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-all duration-200"
                >
                Cancel
                </Button>
            </div>
            </form>
        </div>
        )}
        {/* Table Section */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Day
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Start Time
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      End Time
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Duration</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Buffer</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {availabilityList.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center gap-4">
                        <div className="p-4 bg-gray-100 rounded-full">
                          <Calendar className="w-8 h-8 text-gray-400" />
                        </div>
                        <div>
                          <p className="text-lg font-medium text-gray-900">No availability found</p>
                          <p className="text-gray-500">Start by adding your first availability slot</p>
                        </div>
                      </div>
                    </td>
                  </tr>
                ) : (
                  availabilityList.map((item, index) => (
                    <tr 
                      key={item.availabilityId} 
                      className="hover:bg-gray-50 transition-colors duration-200 group"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${dayColors[item.dayOfWeek]}`}>
                          {dayNames[item.dayOfWeek]}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                          <span className="text-sm font-medium text-gray-900">
                            {formatToInputTime(item.startTime)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                          <span className="text-sm font-medium text-gray-900">
                            {formatToInputTime(item.endTime)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {item.appointmentDurationInMinutes} mins
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                          {item.bufferTimeInMinutes} mins
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex gap-2 opacity-70 group-hover:opacity-100 transition-opacity duration-200">
                          <button
                          onClick={() => handleEditClick(item.availabilityId)}
                          className="group relative p-3 bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-110 transform"
                          title="Edit Item"
                        >
                          <Pencil className="w-5 h-5" />
                          <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 rounded-xl transition-all duration-200"></div>
                        </button>

                        <button
                          onClick={() => confirmDeleteAvailability(item.availabilityId)}
                          className="group relative p-3 bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-110 transform"
                          title="Delete Item"
                        >
                          <Trash2 className="w-5 h-5" />
                          <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 rounded-xl transition-all duration-200"></div>
                        </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Delete Modal */}
        {showDeleteModal && (
          <ConfirmationModal
            message="Are you sure you want to delete this availability?"
            actionLabel="Delete"
            onConfirm={deleteAvailability}
            onCancel={() => setShowDeleteModal(false)}
          />
        )}
      </div>
    </div>
  );
};

export default DoctorAvailabilityTable;