import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Search, User, ChevronDown, Menu, X, LogOut } from "lucide-react"
import { Sidebar as PatientSidebar} from "./components/sidebar"
import { AppointmentList } from "./components/AppointmentList"
import { PrescriptionList } from "./components/PrescriptionList"
import { ConsultationModal } from "./components/ConsultationModal"
import { LogoutModal } from "./components/logout-modal"
import { usePatientData } from "./hooks/use-patient-data"
import { LoadingSpinner } from "./components/LoadingSpinner"
import { ErrorMessage } from "./components/ErrorMessage"
import { PageHeader } from "./components/PageHeader"
import RescheduleForm from "../Doctor/components/RescheduleForm"
import ConfirmationModal from "../../components/ConfirmationModal"
import { cancelDoctorAppointment, getDoctorIdByEmail, getDoctorIdByUserId } from "../Doctor/services/doctorAppointmentApi"
import toast from "react-hot-toast"
import axios from "axios";
import { getEmailFromToken, getUserIdFromToken } from "../auth/auth"

const API_BASE_URL = "http://localhost:5186/api/Patient";

// Configure Axios instance with default headers
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${localStorage.getItem("token")}`,
  },
});


const PatientDashboard = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState("today")
  const [showSidebar, setShowSidebar] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const [showConsultationModal, setShowConsultationModal] = useState(false)
  const [consultationData, setConsultationData] = useState(null)
  const [consultationLoading, setConsultationLoading] = useState(false)
  const [selectedAppointment, setSelectedAppointment] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);


  const fetchUpcomingAppointments = async (id) => {
    const res = await apiClient.get(`/GetUpcomingAppointments/${id}`)
     console.log("Ressstttt",res);
     setUpcomingAppointments(res);
    return res.data
  }

  const getPatientIdByUserId = async (userId) => {
    const res = await apiClient.get(`/GetPatientIdByUserId/${userId}`)
    return res.data.patientId || res.data.id || res.data
  }

  

  const {
    patientId,
    patientInfo,
    today,
    upcoming,
    patientName,
    past,
    prescriptions,
    todayError,
    upcomingError,
    pastError,
    prescriptionsError,
    fetchConsultation,
  } = usePatientData()

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [appointmentToCancel, setAppointmentToCancel] = useState(null);

  const handleCancelAppointment = async (appointmentIdToCancel) => {
  setLoading(true);
  setError(null);
  try {
    const result = await cancelDoctorAppointment(appointmentIdToCancel); // Or use a patient-specific API
    toast.success("Appointment was successfully cancelled");
    setShowCancelModal(false);
    setAppointmentToCancel(null);
    window.location.reload();
  } catch (err) {
    setError(err.message);
    console.error("Cancel error:", err);
  } finally {
    setLoading(false);
  }
};

  const fetchAppointments = async () => {
  setLoading(true);
  try {
    const user = getUserIdFromToken();
    console.log("User ID from token:", user);
    const patientId = await getPatientIdByUserId(user);

    const data = await fetchUpcomingAppointments(patientId);
    console.log("Fetched patient upcoming appointments:", data);
    setUpcomingAppointments(data);
  } catch (err) {
    console.error("Failed to fetch appointments:", err);
    toast.error("Could not load appointments");
  } finally {
    setLoading(false);
  }
};

  // Handle view consultation
  const handleViewConsultation = async (appointmentId, appointment) => {
    try {
      setSelectedAppointment(appointment)
      setConsultationLoading(true)
      setShowConsultationModal(true)
      const result = await fetchConsultation(appointmentId)
      setConsultationData(result)
    } catch (error) {
      console.error("Error fetching consultation:", error)
      setConsultationData({ error: "Failed to fetch consultation details." })
    } finally {
      setConsultationLoading(false)
    }
  }

  const handleCancelClick = (appointmentId) => {
  setAppointmentToCancel(appointmentId);
  setShowCancelModal(true);
};
  const [showRescheduleModal, setShowRescheduleModal] = useState(false)
  const [appointmentToReschedule, setAppointmentToReschedule] = useState(null)
  console.log("PPPPPPPPRRRRRR", appointmentToReschedule);

  const onRescheduleClick = (appointment) => {
    console.log("PPPPPPKKKKK", appointment);
    setAppointmentToReschedule(appointment);
    setShowRescheduleModal(true);
  }

  const handleLogout = () => {
    setShowLogoutModal(true)
  }

  const confirmLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("id")
    navigate("/login")
  }

  const menuItems = [
    { id: "today", label: "Today's Appointments", icon: "Clock" },
    { id: "upcoming", label: "Upcoming Appointments", icon: "Calendar" },
    { id: "past", label: "Past Appointments", icon: "FileText" },
    { id: "prescriptions", label: "Prescriptions", icon: "FilePlus" },
  ]

  // Get title based on active tab
  const getActiveTabTitle = () => {
    const activeMenuItem = menuItems.find((item) => item.id === activeTab)
    return activeMenuItem ? activeMenuItem.label : ""
  }

  // Filter data based on search query
  const filterData = (data) => {
    if (!searchQuery.trim()) return data

    return data.filter(
      (item) =>
        (item.doctorFullName && item.doctorFullName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item.status && item.status.toLowerCase().includes(searchQuery.toLowerCase())),
    )
  }

  // Render content based on active tab
  const renderContent = () => {
    if (loading) {
      return <LoadingSpinner message="Loading your health information..." />
    }

    if (error) {
      return <ErrorMessage message={error} onRetry={() => window.location.reload()} />
    }

    switch (activeTab) {
      case "today":
        return (
          <AppointmentList
            appointments={filterData(today)}
            error={todayError}
            searchQuery={searchQuery}
            showJoinCall={true}
          />
        )
      case "upcoming":
        return <AppointmentList 
        appointments={filterData(upcoming)} 
        error={upcomingError} 
        searchQuery={searchQuery} 
        onRescheduleClick={onRescheduleClick}
        onCancelClick={handleCancelClick} 
        />
      
    case "past":
      console.log("Past Appointments before filter:", past)
      const filteredPast = filterData(past)
      console.log("Past Appointments after filter:", filteredPast)
        return (
          <AppointmentList
            appointments={filterData(past)}
            error={pastError}
            searchQuery={searchQuery}
            onViewConsultation={handleViewConsultation}
            hideProceedPayment={true} 
          />
        )
      case "prescriptions":
        return <PrescriptionList prescriptions={prescriptions} error={prescriptionsError} />
      default:
        return null
    }
  }

  return (
    <div className="flex font-sans bg-gradient-to-br from-teal-50 via-slate-50 to-teal-100 min-h-screen">
      {/* Sidebar */}
      <PatientSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        menuItems={menuItems}
        patient={patientInfo}
        patientName={patientName}
        patientId={patientId}
        showSidebar={showSidebar}
        setShowSidebar={setShowSidebar}
      />

      {/* Main Content */}
      <main className="flex-1 ml-0 lg:ml-72 bg-transparent min-h-screen">
        {/* Top Navigation Bar */}
        <header className="bg-gradient-to-r from-teal-900 via-teal-800 to-teal-700 text-white sticky top-0 z-20 shadow-2xl backdrop-blur-lg border-b border-teal-500/20">
          <div className="flex justify-between items-center px-6 py-6 relative">
            {/* Background decoration */}
            <div className="absolute inset-0 bg-gradient-to-r from-teal-400/5 via-transparent to-teal-400/5"></div>
            
            {/* Left side - Mobile menu and page title */}
            <div className="flex items-center relative z-10">
              <button
                className="lg:hidden text-teal-200 hover:text-white mr-4 p-2 rounded-lg hover:bg-teal-700/50 transition-all duration-300"
                onClick={() => setShowSidebar(!showSidebar)}
              >
                {showSidebar ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>

              <div>
                <h1 className="text-3xl font-black bg-gradient-to-r from-teal-100 via-white to-teal-200 bg-clip-text text-transparent drop-shadow-lg">
                  {getActiveTabTitle()}
                </h1>
                <div className="h-1 w-16 bg-gradient-to-r from-teal-300 to-teal-400 rounded-full mt-1"></div>
              </div>
            </div>

            {/* Right side - Search and user menu */}
            <div className="flex items-center space-x-6 relative z-10">
              {/* Search */}
              

              {/* User Menu */}
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-3 text-white hover:text-teal-100 p-2 rounded-2xl hover:bg-teal-700/40 transition-all duration-300 group"
                >
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-400 to-teal-500 border-2 border-teal-300/50 flex items-center justify-center shadow-xl group-hover:shadow-teal-300/30 transition-all duration-300">
                    <User className="w-6 h-6 text-teal-900" />
                  </div>
                  <ChevronDown className="w-4 h-4 transition-transform duration-300 group-hover:rotate-180" />
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-2xl z-10 border border-teal-100 overflow-hidden animate-scaleIn backdrop-blur-lg">
                    <div className="px-6 py-5 border-b border-teal-100 bg-gradient-to-r from-teal-50 to-teal-100/50">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-400 to-teal-500 flex items-center justify-center shadow-lg">
                          <User className="w-6 h-6 text-teal-900" />
                        </div>
                        <div>
                          <p className="text-base font-bold text-teal-900">Patient: {patientInfo.fullName}</p>
                          <p className="text-sm text-teal-600 truncate mt-1">Patient ID: {patientInfo.patientId}</p>
                        </div>
                      </div>
                    </div>

                    <div className="py-2">
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-6 py-4 text-sm bg-white text-teal-800 hover:bg-gradient-to-r hover:from-red-50 hover:to-red-100 hover:text-red-700 transition-all duration-300 group"
                      >
                        <div className="p-2 rounded-lg bg-teal-100 group-hover:bg-red-100 mr-4 transition-all duration-300">
                          <LogOut className="w-4 h-4 text-teal-600 group-hover:text-red-600" />
                        </div>
                        <span className="font-medium">Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-6 lg:p-8">
          {/* Content Header */}
          <div className="mb-8">
            <PageHeader
            title={getActiveTabTitle()}
            activeTab={activeTab}
            onBookAppointment={() => {
              console.log("PageHeader button clicked");
              navigate("/book-appointment");
            }}
          />
          </div>

          {/* Main Content */}
          <div className="bg-white/60 backdrop-blur-sm rounded-3xl shadow-xl border border-teal-100/50 p-6 lg:p-8 min-h-[600px]">
            {renderContent()}
          </div>
        </div>
      </main>

      {/* Modals */}
      {showConsultationModal && (
        <ConsultationModal
          consultationData={consultationData}
          consultationLoading={consultationLoading}
          selectedAppointment={selectedAppointment}
          onClose={() => setShowConsultationModal(false)}
        />
      )}

      {showLogoutModal && <LogoutModal onConfirm={confirmLogout} onCancel={() => setShowLogoutModal(false)} />}

      {/* Overlay for mobile sidebar */}
      {showSidebar && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-20 lg:hidden animate-fadeIn" onClick={() => setShowSidebar(false)} />
      )}
      
      {showRescheduleModal && (
        <div className="fixed inset-0 bg-gray-900/20 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
          <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 animate-fadeIn">
            <RescheduleForm
              appointmentId={appointmentToReschedule.appointmentId}
              doctorId={appointmentToReschedule.doctorId}
              onRescheduleSuccess={() => {
                fetchAppointments();
              }}
              onClose={() => {
                setShowRescheduleModal(false);
                setAppointmentToReschedule(null);
              }}
            />
          </div>
        </div>
      )}

      {showCancelModal && appointmentToCancel && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full outline-none border-none">
            <ConfirmationModal
              message="Are you sure you want to cancel this appointment?"
              actionLabel="Cancel Appointment"
              onConfirm={() => handleCancelAppointment(appointmentToCancel)}
              onCancel={() => {
                setShowCancelModal(false);
                setAppointmentToCancel(null);
              }}
            />
          </div>
        </div>
      )}

      {/* Enhanced CSS for animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from { 
            opacity: 0; 
          }
          to { 
            opacity: 1; 
          }
        }
        @keyframes scaleIn {
          from { 
            transform: scale(0.95) translateY(-10px); 
            opacity: 0; 
          }
          to { 
            transform: scale(1) translateY(0); 
            opacity: 1; 
          }
        }
        @keyframes slideDown {
          from {
            transform: translateY(-10px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out;
        }
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
        
        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
        }
        ::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 10px;
        }
        ::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #14b8a6, #0d9488);
          border-radius: 10px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #0d9488, #0f766e);
        }
      `}</style>
    </div>
  )
}

export default PatientDashboard