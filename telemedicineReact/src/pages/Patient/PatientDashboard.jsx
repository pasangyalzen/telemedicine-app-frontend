import React, { useState } from 'react';
import { Video, Calendar, Clock, User } from 'lucide-react';
import ConfirmationModal from '../../components/ConfirmationModal'; // Ensure the path is correct
import { useNavigate } from 'react-router-dom';
import useDoctorDashboard from '../../hooks/useDoctorDashboard';
import { FaVideo } from 'react-icons/fa';

const PatientDashboard = () => {
  const [inCall, setInCall] = useState(false);
  const [doctorJoined, setDoctorJoined] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const {
    handleJoinRoom,
    getEmailFromToken,
  } = useDoctorDashboard();

  

  

  const navigate = useNavigate();

  const appointment = {
    doctorName: "Dr. Sarah Johnson",
    doctorSpecialty: "Cardiologist",
    date: "April 7, 2025",
    time: "11:30 AM",
    duration: "30 minutes",
    reason: "Follow-up consultation"
  };

  const startCall = () => {
    setInCall(true);
    setTimeout(() => {
      setDoctorJoined(true);
    }, 5000);
  };

  const endCall = () => {
    setInCall(false);
    setDoctorJoined(false);
  };

  const handleLogout = () => {
    localStorage.clear(); // Clears all data stored in local storage
    navigate("/"); // Redirect to the login page
  };

  const handleLogoutConfirm = () => {
    setShowLogoutModal(false);
    handleLogout();
  };

  const handleLogoutCancel = () => {
    setShowLogoutModal(false);
  };

  return (
    <div className="flex flex-col bg-gray-50 min-h-screen w-screen">
      {/* Header */}
      <header className="bg-teal-600 py-4 px-6 shadow w-full flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">TeleChauki</h1>
        <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          const email = "P@gmail.com" // Extract email from the token
                          const appointmentId = 2036; // Extract the appointment ID
                         
        
                          if (email && appointmentId) {
                            handleJoinRoom({ email, room: appointmentId }); // Join room with the email and appointmentId
                          } else {
                            console.error("Error: Missing email or appointmentId");
                          }
                        }}
                        className="flex items-center justify-center px-3 py-1 bg-green-500 text-white text-xs rounded-md hover:bg-green-600 transition-all duration-200 ease-in-out"
                      >
                        <FaVideo className="mr-1" /> Join
                      </a>

        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center text-white font-medium focus:outline-none"
          >
            <User className="mr-2" size={20} />
            <span>Patient</span>
            <svg
              className="ml-1 w-4 h-4 fill-current"
              viewBox="0 0 20 20"
            >
              <path d="M5.25 7.5L10 12.25L14.75 7.5H5.25Z" />
            </svg>
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white rounded shadow-lg z-10">
              <ul className="py-2 text-sm text-gray-700">
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Settings</li>
                <li
                  onClick={() => setShowLogoutModal(true)}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-red-600"
                >
                  Logout
                </li>
              </ul>
            </div>
          )}
        </div>
      </header>
      

      {/* Logout Modal */}
      {showLogoutModal && (
        <ConfirmationModal
          message={
            <>
              <p className="mb-2">Are you sure you want to logout?</p>
              <p className="text-sm text-gray-400">You will be redirected to the login page.</p>
            </>
          }
          actionLabel="Logout"
          onConfirm={handleLogoutConfirm}
          onCancel={handleLogoutCancel}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto w-full">
        <div className="w-full px-6 py-6">
          {/* Appointment Card */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Appointment Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center">
                  <User className="text-blue-600 mr-2" size={20} />
                  <div>
                    <p className="text-sm text-gray-600">Doctor</p>
                    <p className="font-medium">{appointment.doctorName}</p>
                    <p className="text-sm text-gray-600">{appointment.doctorSpecialty}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Calendar className="text-blue-600 mr-2" size={20} />
                  <div>
                    <p className="text-sm text-gray-600">Date</p>
                    <p className="font-medium">{appointment.date}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Clock className="text-blue-600 mr-2" size={20} />
                  <div>
                    <p className="text-sm text-gray-600">Time</p>
                    <p className="font-medium">{appointment.time} ({appointment.duration})</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Reason for Visit</p>
                  <p className="font-medium">{appointment.reason}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Upload Medical Papers Section */}
          <div className="bg-white rounded-lg shadow mt-6">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Upload Previous Medical Papers</h2>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <p className="text-gray-500 mb-2">Please upload your previous medical records if you have any. Your doctor will review them before or during your appointment.</p>
                <input type="file" accept="image/*,.pdf" className="block mx-auto mb-4" multiple />
                <button className="bg-teal-600 hover:bg-teal-700 text-white py-2 px-4 rounded">
                  Upload
                </button>
              </div>
            </div>
          </div>

          {/* Video Call Section */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-6 border-b">
              <h2 className="text-xl font-bold text-gray-800">Video Consultation</h2>
            </div>

            {!inCall ? (
              <div className="p-6 text-center">
                <div className="mx-auto bg-blue-100 rounded-full w-20 h-20 flex items-center justify-center mb-4">
                  <Video className="text-blue-600" size={32} />
                </div>
                <h3 className="text-lg font-medium mb-4">Ready for your appointment?</h3>
                <button
                  onClick={startCall}
                  className="bg-teal-600 hover:bg-teal-700 text-white font-medium py-3 px-8 rounded-lg flex items-center mx-auto"
                >
                  <Video className="mr-2" size={20} />
                  Join Video Call
                </button>
              </div>
            ) : (
              <div className="p-6">
                <div className="bg-gray-900 rounded-lg aspect-video relative overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    {!doctorJoined ? (
                      <div className="text-center text-white">
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent mx-auto mb-4"></div>
                        <p className="text-lg font-medium">Waiting for Dr. Johnson to join...</p>
                        <p className="text-sm text-gray-300">Your camera is active</p>
                      </div>
                    ) : (
                      <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                        <img
                          src="/api/placeholder/400/320"
                          alt="Doctor video feed"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                  </div>

                  <div className="absolute bottom-4 right-4 w-1/5 aspect-video bg-gray-700 rounded border-2 border-white shadow-lg">
                    <div className="w-full h-full bg-gray-600 rounded flex items-center justify-center">
                      <User className="text-white" size={24} />
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-center">
                  <button
                    onClick={endCall}
                    className="bg-pink-600 hover:bg-pink-700 text-white py-3 px-8 rounded-lg"
                  >
                    End Call
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer (optional) */}
      <footer className="bg-gray-100 text-center text-sm py-4 text-gray-500">
        &copy; 2025 TeleChauki. All rights reserved.
      </footer>
    </div>
  );
};

export default PatientDashboard;