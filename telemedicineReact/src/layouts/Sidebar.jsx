import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import { PATHS } from "../constants/path";
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
  ChevronRight
} from "lucide-react";
import ConfirmationModal from "../components/ConfirmationModal";
import { handleLogout } from "../services/authService";

const Sidebar = ({ setSelectedMenu, selectedMenu }) => {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const [admin, setAdmin] = useState({ name: "", role: "" });

  useEffect(() => {
    const storedEmail = localStorage.getItem("email") || "Admin";
    const storedRole = localStorage.getItem("role") || "Administrator";
    setAdmin({ name: storedEmail, role: storedRole });
  }, []);

  const menuItems = [
    { name: "Dashboard", icon: <LayoutDashboard />, path: PATHS.ADMINDASHBOARD },
    { name: "Doctors", icon: <Stethoscope />, path: PATHS.DOCTORS },
    { name: "Patients", icon: <User />, path: PATHS.PATIENTS },
    { name: "Pharmacists", icon: <Pill />, path: PATHS.PHARMACISTS },
    { name: "Appointments", icon: <Calendar />, path: PATHS.APPOINTMENTS },
  ];

  const handleConfirmLogout = () => {
    handleLogout();
    navigate("/");
    setIsModalOpen(false);
  };

  return (
    <div
      className={`h-screen ${
        isCollapsed ? "w-20" : "w-72"
      } bg-gradient-to-b from-teal-800 to-[#0a1f30] text-white flex flex-col transition-all duration-300 shadow-xl`}
    >
      {/* Sidebar Header */}
      <div className="px-6 py-8 flex justify-between items-center border-b border-opacity-20 border-[#65cccc]">
        {!isCollapsed && (
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#65cccc] to-[#49cccc]">
            TELECHAUKI
          </h1>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="text-[#65cccc] hover:text-white p-2 rounded-full hover:bg-[#1d3b4d] transition-all duration-200"
        >
          {isCollapsed ? <Menu size={22} /> : <X size={22} />}
        </button>
      </div>

      {/* Admin Profile Section */}
      <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-start space-x-3'} p-6 border-b border-opacity-20 border-[#65cccc]`}>
        <div className="relative">
          <UserCircle className="w-12 h-12 text-[#65cccc]" />
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#123456]"></div>
        </div>
        {!isCollapsed && (
          <div>
            <p className="font-semibold text-[#65cccc]">{admin.name}</p>
            <p className="text-xs text-[#65cccc80]">{admin.role}</p>
          </div>
        )}
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-6 overflow-y-auto scrollbar-hide">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const isActive = selectedMenu === item.name;
            return (
              <li key={item.name}>
                <Link
                  to={item.path}
                  onClick={() => setSelectedMenu(item.name)}
                  className={`flex items-center py-3 px-4 rounded-xl transition-all duration-200 group ${
                    isActive 
                      ? "bg-[#65cccc] text-[#0a1f30] font-medium" 
                      : "text-[#81e3e3] hover:bg-[#1d3b4d] hover:text-white"
                  }`}
                >
                  <div className={`${isActive ? "text-[#0a1f30]" : "text-[#65cccc]"} ${isCollapsed ? "mx-auto" : ""}`}>
                    {item.icon}
                  </div>
                  {!isCollapsed && (
                    <>
                      <span className="ml-4">{item.name}</span>
                      <ChevronRight 
                        className={`w-5 h-5 ml-auto opacity-0 group-hover:opacity-100 transition-opacity ${isActive ? "opacity-100" : ""}`} 
                      />
                    </>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout Button */}
      <div className="p-6 border-t border-opacity-20 border-[#65cccc]">
        <button
          onClick={() => setIsModalOpen(true)}
          className={`w-full flex items-center ${isCollapsed ? "justify-center" : "justify-between"} p-3 bg-gradient-to-r from-[#49cccc] to-[#65cccc] text-[#0a1f30] rounded-xl font-medium hover:shadow-lg hover:from-[#3dbdbd] hover:to-[#54bcbc] transition-all duration-200`}
        >
          <div className="flex items-center">
            <LogOut className="w-5 h-5" />
            {!isCollapsed && <span className="ml-3">Logout</span>}
          </div>
          {!isCollapsed && <ChevronRight className="w-5 h-5" />}
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