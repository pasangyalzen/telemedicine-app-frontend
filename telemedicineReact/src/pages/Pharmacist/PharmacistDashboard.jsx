"use client"

import { useEffect, useState } from "react"
import { User, ChevronDown, LogOut, Pencil, Activity, UserPlus, Bell, Settings } from "lucide-react"
import { useNavigate } from "react-router-dom"
import PharmacistSidebar from "./PharmacistSidebar"
import Requests from "./components/Requests"
import Prescriptions from "./components/Prescriptions"
import Appointments from "./components/Appointments"
import Consultations from "./components/Consultations"
import InventoryManager from "./components/InventoryManager"
import axios from "axios"
import { getEmailFromToken } from "../auth/auth"
import ConfirmationModal from "../../components/ConfirmationModal"
import PharmacistSetupForm from "./components/PharmacistSetUpForm"

const apiClient = axios.create({
  baseURL: "http://localhost:5186/api/Pharmacist",
  headers: {
    "Content-Type": "application/json",
  },
})

const PharmacistDashboard = () => {
  const [activeTab, setActiveTab] = useState("requests")
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [pharmacistInfo, setPharmacistInfo] = useState(null)
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const [showSetupForm, setShowSetupForm] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()

  const fetchPharmacistInfo = async () => {
    const token = localStorage.getItem("token")
    if (!token) {
      setIsLoading(false)
      return
    }

    try {
      const email = getEmailFromToken()
      if (!email) {
        setIsLoading(false)
        return
      }

      const response = await apiClient.get(`/GetPharmacistByEmail/${email}`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      setPharmacistInfo(response.data)
    } catch (err) {
      console.error("Failed to fetch pharmacist info:", err)
      // If pharmacist doesn't exist, set empty object to trigger registration
      setPharmacistInfo({})
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchPharmacistInfo()
  }, [])

  const handleLogoutConfirm = () => {
    localStorage.clear()
    navigate("/")
  }

  const handleSetupComplete = () => {
    setShowSetupForm(false)
    // Refresh pharmacist info after successful registration
    fetchPharmacistInfo()
  }

  const renderContent = () => {
    switch (activeTab) {
      case "requests":
        return <Requests />
      case "prescriptions":
        return <Prescriptions />
      case "appointments":
        return <Appointments />
      case "consultations":
        return <Consultations />
      case "inventory":
        return <InventoryManager />
      default:
        return <div>Select a tab</div>
    }
  }

  const getTabDisplayName = (tab) => {
    const names = {
      requests: "Patient Requests",
      prescriptions: "Prescriptions",
      appointments: "Appointments",
      consultations: "Consultations",
      inventory: "Inventory",
      support: "Help & Support",
    }
    return names[tab] || tab.charAt(0).toUpperCase() + tab.slice(1)
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-teal-900 to-emerald-900">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-teal-300/30 border-t-teal-300 mx-auto mb-6"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Activity className="w-6 h-6 text-teal-300 animate-pulse" />
            </div>
          </div>
          <p className="text-teal-300 text-xl font-medium">Loading Dashboard...</p>
          <p className="text-teal-400 text-sm mt-2">Please wait while we prepare your workspace</p>
        </div>
      </div>
    )
  }

  // Check if pharmacist registration is incomplete
  const isRegistrationIncomplete = !pharmacistInfo || !pharmacistInfo.fullName || !pharmacistInfo.pharmacyName

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-slate-900 via-teal-900 to-emerald-900 overflow-hidden">
      {/* Enhanced Header */}
      <header className="bg-gradient-to-r from-teal-900/95 via-teal-800/95 to-emerald-900/95 backdrop-blur-xl shadow-2xl border-b border-teal-700/50 relative z-30">
        <div className="px-8 py-5 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-teal-600 to-emerald-600 shadow-xl transform hover:scale-105 transition-transform duration-300">
              <Activity className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-black bg-gradient-to-r from-teal-300 to-emerald-300 bg-clip-text text-transparent">
                TeleChauki
              </h1>
              <p className="text-sm text-teal-400 font-medium">Pharmacy Management System</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Registration Status - Enhanced UI */}
            {isRegistrationIncomplete && (
              <div className="flex items-center space-x-3 px-4 py-2 bg-gradient-to-r from-amber-600/20 to-orange-600/20 border border-amber-500/30 rounded-2xl backdrop-blur-sm">
                <div className="relative">
                  <UserPlus className="w-5 h-5 text-amber-400" />
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-orange-500 rounded-full animate-pulse"></div>
                </div>
                <div className="flex flex-col">
                  <span className="text-amber-300 text-xs font-semibold uppercase tracking-wide">Setup Required</span>
                  <button
                    onClick={() => setShowSetupForm(true)}
                    className="text-amber-200 text-sm hover:text-white transition-colors font-medium"
                  >
                    Complete Registration →
                  </button>
                </div>
              </div>
            )}

            {/* Notification Bell */}
            {/* <button className="relative p-3 hover:bg-teal-800/50 rounded-xl transition-all duration-300 group">
              <Bell className="w-5 h-5 text-teal-300 group-hover:text-white transition-colors" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
            </button> */}

            {/* Settings */}
            {/* <button className="p-3 hover:bg-teal-800/50 rounded-xl transition-all duration-300 group">
              <Settings className="w-5 h-5 text-teal-300 group-hover:text-white transition-colors" />
            </button> */}

            {/* User Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-3 p-3 hover:bg-teal-800/50 rounded-2xl transition-all duration-300 border border-teal-700/30 hover:border-teal-600/50 backdrop-blur-sm"
              >
                {pharmacistInfo?.profileImage ? (
                  <img
                    src={`http://localhost:5186${pharmacistInfo.profileImage}`}
                    alt="Pharmacist"
                    className="w-11 h-11 rounded-xl object-cover border-2 border-teal-500/50 shadow-xl"
                  />
                ) : (
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-teal-600 to-emerald-600 flex items-center justify-center text-white shadow-xl">
                    <User className="w-6 h-6" />
                  </div>
                )}
                <div className="text-left hidden md:block">
                  <p className="font-semibold text-teal-300 text-sm">{pharmacistInfo?.fullName || "Pharmacist"}</p>
                  <p className="text-xs text-teal-400 truncate max-w-32">
                    {pharmacistInfo?.email || getEmailFromToken() || "Pharmacist"}
                  </p>
                </div>
                <ChevronDown className={`w-4 h-4 text-teal-300 transition-transform duration-300 ${showUserMenu ? 'rotate-180' : ''}`} />
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-3 w-64 bg-gradient-to-br from-teal-800/95 to-emerald-800/95 backdrop-blur-xl border border-teal-600/50 rounded-2xl shadow-2xl overflow-hidden z-40 animate-in slide-in-from-top-2 duration-200">
                  {isRegistrationIncomplete && (
                    <>
                      <div className="px-6 py-4 border-b border-teal-700/50 bg-gradient-to-r from-amber-600/20 to-orange-600/20">
                        <button
                          onClick={() => {
                            setShowSetupForm(true)
                            setShowUserMenu(false)
                          }}
                          className="flex items-center w-full text-left text-amber-300 hover:text-white transition-colors group"
                        >
                          <div className="relative mr-3">
                            <UserPlus className="w-5 h-5" />
                            <div className="absolute -top-1 -right-1 w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                          </div>
                          <div>
                            <div className="font-semibold">Complete Registration</div>
                            <div className="text-xs text-amber-400 group-hover:text-amber-200">Setup your pharmacy profile</div>
                          </div>
                        </button>
                      </div>
                    </>
                  )}
                  <button className="flex items-center px-6 py-4 hover:bg-teal-700/50 w-full text-left text-teal-300 hover:text-white transition-all duration-300 group">
                    <Pencil className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" />
                    <div>
                      <div className="font-medium">Edit Profile</div>
                      <div className="text-xs text-teal-400 group-hover:text-teal-200">Update your information</div>
                    </div>
                  </button>
                  <hr className="border-teal-700/50" />
                  <button
                    onClick={() => setShowLogoutModal(true)}
                    className="flex items-center px-6 py-4 hover:bg-red-700/30 w-full text-left text-red-400 hover:text-red-300 transition-all duration-300 group"
                  >
                    <LogOut className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" />
                    <div>
                      <div className="font-medium">Logout</div>
                      <div className="text-xs text-red-500 group-hover:text-red-400">Sign out of your account</div>
                    </div>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <div className="flex-shrink-0">
          <PharmacistSidebar activeTab={activeTab} setActiveTab={setActiveTab} pharmacist={pharmacistInfo} />
        </div>

        <main className="flex-1 overflow-y-auto">
          <div className="p-8">
            {/* Enhanced Registration Notice */}
            {isRegistrationIncomplete && (
              <div className="mb-8 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-amber-600/10 to-orange-600/10 rounded-3xl"></div>
                <div className="relative p-6 bg-gradient-to-r from-amber-900/30 to-orange-900/30 border border-amber-600/30 rounded-3xl backdrop-blur-sm">
                  <div className="flex items-start space-x-4">
                    <div className="relative">
                      <div className="p-3 bg-gradient-to-br from-amber-600 to-orange-600 rounded-2xl shadow-xl">
                        <UserPlus className="w-6 h-6 text-white" />
                      </div>
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 rounded-full animate-pulse border-2 border-amber-300"></div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-amber-300 font-bold text-lg mb-2">Registration Incomplete</h3>
                      <p className="text-amber-200 mb-4 leading-relaxed">
                        Welcome to TeleChauki! To unlock all pharmacy management features and start serving patients, 
                        please complete your pharmacist registration with your professional details.
                      </p>
                      <div className="flex flex-wrap gap-3">
                        <button
                          onClick={() => setShowSetupForm(true)}
                          className="px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white rounded-xl transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
                        >
                          Complete Registration Now
                        </button>
                        <div className="flex items-center space-x-2 text-amber-300 text-sm">
                          <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
                          <span>Required for full access</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Enhanced Page Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-4xl font-black bg-gradient-to-r from-teal-300 to-emerald-300 bg-clip-text text-transparent mb-3">
                    {getTabDisplayName(activeTab)}
                  </h2>
                  <p className="text-teal-400 font-medium text-lg">
                    Manage your {activeTab === "requests" ? "patient requests" : activeTab} efficiently and effectively
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="px-6 py-3 bg-gradient-to-r from-teal-800/80 to-emerald-800/80 backdrop-blur-sm text-teal-300 rounded-2xl text-sm font-medium border border-teal-700/50 shadow-lg">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                      <span>
                        {new Date().toLocaleDateString("en-US", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="h-1.5 w-40 bg-gradient-to-r from-teal-600 via-emerald-600 to-teal-600 rounded-full shadow-lg"></div>
            </div>

            {/* Enhanced Content Container */}
            <div className="relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-teal-900/20 to-emerald-900/20 rounded-3xl"></div>
              <div className="relative bg-gradient-to-br from-teal-900/60 to-emerald-900/40 backdrop-blur-xl rounded-3xl shadow-2xl border border-teal-700/50 p-8 min-h-[600px] text-teal-100">
                {renderContent()}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Setup Form Modal - No changes to logic */}
      <PharmacistSetupForm
        isOpen={showSetupForm}
        onClose={() => setShowSetupForm(false)}
        onSuccess={handleSetupComplete}
        email={getEmailFromToken()}
      />

      {/* Logout Confirmation Modal - No changes to logic */}
      {showLogoutModal && (
        <ConfirmationModal
          message="Are you sure you want to logout?"
          actionLabel="Logout"
          onConfirm={handleLogoutConfirm}
          onCancel={() => setShowLogoutModal(false)}
        />
      )}
    </div>
  )
}

export default PharmacistDashboard