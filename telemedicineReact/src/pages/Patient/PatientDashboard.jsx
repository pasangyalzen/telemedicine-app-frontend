"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { User, ChevronDown, Menu, X, LogOut, UserPlus } from "lucide-react"
import { Sidebar as PatientSidebar } from "./components/sidebar"
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
import axios from "axios"
import { getEmailFromToken, getUserIdFromToken } from "../auth/auth"
import MedicineRequestForm from "./components/MedicineRequestForm"
import { fetchPharmacistIdByEmail } from "../Admin/services/pharmacistApi"
import PatientRegisterModal from "./components/patient-registration-form"

const API_BASE_URL = "http://localhost:5186/api/Patient"

// Configure Axios instance with default headers
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
})

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
  const [upcomingAppointments, setUpcomingAppointments] = useState([])
  const [showMedicineRequestForm, setShowMedicineRequestForm] = useState(false)
  const [selectedMedicine, setSelectedMedicine] = useState(null)
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [appointmentToCancel, setAppointmentToCancel] = useState(null)
  const [isPharmacistRegistered, setIsPharmacistRegistered] = useState(false)
  const [showPharmacistRegisterModal, setShowPharmacistRegisterModal] = useState(false)
  const [showRescheduleModal, setShowRescheduleModal] = useState(false)
  const [appointmentToReschedule, setAppointmentToReschedule] = useState(null)

  // Simplified patient registration state
  const [showPatientRegisterModal, setShowPatientRegisterModal] = useState(false)
  const [registrationCompleted, setRegistrationCompleted] = useState(false)

  // Get patient data from the existing hook
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
    loading: patientDataLoading,
    error: patientDataError,
  } = usePatientData()

  // Check if patient registration is complete based on patientInfo
  const isPatientRegistered =
    registrationCompleted || (patientInfo && patientInfo.fullName && patientInfo.phoneNumber && patientInfo.dateOfBirth)

  console.log("🔍 Patient Registration Debug:")
  console.log("patientInfo:", patientInfo)
  console.log("registrationCompleted:", registrationCompleted)
  console.log("isPatientRegistered:", isPatientRegistered)
  console.log("patientDataLoading:", patientDataLoading)
  console.log("patientDataError:", patientDataError)

  useEffect(() => {
    const checkPharmacistStatus = async () => {
      try {
        const email = getEmailFromToken()
        const pharmacistId = await fetchPharmacistIdByEmail(email)
        if (pharmacistId) {
          setIsPharmacistRegistered(true)
        } else {
          setIsPharmacistRegistered(false)
        }
      } catch (error) {
        console.error("Error checking pharmacist registration", error)
        setIsPharmacistRegistered(false)
      }
    }
    checkPharmacistStatus()
  }, [])

  // Show registration modal when patient data is loaded but registration is incomplete
  useEffect(() => {
    // Don't show modal if we're still loading or if registration was just completed
    if (patientDataLoading || registrationCompleted) {
      return
    }

    // If we have patient data but it's incomplete, show the modal
    if (patientInfo !== null && !isPatientRegistered) {
      console.log("🚨 Showing registration modal - incomplete patient data")
      setShowPatientRegisterModal(true)
    }

    // If we have an error fetching patient data (patient doesn't exist), show modal
    if (patientDataError && !patientInfo) {
      console.log("🚨 Showing registration modal - patient doesn't exist")
      setShowPatientRegisterModal(true)
    }
  }, [patientInfo, patientDataLoading, patientDataError, isPatientRegistered, registrationCompleted])

  const fetchUpcomingAppointments = async (id) => {
    const res = await apiClient.get(`/GetUpcomingAppointments/${id}`)
    console.log("Ressstttt", res)
    setUpcomingAppointments(res)
    return res.data
  }

  const getPatientIdByUserId = async (userId) => {
    const res = await apiClient.get(`/GetPatientIdByUserId/${userId}`)
    return res.data.patientId || res.data.id || res.data
  }

  const handleCancelAppointment = async (appointmentIdToCancel) => {
    setLoading(true)
    setError(null)
    try {
      const result = await cancelDoctorAppointment(appointmentIdToCancel)
      toast.success("Appointment was successfully cancelled")
      setShowCancelModal(false)
      setAppointmentToCancel(null)
      window.location.reload()
    } catch (err) {
      setError(err.message)
      console.error("Cancel error:", err)
    } finally {
      setLoading(false)
    }
  }

  const fetchAppointments = async () => {
    setLoading(true)
    try {
      const user = getUserIdFromToken()
      console.log("User ID from token:", user)
      const patientId = await getPatientIdByUserId(user)

      const data = await fetchUpcomingAppointments(patientId)
      console.log("Fetched patient upcoming appointments:", data)
      setUpcomingAppointments(data)
    } catch (err) {
      console.error("Failed to fetch appointments:", err)
      // toast.error("Could not load appointments")
    } finally {
      setLoading(false)
    }
  }

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
    setAppointmentToCancel(appointmentId)
    setShowCancelModal(true)
  }

  const onRescheduleClick = (appointment) => {
    console.log("PPPPPPKKKKK", appointment)
    setAppointmentToReschedule(appointment)
    setShowRescheduleModal(true)
  }

  const handleLogout = () => {
    setShowLogoutModal(true)
  }

  const confirmLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("id")
    navigate("/login")
  }

  const handlePharmacistRegistered = () => {
    toast.success("Pharmacist registered successfully!")
    setShowPharmacistRegisterModal(false)
    setIsPharmacistRegistered(true)
  }

  // Handler for patient registration completion
  const handlePatientRegistrationComplete = () => {
    console.log("🎉 Patient registration completed successfully!")

    // Set the completion flag to prevent re-checking
    setRegistrationCompleted(true)

    // Close the modal
    setShowPatientRegisterModal(false)

    toast.success("Patient registration completed successfully!")

    // Reload after a delay to refresh all data
    setTimeout(() => {
      window.location.reload()
    }, 2000)
  }

  const menuItems = [
    { id: "today", label: "Today's Appointments", icon: "Clock" },
    { id: "upcoming", label: "Upcoming Appointments", icon: "Calendar" },
    { id: "past", label: "Past Appointments", icon: "FileText" },
    { id: "prescriptions", label: "Prescriptions", icon: "FilePlus" },
  ]

  const getActiveTabTitle = () => {
    const activeMenuItem = menuItems.find((item) => item.id === activeTab)
    return activeMenuItem ? activeMenuItem.label : ""
  }

  const filterData = (data) => {
    if (!searchQuery.trim()) return data

    return data.filter(
      (item) =>
        (item.doctorFullName && item.doctorFullName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item.status && item.status.toLowerCase().includes(searchQuery.toLowerCase())),
    )
  }

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
        return (
          <AppointmentList
            appointments={filterData(upcoming)}
            error={upcomingError}
            searchQuery={searchQuery}
            onRescheduleClick={onRescheduleClick}
            onCancelClick={handleCancelClick}
          />
        )

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
        return (
          <PrescriptionList
            prescriptions={prescriptions}
            error={prescriptionsError}
            onRequestMedicine={(item) => {
              setSelectedMedicine(item)
              setShowMedicineRequestForm(true)
            }}
          />
        )
      default:
        return null
    }
  }

  // Show loading state while patient data is loading
  if (patientDataLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-teal-50 via-slate-50 to-teal-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-teal-700 text-lg">Loading your profile...</p>
        </div>
      </div>
    )
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
              {/* User Menu */}
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-3 text-white hover:text-teal-100 p-2 rounded-2xl hover:bg-teal-700/40 transition-all duration-300 group"
                >
                  <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-teal-300/50 shadow-xl group-hover:shadow-teal-300/30 transition-all duration-300">
                    {patientInfo?.profileImage ? (
                      <img
                        src={`http://localhost:5186${patientInfo.profileImage}`}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-teal-400 to-teal-500 flex items-center justify-center">
                        <User className="w-6 h-6 text-teal-900" />
                      </div>
                    )}
                  </div>
                  <ChevronDown className="w-4 h-4 transition-transform duration-300 group-hover:rotate-180" />
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-2xl z-10 border border-teal-100 overflow-hidden animate-scaleIn backdrop-blur-lg">
                    <div className="px-6 py-5 border-b border-teal-100 bg-gradient-to-r from-teal-50 to-teal-100/50">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-teal-300/50 shadow-xl group-hover:shadow-teal-300/30 transition-all duration-300">
                          {patientInfo?.profileImage ? (
                            <img
                              src={`http://localhost:5186${patientInfo.profileImage}`}
                              alt="Profile"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-teal-400 to-teal-500 flex items-center justify-center">
                              <User className="w-6 h-6 text-teal-900" />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="text-base font-bold text-teal-900">
                            Patient: {patientInfo?.fullName || "Patient"}
                          </p>
                          <p className="text-sm text-teal-600 truncate mt-1">
                            Patient ID: {patientInfo?.patientId || "Not Available"}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="py-2">
                      {/* Complete Registration Button - Only show if not registered */}
                      {!isPatientRegistered && (
                        <>
                          <button
                            onClick={() => {
                              setShowPatientRegisterModal(true)
                              setShowUserMenu(false)
                            }}
                            className="flex items-center w-full px-6 py-4 text-sm bg-white text-orange-700 hover:bg-gradient-to-r hover:from-orange-50 hover:to-orange-100 hover:text-orange-800 transition-all duration-300 group"
                          >
                            <div className="p-2 rounded-lg bg-orange-100 group-hover:bg-orange-200 mr-4 transition-all duration-300">
                              <UserPlus className="w-4 h-4 text-orange-600 group-hover:text-orange-700" />
                            </div>
                            <span className="font-medium">Complete Registration</span>
                          </button>
                          <hr className="border-teal-100" />
                        </>
                      )}

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

          {/* Registration Alert Bar - Only show if incomplete */}
          {!isPatientRegistered && (
            <div className="mx-6 mb-4 px-4 py-3 bg-gradient-to-r from-orange-600/20 to-red-600/20 border border-orange-500/30 rounded-xl backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <UserPlus className="w-5 h-5 text-orange-300" />
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-orange-500 rounded-full animate-pulse"></div>
                  </div>
                  <div>
                    <p className="text-orange-200 font-medium text-sm">Registration Required</p>
                    <p className="text-orange-300/80 text-xs">
                      Please complete your registration to schedule appointments
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowPatientRegisterModal(true)}
                  className="px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white text-sm font-medium rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  Complete Now
                </button>
              </div>
            </div>
          )}
        </header>

        {/* Page Content */}
        <div className="p-6 lg:p-8">
          {/* Content Header */}
          <div className="mb-8">
            {/* Hero Registration Card - Only show if incomplete */}
            {!isPatientRegistered && (
              <div className="mb-8 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-teal-600/10 rounded-2xl"></div>
                <div className="relative bg-gradient-to-br from-blue-900/40 to-teal-900/40 border border-blue-500/30 rounded-2xl p-6 backdrop-blur-sm">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="p-3 bg-gradient-to-br from-blue-500 to-teal-500 rounded-xl shadow-lg">
                        <UserPlus className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-blue-200 mb-2">Complete Your Patient Profile</h3>
                        <p className="text-blue-300/90 text-sm leading-relaxed mb-4">
                          Welcome to TeleChauki! To start booking appointments and accessing our healthcare services,
                          please complete your patient registration.
                        </p>
                        <div className="flex flex-wrap gap-2 text-xs">
                          <span className="px-2 py-1 bg-blue-500/20 text-blue-200 rounded-full">📋 Personal Info</span>
                          <span className="px-2 py-1 bg-blue-500/20 text-blue-200 rounded-full">
                            🏥 Medical History
                          </span>
                          <span className="px-2 py-1 bg-blue-500/20 text-blue-200 rounded-full">
                            📞 Emergency Contacts
                          </span>
                          <span className="px-2 py-1 bg-blue-500/20 text-blue-200 rounded-full">📸 Profile Photo</span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowPatientRegisterModal(true)}
                      className="px-6 py-3 bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 whitespace-nowrap"
                    >
                      Register Now
                    </button>
                  </div>
                </div>
              </div>
            )}

            <PageHeader
              title={getActiveTabTitle()}
              activeTab={activeTab}
              onBookAppointment={() => {
                if (!isPatientRegistered) {
                  toast.error("Please complete your registration first to book appointments")
                  setShowPatientRegisterModal(true)
                  return
                }
                console.log("PageHeader button clicked")
                navigate("/book-appointment")
              }}
            />
          </div>

          {/* Main Content */}
          <div className="bg-white/60 backdrop-blur-sm rounded-3xl shadow-xl border border-teal-100/50 p-6 lg:p-8 min-h-[600px]">
            {!isPatientRegistered ? (
              <div className="flex flex-col items-center justify-center h-96 text-center">
                <div className="p-4 bg-blue-100 rounded-full mb-4">
                  <UserPlus className="w-12 h-12 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Registration Required</h3>
                <p className="text-gray-600 mb-6 max-w-md">
                  Please complete your patient registration to access appointments, prescriptions, and other healthcare
                  services.
                </p>
                <button
                  onClick={() => setShowPatientRegisterModal(true)}
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 text-white font-semibold rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  Complete Registration
                </button>
              </div>
            ) : (
              renderContent()
            )}
          </div>
        </div>
      </main>

      {/* Patient Registration Modal */}
      <PatientRegisterModal
        isOpen={showPatientRegisterModal}
        onClose={() => {
          // Only allow closing if patient is already registered
          if (isPatientRegistered) {
            setShowPatientRegisterModal(false)
          }
        }}
        onSuccess={handlePatientRegistrationComplete}
        email={getEmailFromToken()}
        allowCancel={isPatientRegistered} // Only allow cancel if already registered
      />

      {/* All existing modals remain unchanged */}
      {showConsultationModal && (
        <ConsultationModal
          consultationData={consultationData}
          consultationLoading={consultationLoading}
          selectedAppointment={selectedAppointment}
          onClose={() => setShowConsultationModal(false)}
        />
      )}

      {showLogoutModal && <LogoutModal onConfirm={confirmLogout} onCancel={() => setShowLogoutModal(false)} />}

      {showSidebar && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-20 lg:hidden animate-fadeIn"
          onClick={() => setShowSidebar(false)}
        />
      )}

      {showRescheduleModal && (
        <div className="fixed inset-0 bg-gray-900/20 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
          <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 animate-fadeIn">
            <RescheduleForm
              appointmentId={appointmentToReschedule.appointmentId}
              doctorId={appointmentToReschedule.doctorId}
              onRescheduleSuccess={() => {
                fetchAppointments()
              }}
              onClose={() => {
                setShowRescheduleModal(false)
                setAppointmentToReschedule(null)
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
                setShowCancelModal(false)
                setAppointmentToCancel(null)
              }}
            />
          </div>
        </div>
      )}

      {showMedicineRequestForm && selectedMedicine && (
        <MedicineRequestForm
          medicine={selectedMedicine}
          onClose={() => {
            setShowMedicineRequestForm(false)
            setSelectedMedicine(null)
          }}
        />
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
