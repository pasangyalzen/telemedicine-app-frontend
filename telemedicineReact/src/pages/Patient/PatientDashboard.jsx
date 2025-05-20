import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Clock, Calendar, FileText, FilePlus, LogOut, User, ChevronDown, Menu, X, CheckCircle, AlertCircle, Home, Search, Shield, Settings, CalendarIcon, ClockIcon, Activity, Pill, Download } from 'lucide-react';
import axios from "axios";
import { Video } from 'lucide-react';
import { ActivitySquare,HelpCircle  } from "lucide-react";


const PatientDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("today");
  const [showSidebar, setShowSidebar] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // New state for consultation modal
  const [showConsultationModal, setShowConsultationModal] = useState(false);
  const [consultationData, setConsultationData] = useState(null);
  const [consultationLoading, setConsultationLoading] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  const [loading, setLoading] = useState(true);
  const [patientId, setPatientId] = useState(null);
  const [today, setToday] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [past, setPast] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [error, setError] = useState("");

  const [todayError, setTodayError] = useState("");
  const [upcomingError, setUpcomingError] = useState("");
  const [pastError, setPastError] = useState("");
  const [prescriptionsError, setPrescriptionsError] = useState("");

  // Search functionality
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const userId = localStorage.getItem("id");
  const patientName = localStorage.getItem("name") || "Patient";
  

  const apiClient = axios.create({
    baseURL: "http://localhost:5186/api/Patient",
    headers: {
      "Content-Type": "application/json",
    },
  });

  apiClient.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  const fetchTodaysAppointments = async (id) => {
    const res = await apiClient.get(`/GetTodaysAppointmentsByPatient/${id}`);
    return res.data;
  };

  const fetchUpcomingAppointments = async (id) => {
    const res = await apiClient.get(`/GetUpcomingAppointments/${id}`);
    return res.data;
  };

  const fetchPastAppointments = async (id) => {
    const res = await apiClient.get(`/GetPastAppointments/past/${id}`);
    return res.data;
  };

  const fetchPrescriptions = async (id) => {
    const res = await apiClient.get(`/GetPrescriptionsByPatientId/${id}`);
    return res.data;
  };

  const getPatientIdByUserId = async (userId) => {
    const res = await apiClient.get(`/GetPatientIdByUserId/${userId}`);
    return res.data.patientId || res.data.id || res.data;
  };

  // Updated function to use modal instead of alert
  const handleViewConsultation = async (appointmentId, appointment) => {
    try {
      setSelectedAppointment(appointment);
      setConsultationLoading(true);
      setShowConsultationModal(true);

      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:5186/api/Patient/GetConsultationByAppointmentId/${appointmentId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }

      const text = await response.text();
      if (!text) {
        throw new Error("Empty response received.");
      }

      const result = JSON.parse(text);
      setConsultationData(result);
    } catch (error) {
      console.error("Error fetching consultation:", error);
      setConsultationData({ error: "Failed to fetch consultation details." });
    } finally {
      setConsultationLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!userId) {
          setError("User not logged in.");
          return;
        }

        setLoading(true);
        const fetchedPatientId = await getPatientIdByUserId(userId);
        setPatientId(fetchedPatientId);

        const safeFetch = async (fn, setData, setErr) => {
          try {
            const result = await fn(fetchedPatientId);
            setData(result);
            setErr("");
          } catch (e) {
            setData([]);
            setErr("Failed to load this section.");
          }
        };

        await Promise.all([
          safeFetch(fetchTodaysAppointments, setToday, setTodayError),
          safeFetch(fetchUpcomingAppointments, setUpcoming, setUpcomingError),
          safeFetch(fetchPastAppointments, setPast, setPastError),
          safeFetch(fetchPrescriptions, setPrescriptions, setPrescriptionsError),
        ]);
      } catch (err) {
        setError("Something went wrong. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  // Filter data based on search query
  const filterData = (data) => {
    if (!searchQuery.trim()) return data;

    return data.filter(item =>
      (item.doctorFullName && item.doctorFullName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.status && item.status.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  };

  const renderAppointments = (data, errorText, onViewConsultation) => {
    const filteredData = filterData(data);

    if (errorText) {
      return (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-red-500" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{errorText}</p>
            </div>
          </div>
        </div>
      );
    }

    if (filteredData.length === 0) {
      return (
        <div className="text-center py-12 bg-teal-50 rounded-xl border border-teal-100">
          <CalendarIcon className="mx-auto h-12 w-12 text-teal-400" />
          <h3 className="mt-2 text-lg font-medium text-teal-900">No appointments found</h3>
          <p className="mt-1 text-sm text-teal-600">
            {searchQuery ? "No results match your search criteria." : "You don't have any appointments in this category."}
          </p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredData.map((item, index) => {
          const appointmentDate = new Date(item.scheduledTime);
          const isToday = new Date().toDateString() === appointmentDate.toDateString();

          // Determine status color
          let statusColor = "bg-gray-100 text-gray-800";
          if (item.status === "Completed") statusColor = "bg-teal-100 text-teal-800";
          if (item.status === "Cancelled") statusColor = "bg-red-100 text-red-800";
          if (item.status === "Confirmed") statusColor = "bg-teal-100 text-teal-800";
          if (item.status === "Pending") statusColor = "bg-yellow-100 text-yellow-800";

          return (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-md border border-teal-100 overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <div className="p-5 border-b border-teal-50 bg-gradient-to-r from-teal-50 to-white flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center text-teal-600 shadow-sm">
                    <User className="w-6 h-6" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-base font-semibold text-teal-900">{item.doctorFullName || "N/A"}</h3>
                    <p className="text-xs text-teal-600">Doctor</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColor}`}>
                  {item.status}
                </span>
              </div>

              <div className="p-5">
                <div className="flex items-start mb-4">
                  <CalendarIcon className="w-5 h-5 text-teal-500 mt-0.5 mr-3" />
                  <div>
                    <p className="text-sm text-gray-900 font-medium">
                      {appointmentDate.toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                    <p className="text-xs text-teal-600 font-medium mt-1">
                      {isToday ? "Today" : ""}
                    </p>
                  </div>
                </div>

                <div className="flex items-center mb-5">
                  <ClockIcon className="w-5 h-5 text-teal-500 mr-3" />
                  <p className="text-sm text-gray-700">
                    {appointmentDate.toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>

                
{onViewConsultation && (
  <button
    onClick={() => onViewConsultation(item.appointmentId, item)}
    className="w-full mt-3 flex items-center justify-center gap-2 bg-teal-600 text-white px-4 py-3 rounded-xl hover:bg-teal-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 shadow-md"
  >
    <FileText className="w-4 h-4" />
    View Consultation
  </button>
)}

{activeTab === "today" && (
  <button
    onClick={() => alert(`Joining call for appointment ID: ${item.appointmentId}`)}
    className="w-full mt-3 flex items-center justify-center gap-2 bg-emerald-600 text-white px-4 py-3 rounded-xl hover:bg-emerald-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 shadow-md"
  >
    <Video className="w-4 h-4" />
    Join Call
  </button>
)}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderPrescriptions = () => {
    if (prescriptionsError) {
      return (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-red-500" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{prescriptionsError}</p>
            </div>
          </div>
        </div>
      );
    }

    if (prescriptions.length === 0) {
      return (
        <div className="text-center py-12 bg-teal-50 rounded-xl border border-teal-100">
          <Pill className="mx-auto h-12 w-12 text-teal-400" />
          <h3 className="mt-2 text-lg font-medium text-teal-900">No prescriptions found</h3>
          <p className="mt-1 text-sm text-teal-600">
            You don't have any prescriptions at this time.
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-8">
        {prescriptions.map((prescription, index) => (
          <div key={index} className="bg-white rounded-2xl shadow-md border border-teal-100 overflow-hidden">
            <div className="p-5 border-b border-teal-100 bg-gradient-to-r from-teal-100 to-teal-50">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-teal-900 flex items-center">
                  <Pill className="w-5 h-5 mr-2 text-teal-600" />
                  Prescription
                </h3>
                <span className="text-sm text-teal-700 font-medium">
                  {new Date(prescription.prescribedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>
            </div>

            <div className="p-5">
              <h4 className="font-medium text-teal-800 mb-4 flex items-center">
                <Activity className="w-4 h-4 mr-2 text-teal-600" />
                Prescription Items
              </h4>

              <div className="space-y-4">
                {prescription.prescriptionItems.map((item, idx) => (
                  <div key={idx} className="bg-teal-50 p-5 rounded-xl border border-teal-100 shadow-sm">
                    <div className="flex justify-between items-start">
                      <h5 className="font-semibold text-teal-900">{item.medicineName}</h5>
                    </div>

                    <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                      <div className="flex items-center">
                        <span className="text-teal-600 mr-2">Dosage:</span>
                        <span className="font-medium text-teal-900">{item.dosage}</span>
                      </div>

                      <div className="flex items-center">
                        <span className="text-teal-600 mr-2">Frequency:</span>
                        <span className="font-medium text-teal-900">{item.frequency}</span>
                      </div>

                      <div className="flex items-center">
                        <span className="text-teal-600 mr-2">Duration:</span>
                        <span className="font-medium text-teal-900">{item.duration}</span>
                      </div>
                    </div>

                    {item.notes && (
                      <div className="mt-3 pt-3 border-t border-teal-200">
                        <p className="text-sm text-teal-700">
                          <span className="font-medium text-teal-900">Notes: </span>
                          {item.notes}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <button className="mt-5 flex items-center justify-center gap-2 w-full bg-teal-600 text-white px-4 py-3 rounded-xl hover:bg-teal-700 transition-colors duration-300 shadow-md">
                <Download className="w-4 h-4" />
                Download Prescription
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center h-64">
          <div className="w-16 h-16 border-t-4 border-b-4 border-teal-600 rounded-full animate-spin mb-4"></div>
          <p className="text-teal-700 font-medium">Loading your health information...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-red-500" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-2 text-sm font-medium text-red-700 hover:text-red-600"
              >
                Try again
              </button>
            </div>
          </div>
        </div>
      );
    }

    switch (activeTab) {
      case "today":
        return renderAppointments(today, todayError);
      case "upcoming":
        return renderAppointments(upcoming, upcomingError);
      case "past":
        return renderAppointments(past, pastError, handleViewConsultation);
      case "prescriptions":
        return renderPrescriptions();
      default:
        return null;
    }
  };

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("id");
    navigate("/login");
  };

  const menuItems = [
    { id: "today", label: "Today's Appointments", icon: <Clock className="w-5 h-5" /> },
    { id: "upcoming", label: "Upcoming Appointments", icon: <Calendar className="w-5 h-5" /> },
    { id: "past", label: "Past Appointments", icon: <FileText className="w-5 h-5" /> },
    { id: "prescriptions", label: "Prescriptions", icon: <FilePlus className="w-5 h-5" /> },
  ];

  // Get title based on active tab
  const getActiveTabTitle = () => {
    const activeMenuItem = menuItems.find(item => item.id === activeTab);
    return activeMenuItem ? activeMenuItem.label : "";
  };

  return (
    <div className="flex font-sans bg-teal-50">
      {/* Sidebar */}
{/* Enhanced Sidebar with improved teal aesthetics */}
<aside className={`fixed top-0 left-0 h-full w-72 bg-gradient-to-br from-teal-800 via-teal-700 to-teal-600 shadow-xl transition-transform z-30 ${showSidebar ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}>
  {/* Header with refined gradient */}
  <div className="p-6 bg-gradient-to-r from-teal-900 to-teal-700 text-white border-b border-teal-500/30">
    <div className="flex items-center gap-2">
      {/* <div className="w-8 h-8 rounded-md bg-teal-400 flex items-center justify-center">
        <ActivitySquare className="w-5 h-5 text-teal-900" />
      </div> */}
      <div>
        <h1 className="text-3xl font-extrabold">TeleChauki</h1>
        <p className="text-sm text-teal-200 mt-1">Patient Section</p>
      </div>
    </div>
  </div>

  {/* User Profile with improved styling */}
  <div className="p-5 border-b border-teal-500/30 bg-teal-800/50 backdrop-blur-sm">
    <div className="flex items-center space-x-3">
      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-teal-200 to-teal-400 flex items-center justify-center text-teal-900 shadow-lg border-2 border-teal-300/30">
        <User className="w-7 h-7" />
      </div>
      <div>
        <p className="font-semibold text-white text-lg">{patientName}</p>
        <div className="flex items-center mt-1">
          <span className="w-2 h-2 rounded-full bg-teal-300 mr-2"></span>
          <p className="text-sm text-teal-200">Active Patient</p>
        </div>
      </div>
    </div>
  </div>

  {/* Navigation with improved styling */}
  <div className="p-4 text-sm text-white mt-2">
    <div className="flex items-center justify-between px-2 mb-4">
      <h2 className="text-xs font-semibold text-teal-200 uppercase tracking-wider">
        Main Menu
      </h2>
      <div className="h-px bg-gradient-to-r from-transparent via-teal-400/30 to-transparent flex-grow ml-3"></div>
    </div>

    <nav className="space-y-2">
      {menuItems.map(item => (
        <button
          key={item.id}
          onClick={() => {
            setActiveTab(item.id);
            setShowSidebar(false);
          }}
          className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all duration-300
            ${activeTab === item.id
              ? "bg-gradient-to-r from-teal-500/40 to-teal-400/20 text-white font-medium shadow-lg border border-teal-400/20"
              : "hover:bg-teal-600/40 text-teal-100 hover:text-white"}`}
        >
          <div className={`p-1.5 rounded-lg ${activeTab === item.id ? "bg-teal-200 text-teal-900" : "text-teal-200"}`}>
            {item.icon}
          </div>
          <span>{item.label}</span>
          {activeTab === item.id && (
            <div className="ml-auto h-6 w-1 rounded-full bg-teal-300"></div>
          )}
        </button>
      ))}
    </nav>
  </div>
  
  {/* Bottom section with help and support */}
  <div className="absolute bottom-0 left-0 right-0 p-4">
    <div className="bg-gradient-to-r from-teal-900/60 to-teal-800/60 rounded-xl p-4 border border-teal-600/30">
      <div className="flex items-center mb-3">
        <HelpCircle className="w-5 h-5 text-teal-300 mr-2" />
        <h3 className="text-sm font-medium text-teal-100">Need Help?</h3>
      </div>
      <p className="text-xs text-teal-300 mb-3">Contact our support team for assistance</p>
      <button className="w-full py-2 bg-teal-500 hover:bg-teal-400 text-teal-900 rounded-lg text-sm font-medium transition-colors">
        Contact Support
      </button>
    </div>
  </div>
</aside>

      {/* Main Content */}
      <main className="flex-1 ml-0 lg:ml-72 bg-teal-0 min-h-screen">
        {/* Top Navigation Bar */}
        <header className="bg-gradient-to-r from-teal-800 to-teal-600 text-white sticky top-0 z-20 shadow-sm">
        <div className="flex justify-between items-center px-6 py-6">
          {/* Left side - Mobile menu and page title */}
          <div className="flex items-center">
            <button
              className="lg:hidden text-teal-100 hover:text-white mr-4"
              onClick={() => setShowSidebar(!showSidebar)}
            >
              {showSidebar ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            <h1 className="text-2xl font-extrabold text-teal-50">{getActiveTabTitle()}</h1>
          </div>

          {/* Right side - Search and user menu */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="relative hidden md:block">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-teal-200" />
              </div>
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-teal-300 rounded-lg bg-teal-700 text-white placeholder-teal-200 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
              />
            </div>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-2 text-white hover:text-teal-100"
              >
                <div className="w-10 h-10 rounded-full bg-teal-600 border border-white flex items-center justify-center shadow-sm">
                  <User className="w-5 h-5" />
                </div>
                <ChevronDown className="w-4 h-4" />
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl z-10 border border-teal-100 overflow-hidden">
                  <div className="px-5 py-4 border-b border-teal-100 bg-teal-50">
                    <p className="text-sm font-medium text-teal-900">{patientName}</p>
                    <p className="text-xs text-teal-600 truncate mt-1">Patient ID: {patientId}</p>
                  </div>

                  <div className="py-2">
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-5 py-3 text-sm bg-white text-teal-800 hover:bg-teal-50 transition-colors"
                    >
                      <LogOut className="w-4 h-4 mr-3 text-teal-600" />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

        {/* Page Content */}
        <div className="p-6">
          {/* Content Header */}
          <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-teal-900">{getActiveTabTitle()}</h2>
              <p className="text-sm text-teal-600 mt-2">
                {activeTab === "today" && "Your appointments scheduled for today"}
                {activeTab === "upcoming" && "Your upcoming appointments"}
                {activeTab === "past" && "Your past appointment history"}
                {activeTab === "prescriptions" && "Your prescribed medications"}
              </p>
            </div>

            {activeTab !== "prescriptions" && (
              <button className="mt-4 md:mt-0 inline-flex items-center px-5 py-3 border border-transparent text-sm font-medium rounded-xl shadow-md text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all duration-300">
                <Calendar className="w-5 h-5 mr-2" />
                Book New Appointment
              </button>
            )}
          </div>

          {/* Main Content */}
          {renderContent()}
        </div>
      </main>

      {/* Consultation Modal */}
      {showConsultationModal && (
        <div
          className="fixed inset-0 bg-teal-900 bg-opacity-50 flex justify-center items-center z-50 p-4 animate-fadeIn backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowConsultationModal(false);
            }
          }}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-scaleIn"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-teal-800 to-teal-600 text-white px-6 py-5">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold">Consultation Details</h3>
                <button
                  onClick={() => setShowConsultationModal(false)}
                  className="text-white hover:bg-teal-700 rounded-full p-1 transition-colors duration-200"
                  aria-label="Close modal"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              {selectedAppointment && (
                <p className="text-teal-100 mt-2">
                  Dr. {selectedAppointment.doctorFullName || "Unknown"} - {" "}
                  {new Date(selectedAppointment.scheduledTime).toLocaleDateString()}
                </p>
              )}
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {consultationLoading ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="w-16 h-16 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin mb-4"></div>
                  <p className="text-teal-700">Loading consultation details...</p>
                </div>
              ) : consultationData ? (
                consultationData.error ? (
                  <div className="flex items-center justify-center py-8 text-red-600">
                    <AlertCircle className="w-6 h-6 mr-2" />
                    <p>{consultationData.error}</p>
                  </div>
                ) : (
                  <div className="space-y-8">
                    <div className="bg-teal-50 rounded-xl p-5 border border-teal-100 shadow-sm">
                      <h4 className="text-teal-800 font-medium mb-3 flex items-center">
                        <FileText className="w-5 h-5 mr-2 text-teal-600" />
                        Doctor's Notes
                      </h4>
                      <p className="text-gray-700 whitespace-pre-line bg-white p-3 rounded border border-teal-100 min-h-[60px]">
                        {consultationData.notes || "No notes provided"}
                      </p>
                    </div>

                    <div className="bg-green-50 rounded-lg p-4 border border-green-100">
                      <h4 className="text-green-800 font-medium mb-2 flex items-center">
                        <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
                        Recommendations
                      </h4>
                      <p className="text-gray-700 whitespace-pre-line bg-white p-3 rounded border border-green-100 min-h-[60px]">
                        {consultationData.recommendations || "No recommendations provided"}
                      </p>
                    </div>

                    {consultationData.createdAt && (
                      <p className="text-sm text-gray-500 flex items-center">
                        <Calendar className="w-4 h-4 mr-2" />
                        Created on: {new Date(consultationData.createdAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                )
              ) : (
                <div className="text-center py-8">
                  <FileText className="w-16 h-16 text-gray-300 mx-auto mb-3" />
                  <h4 className="text-lg font-medium text-gray-700">No consultation details available</h4>
                  <p className="text-gray-500 mt-1">The doctor hasn't uploaded any consultation details for this appointment.</p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="border-t border-gray-200 px-6 py-4 bg-gray-50 flex justify-end">
              <button
                onClick={() => setShowConsultationModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
              >
                Close
              </button>

              {consultationData && !consultationData.error && (
                <button
                  className="ml-3 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 flex items-center"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Report
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-white bg-opacity-50 flex justify-center items-center z-50 animate-fadeIn">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-scaleIn">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Confirm Logout</h2>
              <p className="text-gray-600">Are you sure you want to logout from your account?</p>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => setShowLogoutModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmLogout}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Overlay for mobile sidebar - removed black background */}
      {showSidebar && (
        <div
          className="fixed inset-0 bg-white bg-opacity-50 z-20 lg:hidden"
          onClick={() => setShowSidebar(false)}
        />
      )}

      {/* CSS for animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        .animate-scaleIn {
          animation: scaleIn 0.2s ease-out;
        } 
      `}</style>
    </div>
  );
};

export default PatientDashboard;
