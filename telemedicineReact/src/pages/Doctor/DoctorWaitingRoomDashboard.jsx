  import { Link } from "react-router-dom";
  import useDoctorDashboard from "../../hooks/useDoctorDashboard";
  import PatientQueue from "./ui/PatientQueue";
  import { useNavigate } from 'react-router-dom';
  import { useState, useEffect } from "react";
  import DoctorDashboardHome from "./components/DoctorDashboardHome";
  import DoctorAnalytics from "./components/DoctorAppointments";
  import DoctorMeetingHistory from "./components/DoctorMeetingHistory";
  import VideoPreview from "./components/VideoPreview";
  import ConfirmationModal from "../../components/ConfirmationModal";
  import { ChevronDown, Settings, LogOut } from "lucide-react";
  import RescheduleForm from "./components/RescheduleForm";
  export default function DoctorWaitingRoomDashboard() {
    const {
      appointments,
      appointmentToReschedule,
      showForm,
      handleRescheduleButtonClick,
      handleRescheduleSubmit,
      setShowForm,
      setAppointmentToReschedule,
      patients,
      inviteLink,
    } = useDoctorDashboard();
    
    useEffect(() => {
      console.log("Updated fadsfasstate in DoctorWaitingRoom - showForm:", showForm);
      console.log("Updated dsfadstate in DoctorWaitingRoom - appointmentToReschedule:", appointmentToReschedule);
    }, [showForm, appointmentToReschedule]);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [dropdownOpen,setDropdownOpen] = useState(false);
    const [accountdropdownOpen, setAccountDropdownOpen] = useState(false);
    const toggleDropdown = () => {
      setDropdownOpen((prev) => !prev);
    };
    const navigate = useNavigate();
    const [selectedMenu, setSelectedMenu] = useState("dashboard");
    const handleLogout = () => {
      // Clear the localStorage
      localStorage.clear();
    
      console.log("Logging out... Redirecting to login page.");
    
      // Navigate to the login page
      navigate("/login");  // This should work if PATHS.LOGIN is defined correctly
    };
    
    return (
      <div className="h-screen w-screen flex flex-col">

        {/* Inside the top bar */}
        <div className="w-full bg-black text-[#65cccc] px-6 py-4 text-xl font-light border-b border-white flex items-center justify-between relative">
          {/* Left side logo */}
          <span>TELECHAUKI</span>

          {/* Settings Dropdown */}
          <div className="relative">
            <button 
              onClick={() => setAccountDropdownOpen(!accountdropdownOpen)} 
              className="flex items-center space-x-2 text-[#65cccc] hover:text-white bg-primary px-3 py-2 rounded transition duration-200"
            >
              <span>Doctor</span>
              <ChevronDown className="w-4 h-4" />
            </button>

            {accountdropdownOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg z-50 text-black">
                <button 
                  onClick={() => {
                    setSelectedMenu("SettingsPage");
                    setAccountDropdownOpen(false);
                  }} 
                  className="block w-full px-4 py-2 text-left hover:bg-primary-light hover:text-white"
                >
                  <Settings className="w-5 h-5 inline mr-2" />
                  Settings
                </button>

                <button 
                  onClick={() => {
                    setAccountDropdownOpen(false);
                    setShowLogoutModal(true);
                  }} 
                  className="block w-full px-4 py-2 text-left hover:bg-primary-light hover:text-white"
                >
                  <LogOut className="w-5 h-5 inline mr-2" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-1 overflow-hidden">
        {/* Sidebar (Left) */}
        <aside className="w-64 bg-black text-primary-light flex flex-col justify-between h-full">
          <div>
            {/* <h2 className="text-2xl font-light p-4 border-b text-[#65cccc] border-white">TELECHAUKI</h2> */}

            {/* Patient Queue Component */}
            <PatientQueue 
              appointments={appointments}
              handleRescheduleButtonClick={handleRescheduleButtonClick}
            />

            {/* General Navigation */}
            <div className="p-4 border-t border-white">
              <h3 className="text-lg font-light mb-2 text-[#65cccc]">General</h3>
              <nav className="space-y-2">
              <button 
                onClick={() => setSelectedMenu("dashboard")} 
                className={`w-full h-12 flex items-center justify-center font-extralight rounded transition duration-300 ease-in-out transform ${selectedMenu === "dashboard" ? "text-white bg-teal-600" : "text-gray-400 hover:bg-teal-500"} hover:text-white hover:scale-105`}
              >
                Dashboard
              </button>
              <button 
                onClick={() => setSelectedMenu("analytics")} 
                className={`w-full h-12 flex items-center justify-center font-extralight rounded transition duration-300 ease-in-out transform ${selectedMenu === "analytics" ? "text-white bg-teal-600" : "text-gray-400 hover:bg-teal-500"} hover:text-white hover:scale-105`}
              >
                Appointments
              </button>
              <button 
                onClick={() => setSelectedMenu("meetingHistory")} 
                className={`w-full h-12 flex items-center justify-center font-extralight rounded transition duration-300 ease-in-out transform ${selectedMenu === "meetingHistory" ? "text-white bg-teal-600" : "text-gray-400 hover:bg-teal-500"} hover:text-white hover:scale-105`}
              >
                Meeting History
              </button>
            </nav>
            </div>
          </div>

          {/* My Account (Bottom) */}
          {/* My Account (Bottom) */}
          {/* Bottom Sidebar Section */}
          <div className="p-4 border-t border-gray-700">
            {/* Doctor Info */}
            <div className="flex items-center space-x-3 mb-4">
              {/* <img
                src={"doctor.profileImage" || "/default-avatar.png"}
                alt="Doctor Avatar"
                className="w-10 h-10 rounded-full object-cover"
              /> */}
              <div>
                <p className="text-sm text-white font-medium">Lakpa Sherpa</p>
                <p className="text-xs text-gray-400">Doctor</p>
              </div>
            </div>

            {/* Logout Button */}
            <button
              onClick={() => setShowLogoutModal(true)}
              className="block w-full px-4 py-2 text-left hover:bg-primary-light hover:text-white"
            >
              Logout
            </button>
          </div>
        </aside>

        {/* Main Content (Middle Section) */}
        <div className="flex-1 flex flex-col p-6 bg-gray-100">
        {selectedMenu === "dashboard" && (
          <DoctorDashboardHome
            inviteLink={inviteLink}
            dropdownOpen={dropdownOpen}
            toggleDropdown={toggleDropdown}
          />
        )}

        {selectedMenu === "analytics" && <DoctorAnalytics />}

        {selectedMenu === "meetingHistory" && <DoctorMeetingHistory />}

        {/* Bottom Row - 4 Columns */}
        {/* <div className="grid grid-cols-4 gap-4 text-sm font-light mt-auto">
          {["Edit Waiting Room", "Account Settings", "Suggest Improvement", "Telehealth Shop"].map((item, index) => (
            <div key={index} className="bg-[#49cccc] p-4 text-gray-200 rounded-lg shadow text-center hover:bg-[#49cccc] hover:text-white cursor-pointer">
              <h3 className="font-semibold">{item}</h3>
            </div>
          ))}
        </div> */}
      </div>
        {/* Rightmost Video Section */}
        <div className="w-1/3 bg-white shadow-lg flex flex-col p-6 h-full">
          {/* Video Placeholder */}
          <div className="flex-grow w-full bg-black rounded overflow-hidden">
          <VideoPreview />
        </div>

          {/* Precall Test Button */}
          <button className="w-full mt-auto px-6 py-3 bg-[#65cccc] text-white rounded-md hover:bg-[#45cccc]">
            Precall Test
          </button>
        </div>
        </div>
        {showLogoutModal && (
        <ConfirmationModal
          message="Are you sure you want to logout?"
          actionLabel="Logout"
          onConfirm={handleLogout}
          onCancel={() => {
            console.log("Logout cancelled");
            setShowLogoutModal(false);
          }}
          
        />
        
      )}
      {showForm && appointmentToReschedule && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
          <RescheduleForm
            appointmentId={appointmentToReschedule.appointmentId}
            onSubmit={handleRescheduleSubmit}
            onCancel={() => {
              setShowForm(false);
              setAppointmentToReschedule(null);
            }}
          />
        </div>
      </div>
    )}
      </div>
    );
  }