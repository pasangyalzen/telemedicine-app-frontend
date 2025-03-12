import Sidebar from "../../components/Sidebar"; // Adjust path based on project structure
import { Users, UserCheck, UserPlus, UserCog, Bell, ChevronDown, Settings, LogOut } from "lucide-react"; // Icons
import { useState } from "react"; 
import { useNavigate } from "react-router-dom";
import { handleLogout } from "../../services/authService"; 

const AdminDashboard = () => {
  const totalUsers = 1000;
  const totalDoctors = 200;
  const totalPatients = 700;
  const totalPharmacists = 100;

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      <Sidebar />

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
              <button onClick={() => setDropdownOpen(!dropdownOpen)} className="flex items-center space-x-2 text-[#65cccc] hover:text-white">
                <span>Admin</span>
                <ChevronDown className="w-4 h-4" />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white text-black rounded-lg shadow-lg">
                  <button 
                    onClick={() => navigate("/admin/settings")} 
                    className="block w-full px-4 py-2 text-left hover:bg-gray-200"
                  >
                    <Settings className="w-5 h-5 inline mr-2" />
                    Settings
                  </button>

                  <button 
                    onClick={() => handleLogout(navigate)} 
                    className="block w-full px-4 py-2 text-left hover:bg-gray-200"
                  >
                    <LogOut className="w-5 h-5 inline mr-2" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Stats Boxes */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 p-6 flex-grow">
          <div className="p-6 bg-white rounded-lg shadow-md flex items-center w-full">
            <Users className="w-10 h-10 text-blue-500 mr-4" />
            <div>
              <h3 className="text-3xl font-semibold text-[#49A78D]">{totalUsers}</h3>
              <span className="text-lg text-gray-600">Total Users</span>
            </div>
          </div>

          <div className="p-6 bg-white rounded-lg shadow-md flex items-center w-full">
            <UserCheck className="w-10 h-10 text-green-500 mr-4" />
            <div>
              <h3 className="text-3xl font-semibold text-[#49A78D]">{totalDoctors}</h3>
              <span className="text-lg text-gray-600">Total Doctors</span>
            </div>
          </div>

          <div className="p-6 bg-white rounded-lg shadow-md flex items-center w-full">
            <UserPlus className="w-10 h-10 text-yellow-500 mr-4" />
            <div>
              <h3 className="text-3xl font-semibold text-[#49A78D]">{totalPatients}</h3>
              <span className="text-lg text-gray-600">Total Patients</span>
            </div>
          </div>

          <div className="p-6 bg-white rounded-lg shadow-md flex items-center w-full">
            <UserCog className="w-10 h-10 text-purple-500 mr-4" />
            <div>
              <h3 className="text-3xl font-semibold text-[#49A78D]">{totalPharmacists}</h3>
              <span className="text-lg text-gray-600">Total Pharmacists</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;