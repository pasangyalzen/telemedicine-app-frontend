import useDoctorDashboard from "../../hooks/useDoctorDashboard";
import PatientQueue from "./ui/PatientQueue";
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from "react";
import DoctorDashboardHome from "./components/DoctorDashboardHome";
import UpcomingAppointments from "./components/UpcomingAppointments";
import ConfirmationModal from "../../components/ConfirmationModal";
import { ChevronDown, Settings, LogOut, Home, Calendar, Clock, User, Menu, RefreshCw, AlertCircle, CalendarIcon } from 'lucide-react';
import RescheduleForm from "./components/RescheduleForm";
import PendingConsultations from "./components/PendingConsultation";
import { getEmailFromToken } from "../auth/auth";
import { DoctorRegisterModal } from "./components/AppointmentSummary";
import DoctorAvailabilityTable from "./components/DoctorAvailabilityTable";
import { getDoctorIdByEmail } from "./services/doctorAppointmentApi";



export default function DoctorWaitingRoomDashboard() {
  const {
    appointments,
    appointmentToReschedule,
    setAppointmentToCancel,
    showForm,
    handleRescheduleButtonClick,
    handleCancelClick,
    handleRescheduleSubmit,
    setShowForm,
    setAppointmentToReschedule,
    showCancelModal,
    setShowCancelModal,
    handleCancelAppointment,
    appointmentToCancel,
    patients,
    inviteLink,
  } = useDoctorDashboard();
  
  useEffect(() => {
    console.log("GGGGGGGGGGGGGG:", showForm);
    console.log("KKKKKKKKKKKKKK:", appointmentToReschedule);
  }, [showForm, appointmentToReschedule]);
  
  
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [doctorId, setDoctorId] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [accountdropdownOpen, setAccountDropdownOpen] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [showRescheduleForm, setShowRescheduleForm] = useState(false);
  const email = getEmailFromToken();
  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  

  useEffect(() => {
  const fetchDoctorId = async () => {
    try {
      const email = getEmailFromToken();
      const id = await getDoctorIdByEmail(email);
      if (id) {
        setDoctorId(id);
      }
    } catch (error) {
      console.error("Failed to fetch doctorId:", error);
    }
  };

  fetchDoctorId();
}, []);
  
  const navigate = useNavigate();
  const [selectedMenu, setSelectedMenu] = useState("dashboard");
  // If your hook provides a function to close the form
  const handleCloseRescheduleForm = () => {
    // Use the hook's function if available
    if (typeof setShowForm === 'function') {
      setShowForm(false);
      setAppointmentToReschedule(null); // Also reset the appointment
    }
};
  
  const handleLogout = () => {
    localStorage.clear();
    console.log("Logging out... Redirecting to login page.");
    navigate("/login");
  };

  // Function to retry loading data
  const handleRetryLoading = () => {
    // Implement your retry logic here
    console.log("Retrying to load appointments...");
    // You could call a function from your hook to reload the data
    // For example: reloadAppointments();
    window.location.reload(); // Simple reload as fallback
  };
  
  return (
    <div className="h-screen w-screen flex flex-col bg-gray-50">
      {/* Top Navigation Bar */}
      <div className="w-full bg-gradient-to-r from-teal-700 to-teal-600 text-white px-6 py-4 shadow-md flex items-center justify-between relative">
        {/* Left side - Logo and Mobile Menu Toggle */}
        <div className="flex items-center">
          <button 
            className="mr-4 block md:hidden" 
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          >
            <Menu className="w-6 h-6" />
          </button>
          <span className="text-2xl font-semibold tracking-wider">TELECHAUKI</span>
        </div>

        {/* Right side - Account Options */}
        <div className="relative">
          <button 
            onClick={() => setAccountDropdownOpen(!accountdropdownOpen)} 
            className="flex items-center space-x-2 text-black bg-teal-100 hover:bg-teal-200 px-4 py-2 rounded-lg transition duration-200"
          >
            <User className="w-5 h-5" />
            <span>Doctor</span>
            <ChevronDown className="w-4 h-4" />
          </button>

          {accountdropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl z-50 text-gray-800 border border-gray-200 overflow-hidden">
              {/* <button 
                onClick={() => {
                  setSelectedMenu("SettingsPage");
                  setAccountDropdownOpen(false);
                }} 
                className="flex items-center w-full px-4 py-3 text-left hover:bg-teal-50 transition-colors"
              >
                <Settings className="w-5 h-5 inline mr-3 text-teal-600" />
                <span>Settings</span>
              </button> */}

              <button 
                onClick={() => {
                  setAccountDropdownOpen(false);
                  setShowLogoutModal(true);
                }} 
                className="flex items-center w-full px-4 py-3 text-left bg-white text-red-500  hover:bg-red-500 hover:text-white transition-colors border-t border-gray-100"
              >
                <LogOut className="w-5 h-5 inline mr-3 text-red-600 hover:text-white" />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
      
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar (Left) - Desktop version */}
        <aside className={`${mobileSidebarOpen ? 'block' : 'hidden'} md:block w-full md:w-72 bg-gradient-to-b from-gray-900 to-gray-800 text-white flex flex-col justify-between h-full absolute md:relative z-30 transition-all duration-300`}>
          {/* Patient Queue Section */}
          <div className="flex flex-col h-full">
            <div className="overflow-y-auto flex-grow">
              {/* Patient Queue Component */}
              <div className="p-4">
                <PatientQueue 
                  appointments={appointments}
                  handleRescheduleButtonClick={handleRescheduleButtonClick}
                  handleCancelClick={handleCancelClick}
                  
                />
              </div>

              {/* Navigation Menu */}
              <div className="p-4 border-t border-gray-700">
                <h3 className="text-lg font-medium mb-4 text-teal-300 px-2">Menu</h3>
                <nav className="space-y-2">
                  <button 
                    onClick={() => {
                      setSelectedMenu("dashboard");
                      setMobileSidebarOpen(false);
                    }} 
                    className={`w-full h-12 flex items-center px-4 rounded-lg transition duration-300 ${
                      selectedMenu === "dashboard" 
                        ? "bg-teal-600 text-white" 
                        : "text-gray-300 hover:bg-gray-700"
                    }`}
                  >
                    <Home className="w-5 h-5 mr-3" />
                    <span>Dashboard</span>
                  </button>
                  
                  <button 
                    onClick={() => {
                      setSelectedMenu("upcomingAppointments");
                      setMobileSidebarOpen(false);
                    }} 
                    className={`w-full h-12 flex items-center px-4 rounded-lg transition duration-300 ${
                      selectedMenu === "analytics" 
                        ? "bg-teal-600 text-white" 
                        : "text-gray-300 hover:bg-gray-700"
                    }`}
                  >
                    <Calendar className="w-5 h-5 mr-3" />
                    <span>Upcoming Appointments</span>
                  </button>
                  
                  <button 
                    onClick={() => {
                      console.log("Setting selectedMenu to meetingHistory");
                      setSelectedMenu("pendingConsultations");
                      setMobileSidebarOpen(false);
                    }} 
                    className={`w-full h-12 flex items-center px-4 rounded-lg transition duration-300 ${
                      selectedMenu === "pendingConsultations" 
                        ? "bg-teal-600 text-white" 
                        : "text-gray-300 hover:bg-gray-700"
                    }`}
                  >
                    <Clock className="w-5 h-5 mr-3" />
                    <span>Pending Consultations</span>
                  </button>
                  {/* Availability */}
                  <button 
                    onClick={() => {
                      setSelectedMenu("availability");
                      setMobileSidebarOpen(false);
                    }} 
                    className={`w-full h-12 flex items-center px-4 rounded-lg transition duration-300 ${
                      selectedMenu === "availability" 
                        ? "bg-teal-600 text-white" 
                        : "text-gray-300 hover:bg-gray-700"
                    }`}
                  >
                    <CalendarIcon className="w-5 h-5 mr-3" />
                    <span>Availability</span>
                  </button>
                </nav>
              </div>
            </div>

            {/* Doctor Info Section */}
            <div className="p-4 border-t border-gray-700 bg-gray-800">
              <div className="flex items-center space-x-3 p-2">
                <div className="w-10 h-10 rounded-full bg-teal-600 flex items-center justify-center text-white font-bold">
                  {email && email.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm text-white font-medium truncate max-w-[150px]">{email}</p>
                  <p className="text-xs text-gray-400">Doctor</p>
                </div>
              </div>
              

            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col p-6 overflow-y-auto bg-gradient-to-br from-teal-200 via-white to-cyan-50">
          {selectedMenu === "dashboard" && (
            <DoctorDashboardHome
              inviteLink={inviteLink}
              dropdownOpen={dropdownOpen}
              toggleDropdown={toggleDropdown}
              onDoctorNotFound={() => setShowRegisterModal(true)}
            />
          )}

          {selectedMenu === "upcomingAppointments" && (
              <UpcomingAppointments appointments={appointments} />
            )}

          {selectedMenu === "pendingConsultations" && <PendingConsultations />}
          {selectedMenu === "availability" && (
            <DoctorAvailabilityTable doctorId={doctorId} /> // <-- Replace with your actual component name
          )}
        </div>
      </div>
      

      {/* Modals */}
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
            appointmentId={appointmentToReschedule?.appointmentId}
            onClose={() => {
              console.log("Closing form from DoctorWaitingRoomDashboard");
              setShowForm(false);
              setAppointmentToReschedule(null);
            }}
            onRescheduleSuccess={(appointmentId, newDate) => {
              console.log("Rescheduling successful");
              handleRescheduleSubmit(appointmentId, newDate);
              setShowForm(false);
              setAppointmentToReschedule(null);
            }}
          />
        </div>
      </div>
    )}
      
      {/* Confirmation Modal for Appointment Cancellation */}
      {showCancelModal && appointmentToCancel && (
        <ConfirmationModal
          message="Are you sure you want to cancel this appointment?"
          actionLabel="Cancel Appointment"
          onConfirm={() => handleCancelAppointment(appointmentToCancel)}
          onCancel={() => {
            console.log("Cancel appointment action was aborted");
            setShowCancelModal(false);
            setAppointmentToCancel(null);
          }}
        />
      )}
      
      {/* Overlay for mobile sidebar */}
      {mobileSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}
      
      {showRegisterModal && (
        <DoctorRegisterModal
          email={email}
          password={localStorage.getItem("password")}
          userId={localStorage.getItem("id")}
          onClose={() => setShowRegisterModal(false)}
        />
      )}
    </div>
  );
}