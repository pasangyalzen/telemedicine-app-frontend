import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useLocation } from "react-router-dom"; // Add this line
import { Link } from "react-router-dom";
import { PATHS } from "../constants/path"; // Import the PATHS object
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
} from "lucide-react";
import ConfirmationModal from "../components/ConfirmationModal"; // Import the modal component
import { handleLogout } from "../services/authService"; // Import the logout function

const Sidebar = ({ setSelectedMenu, selectedMenu }) => {
  const location = useLocation(); // Get current route
  const [isCollapsed, setIsCollapsed] = useState(false); // Sidebar collapse state
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal open state
  const navigate = useNavigate(); // For redirecting after logout
  const [admin, setAdmin] = useState({ name: "", role: "" }); // Admin details state

  // Load admin details from localStorage
  useEffect(() => {
    const storedEmail = localStorage.getItem("email") || "Admin"; // Fallback name
    const storedRole = localStorage.getItem("role") || "Administrator"; // Fallback role
    setAdmin({ name: storedEmail, role: storedRole });
  }, []);


  // Update menuItems to use the PATHS object for routing
  const menuItems = [
    { name: "Dashboard", icon: <LayoutDashboard />, path: PATHS.ADMINDASHBOARD },
    // { name: "Users", icon: <Users />, path: PATHS.USERS },
    { name: "Doctors", icon: <Stethoscope />, path: PATHS.DOCTORS },
    { name: "Patients", icon: <User />, path: PATHS.PATIENTS },
    { name: "Pharmacists", icon: <Pill />, path: PATHS.PHARMACISTS },
    { name: "Appointments", icon: <Calendar />, path: PATHS.APPOINTMENTS },
    //{ name: "Payments", icon: <CreditCard />, path: PATHS.PAYMENTS },
    // { name: "Reports", icon: <BarChart />, path: PATHS.REPORTS },
    // { name: "Security", icon: <Shield />, path: PATHS.SECURITY },
    // { name: "Notifications", icon: <Bell />, path: PATHS.NOTIFICATIONS },
    // { name: "Settings", icon: <Settings />, path: PATHS.SETTINGS },
  ];

  // Function to handle logout
  const handleConfirmLogout = () => {
    handleLogout();
    navigate("/");
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
                onClick={() => setSelectedMenu(item.name)} // Update selected menu when clicked
                className={`flex items-center p-3 rounded-lg hover:bg-primary-light hover:text-white text-[#81e3e3] transition ${selectedMenu === item.name ? "bg-gray-800" : ""
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
          <LogOut className="w-5 h-5 inline mr-2" />
          {!isCollapsed && "Logout"}
        </button>
      </div>

      {/* Logout Confirmation Modal */}
      {isModalOpen && (
        <ConfirmationModal
          message="Are you sure you want to logout?"
          actionLabel="Logout"
          onConfirm={handleConfirmLogout}
          onCancel={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default Sidebar;