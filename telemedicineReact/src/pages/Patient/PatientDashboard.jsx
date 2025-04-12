import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Calendar, Clock, FileText, User, Settings, LogOut, ChevronDown, Menu, X } from 'lucide-react';
import TodayAppointments from './components/TodayPatientAppointment';
import UpcomingAppointments from './components/UpcomingPatientAppointment';
import PastAppointments from './components/PastPatientAppointment';
import PrescriptionDetails from './components/PrescriptionDetails';
import ConsultationDetails from './components/ConsultationDetails';

const ConfirmationModal = ({ message, actionLabel, onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 min-h-screen w-full bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold mb-4">{message}</h3>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            {actionLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

const PatientDashboard = () => {
  const [activeTab, setActiveTab] = useState('today');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const navigate = useNavigate();
  
  // Mock patient ID - in a real app this would come from authentication context
  const patientId = "12345";

  // Mock patient details - in a real app these would come from API or auth context
  const patientDetails = {
    name: "John Doe",
    email: "john.doe@example.com",
    patientId: patientId
  };

  const handleLogout = () => {
    // Clear token from localStorage
    localStorage.removeItem('token');
    // Redirect to login page
    navigate('/login');
  };

  const menuItems = [
    { id: 'today', label: 'Today\'s Appointments', icon: <Clock className="w-5 h-5" /> },
    { id: 'upcoming', label: 'Upcoming Appointments', icon: <Calendar className="w-5 h-5" /> },
    { id: 'past', label: 'Consultation History', icon: <FileText className="w-5 h-5" /> },
    { id: 'profile', label: 'My Profile', icon: <User className="w-5 h-5" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-5 h-5" /> },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'today':
        return <TodayAppointments patientId={patientId} />;
      case 'upcoming':
        return <UpcomingAppointments patientId={patientId} />;
      case 'past':
        return <PastAppointments patientId={patientId} />;
      case 'profile':
        return (
          <div className="p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">My Profile</h2>
            <p className="text-gray-600">Profile content would go here.</p>
          </div>
        );
      case 'settings':
        return (
          <div className="p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Settings</h2>
            <p className="text-gray-600">Settings content would go here.</p>
          </div>
        );
      default:
        return <TodayAppointments patientId={patientId} />;
    }
  };

  return (
    <div className="fixed inset-0 w-full h-screen bg-gray-100 overflow-hidden">
      {/* Mobile sidebar backdrop */}
      {showMobileSidebar && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setShowMobileSidebar(false)}
        />
      )}

      {/* Sidebar */}
      <div 
        className={`fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-200 z-30 transform ${
          showMobileSidebar ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 transition-transform duration-200 ease-in-out`}
      >
        <div className="flex flex-col h-full">
          <div className="p-5 border-b border-gray-200 bg-teal-600 text-white">
            <h1 className="text-xl font-bold">TeleChauki</h1>
            <p className="text-sm text-teal-100">Patient Portal</p>
          </div>
          
          {/* Patient Details Section */}
          <div className="p-4 border-b border-gray-200 bg-teal-50">
            <div className="flex items-center mb-2">
              <div className="w-10 h-10 bg-teal-200 rounded-full flex items-center justify-center mr-3">
                <User className="w-6 h-6 text-teal-700" />
              </div>
              <div>
                <h3 className="font-medium text-teal-800">{patientDetails.name}</h3>
                <p className="text-xs text-teal-600">{patientDetails.email}</p>
              </div>
            </div>
            <div className="mt-2 pt-2 border-t border-teal-200">
              <p className="text-xs text-teal-600">
                <span className="font-semibold">Patient ID:</span> {patientDetails.patientId}
              </p>
            </div>
          </div>
          
          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-2">
              {menuItems.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => {
                      setActiveTab(item.id);
                      setShowMobileSidebar(false);
                    }}
                    className={`w-full flex items-center px-4 py-3 rounded-lg text-left transition ${
                      activeTab === item.id
                        ? 'bg-teal-100 text-teal-800 font-medium'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <span className={`mr-3 ${activeTab === item.id ? 'text-teal-700' : 'text-gray-500'}`}>
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          <div className="p-4 border-t border-gray-200">
            <button
              onClick={() => setShowLogoutModal(true)}
              className="w-full flex items-center px-4 py-3 bg-red-50 text-red-700 hover:bg-red-100 rounded-lg"
            >
              <LogOut className="w-5 h-5 mr-3 text-red-600" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col w-full h-full lg:pl-64">
        {/* Top Navigation */}
        <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 lg:px-6 sticky top-0 z-10">
          <div className="flex items-center">
            <button
              className="text-gray-600 lg:hidden mr-4"
              onClick={() => setShowMobileSidebar(!showMobileSidebar)}
            >
              {showMobileSidebar ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
            <h1 className="text-xl font-semibold text-teal-700 lg:hidden">TeleChauki</h1>
          </div>
          
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 focus:outline-none"
            >
              <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-teal-700" />
              </div>
              <span className="hidden md:inline-block">Patient</span>
              <ChevronDown className="w-4 h-4" />
            </button>
            
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50">
                <button
                  onClick={() => {
                    setActiveTab('profile');
                    setShowUserMenu(false);
                  }}
                  className="flex items-center w-full px-4 py-3 text-left text-gray-700 hover:bg-gray-50"
                >
                  <User className="w-4 h-4 mr-2" />
                  My Profile
                </button>
                <div className="border-t border-gray-200"></div>
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    setShowLogoutModal(true);
                  }}
                  className="flex items-center w-full px-4 py-3 text-left text-red-600 hover:bg-red-50"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6 bg-gray-50 w-full">
          {renderContent()}
        </main>
      </div>

      {/* Logout Confirmation Modal */}
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
    </div>
  );
};

export default PatientDashboard;