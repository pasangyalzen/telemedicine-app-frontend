import Sidebar from "../../layouts/Sidebar"; // Adjust path based on project structure
import { Bell, ChevronDown, Settings, LogOut, User, Search } from "lucide-react"; // Icons
import { useState, useEffect } from "react"; 
import { useNavigate } from "react-router-dom";
import { handleLogout } from "../../services/authService"; // Import the logout function
import ConfirmationModal from "../../components/ConfirmationModal"; // Import the modal

// Components for each section
import UserManagement from "./components/UserManagement";
import DoctorManagement from "./components/DoctorManagement";
import PatientManagement from "./components/PatientManagement";
import PharmacistManagement from "./components/PharmacistManagement";
import AppointmentManagement from "./components/AppointmentManagement";
import PaymentsManagement from "./components/PaymentsManagement";
import ReportsManagement from "./components/ReportsManagement";
import SecuritySettings from "./components/SecuritySettings";
import NotificationsSettings from "./components/NotificationsSettings";
import SettingsPage from "./components/SettingsPage";
import DashboardContent from "./components/DashboardContent";

const AdminDashboard = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false); // For handling the logout modal
  const [selectedMenu, setSelectedMenu] = useState("DoctorManagement"); // Track selected menu
  const navigate = useNavigate(); // useNavigate hook for navigation

  useEffect(() => {
    console.log(`Selected menu: ${selectedMenu}`); // Log selected menu whenever it changes
  }, [selectedMenu]);

  const handleLogoutClick = () => {
    setShowLogoutModal(true); // Show the confirmation modal when logout button is clicked
  };

  const handleLogoutConfirm = () => {
    handleLogout(); 
    localStorage.clear();
    navigate("/");
    setShowLogoutModal(false); // Close the modal
  };

  const handleLogoutCancel = () => {
    setShowLogoutModal(false); // Close the modal without doing anything
  };

  // Function to get page title based on selected menu
  const getPageTitle = () => {
    switch (selectedMenu) {
      case "Dashboard": return "Dashboard Overview";
      case "Users": return "User Management";
      case "Doctors": return "Doctor Management";
      case "Patients": return "Patient Management";
      case "Pharmacists": return "Pharmacist Management";
      case "Appointments": return "Appointment Management";
      case "Payments": return "Payments & Billing";
      case "Reports": return "Reports & Analytics";
      case "Security": return "Security Settings";
      case "Notifications": return "Notification Settings";
      case "Settings": return "System Settings";
      default: return "Doctor Management";
    }
  };

  // Render UI based on selected menu
  const renderSelectedMenu = () => {
    console.log("Rendering selected menu:", selectedMenu);
    switch (selectedMenu) {
      case "Dashboard":
        return <DashboardContent />;
      case "Users":
        return <UserManagement />;
      case "Doctors":
        return <DoctorManagement />;
      case "Patients":
        return <PatientManagement />;
      case "Pharmacists":
        return <PharmacistManagement />;
      case "Appointments":
        return <AppointmentManagement />;
      case "Payments":
        return <PaymentsManagement />;
      case "Reports":
        return <ReportsManagement />;
      case "Security":
        return <SecuritySettings />;
      case "Notifications":
        return <NotificationsSettings />;
      case "Settings":
        return <SettingsPage />;
      default:
        console.log("❌ No match found for:", selectedMenu, "Rendering default: UserManagement");
        return <DashboardContent/>;
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-teal-50">
      <Sidebar setSelectedMenu={setSelectedMenu} selectedMenu={selectedMenu} /> {/* Pass selectedMenu to Sidebar */}

      <div className="flex-1 min-h-screen flex flex-col">
        {/* Top Navbar */}
        <div className="bg-teal-800 shadow-sm px-6 py-4 flex justify-between items-center border-b border-gray-100">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-black">{getPageTitle()}</h1>
          </div>

          {/* Search Bar */}
          {/* <div className="hidden md:flex items-center bg-gray-50 rounded-lg border border-gray-200 px-3 py-2 w-64">
            <Search className="w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search..." 
              className="bg-transparent border-none outline-none ml-2 text-sm w-full"
            />
          </div> */}

          <div className="flex items-center space-x-4">
            {/* Notification */}
            {/* <div className="relative">
              <button className="p-2 bg-teal-600 rounded-full hover:bg-teal-700 transition-colors duration-200">
                <Bell className="w-5 h-5 text-gray-600" />
                <span className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">3</span>
              </button>
            </div> */}

            {/* Admin Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setDropdownOpen(!dropdownOpen)} 
                className="flex bg-teal-50 items-center text-black space-x-2 rounded-full py-1 px-2 hover:bg-teal-100 transition-colors duration-200"
              >
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm font-medium ">Admin</span>
                <ChevronDown className="w-4 h-4 text-gray-800" />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-teal-500 py-1 z-50">
                  <button 
                    onClick={() => {
                      setSelectedMenu("Settings");
                      setDropdownOpen(false);
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm bg-white text-left text-gray-700 hover:bg-teal-100"
                  >
                    <Settings className="w-4 h-4 mr-2 text-gray-500" />
                    Settings
                  </button>

                  <div className="my-1 border-t border-gray-100"></div>

                  <button 
                    onClick={handleLogoutClick}
                    className="flex items-center w-full px-4 py-2 text-sm text-left bg-white text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Stats Boxes or Menu Content */}
        <div className="flex-grow p-6 overflow-auto">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            {renderSelectedMenu()}
          </div>
        </div>
        
        {/* Footer */}
        <div className="bg-white py-3 px-6 border-t border-gray-100">
          <p className="text-xs text-gray-500 text-center">© 2025 Hospital Management System. All rights reserved.</p>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <ConfirmationModal
          message={
            <>
            <p className="mb-2">Are you sure you want to logout?</p>
            <p className="text-sm text-gray-400">You will be redirected to the login page.</p>
            </>
          }
          actionLabel="Logout"
          onConfirm={handleLogoutConfirm}  // Confirm logout action
          onCancel={handleLogoutCancel}   // Cancel logout action
        />
      )}
    </div>
  );
};

export default AdminDashboard;