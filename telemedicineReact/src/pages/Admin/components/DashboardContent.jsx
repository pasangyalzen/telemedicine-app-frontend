import React from "react";
import Card from "../../../components/ui/Card"; // ✅ Fixed import
import { Bar, Pie } from "react-chartjs-2";
import Button from "../../../components/Button";
import UserManagement from './UserManagement';
import {
  Users,
  Calendar,
  DollarSign,
  PlusCircle,
  ClipboardList,
} from "lucide-react";

// ✅ Register required Chart.js components
import { Chart as ChartJS, BarElement, ArcElement, CategoryScale, LinearScale } from "chart.js";
ChartJS.register(BarElement, ArcElement, CategoryScale, LinearScale);

const DashboardContent = () => {
  // Dummy Data for Stats
  const stats = [
    { title: "Total Users", value: 500, icon: <Users className="text-blue-500" /> },
    { title: "Total Doctors", value: 120, icon: <Users className="text-green-500" /> },
    { title: "Total Patients", value: 350, icon: <Users className="text-purple-500" /> },
    { title: "Total Appointments", value: 75, icon: <Calendar className="text-yellow-500" /> },
    { title: "Total Revenue ($)", value: "12,500", icon: <DollarSign className="text-teal-500" /> },
  ];

  // Dummy Data for Appointments
  const appointments = [
    { id: 1, doctor: "Dr. John Doe", patient: "Alice", date: "2025-03-17", status: "Pending" },
    { id: 2, doctor: "Dr. Smith", patient: "Bob", date: "2025-03-18", status: "Completed" },
  ];

  // Dummy Data for Recent Activity
  const activities = [
    "Dr. Jane registered as a doctor.",
    "Payment of $50 received from Patient XYZ.",
    "Appointment #2345 was canceled.",
  ];

  // Dummy Data for Revenue Chart
  const revenueData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May"],
    datasets: [{ label: "Revenue ($)", data: [5000, 7000, 12000, 8000, 15000], backgroundColor: "#4CAF50" }],
  };

  // Dummy Data for User Engagement
  const userEngagementData = {
    labels: ["Active", "Inactive"],
    datasets: [{ label: "Users", data: [400, 100], backgroundColor: ["#3498db", "#e74c3c"] }],
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen text-black border-2 border-gray-300">
      {/* Top Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
        {stats.map((stat, index) => (
          <Card key={index} className="p-4 flex items-center justify-between shadow-md">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{stat.title}</h3>
              <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
            </div>
            {stat.icon}
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Appointments */}
        <Card className="col-span-2 p-4 shadow-md">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Appointments Overview</h3>
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-200 text-gray-900">
                <th className="p-2 text-left">Doctor</th>
                <th className="p-2 text-left">Patient</th>
                <th className="p-2 text-left">Date</th>
                <th className="p-2 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appt) => (
                <tr key={appt.id} className="border-b">
                  <td className="p-2 text-gray-800">{appt.doctor}</td>
                  <td className="p-2 text-gray-800">{appt.patient}</td>
                  <td className="p-2 text-gray-800">{appt.date}</td>
                  <td className="p-2">
                    <span
                      className={`px-2 py-1 rounded ${
                        appt.status === "Pending" ? "bg-yellow-300 text-gray-900" : "bg-green-300 text-white"
                      }`}
                    >
                      {appt.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        {/* Recent Activities */}
        <Card className="p-4 shadow-md">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Recent Activities</h3>
          <ul className="space-y-2">
            {activities.map((activity, index) => (
              <li key={index} className="p-2 bg-gray-100 text-gray-800 rounded">{activity}</li>
            ))}
          </ul>
        </Card>

        {/* Revenue Chart */}
        <Card className="p-4 shadow-md">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Revenue Analytics</h3>
          <Bar data={revenueData} />
        </Card>

        {/* User Engagement Chart */}
        <Card className="p-4 shadow-md">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">User Engagement</h3>
          <Pie data={userEngagementData} />
        </Card>
      </div>

      {/* ✅ Quick Actions Section */}
      <div className="mt-6 flex flex-wrap gap-4">
        <Button className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded shadow-md">
          <PlusCircle className="w-5 h-5" />
          Add Doctor
        </Button>
        <Button className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded shadow-md">
          <PlusCircle className="w-5 h-5" />
          Add Patient
        </Button>
        <Button className="flex items-center gap-2 bg-yellow-500 text-white px-4 py-2 rounded shadow-md">
          <ClipboardList className="w-5 h-5" />
          Manage Appointments
        </Button>
      </div>
    </div>
  );
};

export default DashboardContent;