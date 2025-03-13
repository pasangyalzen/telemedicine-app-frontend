import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Stethoscope,
  User,
  Pill,
  Calendar,
  CreditCard,
  BarChart,
  Shield,
  Bell,
  Settings,
  LogOut,
  Menu,
  X,
  UserCircle,
} from "lucide-react"; // Import icons
import { handleLogout } from "../services/authService"; // Assuming authService is in services folder
import ConfirmationModal from "../components/ConfirmationModal"; // Import ConfirmationModal

const Sidebar = () => {
  const location = useLocation(); // Get current route
  const [isCollapsed, setIsCollapsed] = useState(false); // Sidebar collapse state
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal open state
  const navigate = useNavigate(); // For redirecting after logout

  // Placeholder for admin details (Replace with real data later)
  const admin = { name: "Admin Name", role: "Administrator" };

  const menuItems = [
    { name: "Dashboard", icon: <LayoutDashboard />, path: "/admin/dashboard" },
    { name: "Users", icon: <Users />, path: "/admin/users" },
    { name: "Doctors", icon: <Stethoscope />, path: "/admin/doctors" },
    { name: "Patients", icon: <User />, path: "/admin/patients" },
    { name: "Pharmacists", icon: <Pill />, path: "/admin/pharmacists" },
    { name: "Appointments", icon: <Calendar />, path: "/admin/appointments" },
    { name: "Payments", icon: <CreditCard />, path: "/admin/payments" },
    { name: "Reports", icon: <BarChart />, path: "/admin/reports" },
    { name: "Security", icon: <Shield />, path: "/admin/security" },
    { name: "Notifications", icon: <Bell />, path: "/admin/notifications" },
    { name: "Settings", icon: <Settings />, path: "/admin/settings" },
  ];

  // Function to handle logout
  const handleConfirmLogout = () => {
    handleLogout(navigate); // Call handleLogout function here
    setIsModalOpen(false); // Close the modal after logout
  };

  return (
    <div
      className={`h-screen ${isCollapsed ? "w-16" : "w-64"} bg-primary-dark text-[#65cccc] flex flex-col transition-all duration-300`}
    >
      {/* Sidebar Header */}
      <div className="p-4 flex justify-between items-center border-b border-gray-700">
        {!isCollapsed && <h1 className="text-2xl font-bold">TELECHAUKI</h1>}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="text-[#65cccc] bg-primary-light hover:text-white hover:bg-[#49cccc]"
        >
          {isCollapsed ? <Menu size={18} /> : <X size={18} />}
        </button>
      </div>

      {/* Admin Profile Section */}
      <div className="flex items-center space-x-3 p-4 border-b border-gray-700">
        <UserCircle className="w-10 h-10 text-white" /> {/* Placeholder Avatar */}
        {!isCollapsed && (
          <div>
            <p className="text-sm font-semibold">{admin.name}</p>
            <p className="text-xs text-gray-400">{admin.role}</p>
          </div>
        )}
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.name}>
              <Link
                to={item.path}
                className={`flex items-center p-3 rounded-lg hover:bg-primary-light hover:text-white text-[#81e3e3] transition ${
                  location.pathname === item.path ? "bg-gray-800" : ""
                }`}
              >
                <span className="w-6 h-6">{item.icon}</span>
                {!isCollapsed && <span className="ml-3">{item.name}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-gray-700">
        <button
          onClick={() => setIsModalOpen(true)} // Open the confirmation modal on click
          className="w-full flex items-center justify-center p-3 bg-[#49cccc] text-primary-dark rounded-lg hover:bg-[#49ccccd7] hover:text-white transition"
        >
          <LogOut className="w-5 h-5" />
          {!isCollapsed && <span className="ml-3">Logout</span>}
        </button>
      </div>

      {/* Confirmation Modal */}
      {isModalOpen && (
        <ConfirmationModal
          message={
            <>
            <p className = "mb-2">Are you sure you want to logout?</p>
            <p className="text-sm text-gray-400">You will be redirected to the login page.</p>
            </>
          }
          actionLabel="Logout"
          onConfirm={handleConfirmLogout}
          onCancel={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default Sidebar;