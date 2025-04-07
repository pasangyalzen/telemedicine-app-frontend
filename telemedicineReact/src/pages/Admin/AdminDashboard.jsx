import Sidebar from "../../layouts/Sidebar"; // Adjust path based on project structure
import { Bell, ChevronDown, Settings, LogOut } from "lucide-react"; // Icons
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
    handleLogout(navigate); // Pass navigate as argument to handleLogout
    setShowLogoutModal(false); // Close the modal
  };

  const handleLogoutCancel = () => {
    setShowLogoutModal(false); // Close the modal without doing anything
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
        return <DoctorManagement/>;
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      <Sidebar setSelectedMenu={setSelectedMenu} selectedMenu={selectedMenu} /> {/* Pass selectedMenu to Sidebar */}

      <div className="flex-1 min-h-screen flex flex-col">
        {/* Top Navbar */}
        <div className="bg-primary-dark text-[#65cccc] p-4 flex justify-between items-center border-b border-gray-700">
          <h1 className="text-2xl font-bold">ADMIN DASHBOARD</h1>

          <div className="flex items-center space-x-4">
            {/* Notification */}
            <div className="relative">
              <Bell className="w-6 h-6 text-[#65cccc] hover:text-white cursor-pointer" />
              <span className="absolute top-0 right-0 bg-red-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">3</span>
            </div>

            {/* Admin Dropdown */}
            <div className="relative">
              <button onClick={() => setDropdownOpen(!dropdownOpen)} className="flex bg-primary items-center space-x-2 text-[#65cccc] hover:text-white">
                <span>Admin</span>
                <ChevronDown className="w-4 h-4" />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-40  rounded-lg shadow-lg">
                  <button 
                    onClick={() => setSelectedMenu("SettingsPage")} // Set Settings menu
                    className="block w-full px-4 py-2 text-left hover:bg-primary-light hover:text-white"
                  >
                    <Settings className="w-5 h-5 inline mr-2" />
                    Settings
                  </button>

                  <button 
                    onClick={handleLogoutClick}  // Trigger the logout modal
                    className="block w-full px-4 py-2 text-left hover:bg-primary-light hover:text-white"
                  >
                    <LogOut className="w-5 h-5 inline mr-2" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Stats Boxes or Menu Content */}
        <div className="flex-grow p-6 border border-primary-ligh bg-white">
          {renderSelectedMenu()}
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