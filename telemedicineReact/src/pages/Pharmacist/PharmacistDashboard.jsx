import { useState } from "react";
import { User, ChevronDown, LogOut, Pencil, Bell, Activity } from "lucide-react";
import PharmacistSidebar from "./PharmacistSidebar";
import Requests from "./components/Requests";
import Prescriptions from "./components/Prescriptions";
import Appointments from "./components/Appointments";
import Consultations from "./components/Consultations";
import InventoryManager from "./components/InventoryManager";

const PharmacistDashboard = () => {
  const [activeTab, setActiveTab] = useState("requests");
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Mock data for demonstration
  const pharmacistInfo = { fullName: "Dr. Sarah Johnson" };
  const error = null;

  const renderContent = () => {
    if (error) return <p className="text-red-600">Error loading data</p>;

    switch (activeTab) {
      case "requests":
        return <Requests />;
      case "prescriptions":
        return <Prescriptions />;
      case "appointments":
        return <Appointments />;
      case "consultations":
        return <Consultations />;
      case "inventory":                    // ADD THIS CASE
        return <InventoryManager />;
      default:
        return <div>Select a tab</div>;
    }
  };

  const getTabDisplayName = (tab) => {
    const names = {
      requests: "Patient Requests",
      prescriptions: "Prescriptions",
      appointments: "Appointments",
      consultations: "Consultations",
      inventory: "Inventory",            // ADD THIS FOR DISPLAY NAME
      support: "Help & Support",
    };
    return names[tab] || tab.charAt(0).toUpperCase() + tab.slice(1);
  };


  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-slate-900 via-teal-900 to-cyan-900 overflow-hidden">
      {/* Darker Top Navigation Bar */}
      <header className="bg-teal-900 shadow-xl border-b border-teal-800 relative z-30">
        <div className="px-8 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-teal-700 to-cyan-700 shadow-lg">
              <Activity className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-teal-300">
                TeleChakki
              </h1>
              <p className="text-sm text-teal-400 font-medium">Pharmacy Management System</p>
            </div>
          </div>

          <div className="flex items-center space-x-6">
            {/* Notifications */}
            <button className="relative p-3 bg-teal-800 hover:bg-teal-700 rounded-xl transition-all duration-300">
              <Bell className="w-5 h-5 text-teal-300" />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-600 text-white text-xs rounded-full flex items-center justify-center">3</span>
            </button>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-3 p-2 hover:bg-teal-800 rounded-xl transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-700 to-cyan-700 flex items-center justify-center text-white shadow-lg">
                  <User className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-teal-300">Dr. Sarah Johnson</p>
                  <p className="text-sm text-teal-400">Pharmacist</p>
                </div>
                <ChevronDown className="w-4 h-4 text-teal-300" />
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-teal-800/95 backdrop-blur-xl border border-teal-700 rounded-2xl shadow-2xl overflow-hidden z-40">
                  <button className="flex items-center px-6 py-4 hover:bg-teal-700 w-full text-left text-teal-300 transition-all duration-300">
                    <Pencil className="w-5 h-5 mr-3" /> Edit Profile
                  </button>
                  <hr className="border-teal-700" />
                  <button className="flex items-center px-6 py-4 hover:bg-red-700 w-full text-left text-red-500 transition-all duration-300">
                    <LogOut className="w-5 h-5 mr-3" /> Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="flex-shrink-0">
          <PharmacistSidebar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            pharmacist={pharmacistInfo}
          />
        </div>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-8">
            {/* Content Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-4xl font-black text-teal-300 mb-2">
                    {getTabDisplayName(activeTab)}
                  </h2>
                  <p className="text-teal-400 font-medium">
                    Manage your {activeTab === "requests" ? "patient requests" : activeTab} efficiently
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="px-4 py-2 bg-teal-800 text-teal-300 rounded-xl text-sm font-medium select-none">
                    {new Date().toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </div>
                </div>
              </div>
              <div className="h-1 w-32 bg-gradient-to-r from-teal-700 to-cyan-700 rounded-full"></div>
            </div>

            {/* Content Area */}
            <div className="bg-teal-900/80 rounded-3xl shadow-xl border border-teal-800/60 p-8 min-h-[600px] text-teal-200">
              {renderContent()}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default PharmacistDashboard;