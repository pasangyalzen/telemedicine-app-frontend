import React, { useEffect, useState } from "react";
import axios from "axios";
import { 
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from "recharts";
import { Users, UserCheck, UserPlus, Stethoscope, Calendar, Activity, Pill } from "lucide-react";

const API_URL = "http://localhost:5186/api";

// Axios instance to configure headers
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${localStorage.getItem("token")}`, // Add token for authentication
  },
});

const UserManagement = () => {
  const [dashboardCounts, setDashboardCounts] = useState(null);
  const [appointmentStatuses, setAppointmentStatuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pie');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [dashboardRes, statusRes] = await Promise.all([
          apiClient.get("/Admin/Account/GetDashboardCounts"),
          apiClient.get("/Admin/Account/appointment-status-counts")
        ]);

        setDashboardCounts(dashboardRes.data);
        setAppointmentStatuses(statusRes.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Prepare data for user distribution chart
  const prepareUserChartData = () => {
    if (!dashboardCounts) return [];
    
    return [
      { name: 'Doctors', value: dashboardCounts.totalDoctors },
      { name: 'Patients', value: dashboardCounts.totalPatients },
      { name: 'Pharmacists', value: dashboardCounts.totalPharmacists }
    ];
  };

  // Colors for charts
  const COLORS = ['#4F46E5', '#16A34A', '#F59E0B', '#8B5CF6', '#EC4899', '#06B6D4'];

  // Prepare data for appointment status chart
  const prepareAppointmentStatusData = () => {
    return appointmentStatuses.map((status, index) => ({
      name: status.status,
      value: status.count,
      fill: COLORS[index % COLORS.length]
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  // Get status color based on status name
  const getStatusColor = (status) => {
    const statusMap = {
      'Scheduled': 'bg-blue-600',
      'Completed': 'bg-green-600',
      'Cancelled': 'bg-red-600',
      'Pending': 'bg-yellow-600',
      'In Progress': 'bg-purple-600',
      'No Show': 'bg-gray-600'
    };
    
    return statusMap[status] || 'bg-gray-600';
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800">Dashboard Overview</h2>
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="flex">
              <button 
                className={`px-4 py-2 ${activeTab === 'pie' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'}`}
                onClick={() => setActiveTab('pie')}
              >
                Pie Chart
              </button>
              <button 
                className={`px-4 py-2 ${activeTab === 'bar' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'}`}
                onClick={() => setActiveTab('bar')}
              >
                Bar Chart
              </button>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md overflow-hidden border-l-4 border-blue-500">
            <div className="flex p-5">
              <div className="mr-4">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <Users size={24} className="text-blue-600" />
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Total Users</p>
                <p className="text-2xl font-bold text-gray-800">{dashboardCounts.totalUsers}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md overflow-hidden border-l-4 border-green-500">
            <div className="flex p-5">
              <div className="mr-4">
                <div className="bg-green-100 p-3 rounded-lg">
                  <Stethoscope size={24} className="text-green-600" />
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Doctors</p>
                <p className="text-2xl font-bold text-gray-800">{dashboardCounts.totalDoctors}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md overflow-hidden border-l-4 border-yellow-500">
            <div className="flex p-5">
              <div className="mr-4">
                <div className="bg-yellow-100 p-3 rounded-lg">
                  <UserPlus size={24} className="text-yellow-600" />
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Patients</p>
                <p className="text-2xl font-bold text-gray-800">{dashboardCounts.totalPatients}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md overflow-hidden border-l-4 border-purple-500">
            <div className="flex p-5">
              <div className="mr-4">
                <div className="bg-purple-100 p-3 rounded-lg">
                  <Pill size={24} className="text-purple-600" />
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Pharmacists</p>
                <p className="text-2xl font-bold text-gray-800">{dashboardCounts.totalPharmacists}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md overflow-hidden border-l-4 border-indigo-500">
            <div className="flex p-5">
              <div className="mr-4">
                <div className="bg-indigo-100 p-3 rounded-lg">
                  <Calendar size={24} className="text-indigo-600" />
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Appointments</p>
                <p className="text-2xl font-bold text-gray-800">{dashboardCounts.totalAppointments}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Chart Section */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">User Distribution</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                {activeTab === 'pie' ? (
                  <PieChart>
                    <Pie
                      data={prepareUserChartData()}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {prepareUserChartData().map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                ) : (
                  <BarChart
                    data={prepareUserChartData()}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" name="Count">
                      {prepareUserChartData().map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                )}
              </ResponsiveContainer>
            </div>
          </div>

          {/* Appointment Statuses Section */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-800">Appointments by Status</h3>
              <div className="bg-indigo-100 px-3 py-1 rounded-full">
                <span className="text-sm font-medium text-indigo-800">
                  Total: {appointmentStatuses.reduce((sum, status) => sum + status.count, 0)}
                </span>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {appointmentStatuses.map((status, index) => (
                <div key={index} className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
                  <div className={`h-2 ${getStatusColor(status.status)}`}></div>
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-500">{status.status}</span>
                      <span className={`h-3 w-3 rounded-full ${getStatusColor(status.status)}`}></span>
                    </div>
                    <p className="text-2xl font-bold text-gray-800">{status.count}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Appointment Status Chart */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">Appointment Status Analysis</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              {activeTab === 'pie' ? (
                <PieChart>
                  <Pie
                    data={prepareAppointmentStatusData()}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {prepareAppointmentStatusData().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              ) : (
                <BarChart
                  data={prepareAppointmentStatusData()}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" name="Count">
                    {prepareAppointmentStatusData().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;