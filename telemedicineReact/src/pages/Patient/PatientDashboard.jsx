import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Search, User, ChevronDown, Menu, X, LogOut } from "lucide-react"
import { Sidebar } from "./components/sidebar"
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
import { cancelDoctorAppointment } from "../Doctor/services/doctorAppointmentApi"
import toast from "react-hot-toast"

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
    // Refresh the list here
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
    const userId = getUserIdFromToken(); // replace with however you get the patient ID
    const data = await fetchUpcomingAppointments(userId);
    console.log("Fetched patient upcoming appointments:", data);
    setAppointments(data);
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
    <div className="flex font-sans bg-teal-50">
      {/* Sidebar */}
      <Sidebar
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
                      <p className="text-sm font-medium text-teal-900">Patient :{patientInfo.fullName}</p>
                      <p className="text-xs text-teal-600 truncate mt-1">Patient ID: {patientInfo.patientId}</p>
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
          <PageHeader title={getActiveTabTitle()} activeTab={activeTab} />

          {/* Main Content */}
          {renderContent()}
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
        <div className="fixed inset-0 bg-white bg-opacity-50 z-20 lg:hidden" onClick={() => setShowSidebar(false)} />
      )}
      {showRescheduleModal && (
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
    )}

    {showCancelModal && appointmentToCancel && (
  <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity duration-300">
    <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-md transform transition-all duration-300 scale-100 border border-teal-200">
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
  )
}

export default PatientDashboard
