import { HelpCircle, User } from "lucide-react"
import { Clock, Calendar, FileText, FilePlus } from "lucide-react"

export const Sidebar = ({
  activeTab,
  setActiveTab,
  menuItems,
  patient,
  patientId,
  showSidebar,
  setShowSidebar,
}) => {
  // Map icon strings to actual components
  const getIcon = (iconName) => {
    switch (iconName) {
      case "Clock":
        return <Clock className="w-5 h-5" />
      case "Calendar":
        return <Calendar className="w-5 h-5" />
      case "FileText":
        return <FileText className="w-5 h-5" />
      case "FilePlus":
        return <FilePlus className="w-5 h-5" />
      default:
        return null
    }
  }

  return (
    <aside
      className={`fixed top-0 left-0 h-full w-72 bg-gradient-to-br from-teal-900 via-teal-800 to-teal-700 shadow-2xl transition-transform z-30 ${showSidebar ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 backdrop-blur-lg border-r border-teal-600/20`}
    >
      {/* Header with enhanced gradient and glow effect */}
      <div className="p-6 bg-gradient-to-r from-teal-950 via-teal-900 to-teal-800 text-white border-b border-teal-500/40 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-teal-400/10 to-transparent"></div>
        <div className="flex items-center gap-2 relative z-10">
          <div>
            <h1 className="text-3xl font-black bg-gradient-to-r from-teal-200 via-teal-100 to-teal-300 bg-clip-text text-transparent drop-shadow-lg">
              TeleChauki
            </h1>
            <p className="text-sm text-teal-200/80 mt-1 font-medium tracking-wide">Patient Section</p>
          </div>
        </div>
        <div className="absolute -bottom-1 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-teal-400/60 to-transparent"></div>
      </div>

      {/* User Profile with enhanced styling and animations */}
      <div className="p-5 border-b border-teal-500/30 bg-gradient-to-r from-teal-800/60 via-teal-700/40 to-teal-800/60 backdrop-blur-sm relative">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-300/5 to-transparent"></div>
        <div className="flex items-center space-x-4 relative z-10">
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-teal-300 via-teal-200 to-teal-400 flex items-center justify-center text-teal-900 shadow-xl border-3 border-teal-200/50 ring-2 ring-teal-400/30">
              <User className="w-8 h-8" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-gradient-to-br from-teal-400 to-teal-500 border-2 border-teal-800 flex items-center justify-center">
              <div className={`w-2 h-2 rounded-full ${patient?.status ? "bg-emerald-300" : "bg-red-400"} animate-pulse`}></div>
            </div>
          </div>
          <div className="flex-1">
            <p className="font-bold text-white text-lg tracking-wide drop-shadow-sm">
              {patient?.fullName || "Patient"}
            </p>
            <div className="flex items-center mt-2 bg-teal-700/30 rounded-full px-3 py-1">
              <span
                className={`w-2.5 h-2.5 rounded-full mr-2 shadow-sm ${
                  patient?.status ? "bg-emerald-300 shadow-emerald-300/50" : "bg-red-400 shadow-red-400/50"
                } animate-pulse`}
              ></span>
              <p className="text-sm text-teal-100 font-medium">
                {patient?.status ? "Active Patient" : "Inactive Patient"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation with enhanced styling and hover effects */}
      <div className="p-4 text-sm text-white mt-2 relative">
        <div className="flex items-center justify-between px-2 mb-6">
          <h2 className="text-xs font-bold text-teal-200/90 uppercase tracking-widest">Main Menu</h2>
          <div className="h-px bg-gradient-to-r from-transparent via-teal-300/40 to-transparent flex-grow ml-4"></div>
        </div>

        <nav className="space-y-3">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id)
                setShowSidebar(false)
              }}
              className={`group flex items-center gap-4 w-full px-4 py-4 rounded-2xl transition-all duration-300 transform hover:scale-[1.02] relative overflow-hidden
                ${
                  activeTab === item.id
                    ? "bg-gradient-to-r from-teal-500/50 via-teal-400/30 to-teal-500/40 text-white font-semibold shadow-2xl border border-teal-300/30 shadow-teal-500/20"
                    : "hover:bg-gradient-to-r hover:from-teal-600/40 hover:to-teal-700/30 text-teal-100 hover:text-white hover:shadow-lg"
                }`}
            >
              {/* Active indicator glow */}
              {activeTab === item.id && (
                <div className="absolute inset-0 bg-gradient-to-r from-teal-400/20 via-transparent to-teal-400/20 animate-pulse"></div>
              )}
              
              <div
                className={`relative p-2.5 rounded-xl transition-all duration-300 ${
                  activeTab === item.id 
                    ? "bg-gradient-to-br from-teal-200 to-teal-300 text-teal-900 shadow-lg" 
                    : "text-teal-200 group-hover:bg-teal-600/30 group-hover:text-teal-100"
                }`}
              >
                {getIcon(item.icon)}
              </div>
              
              <span className="font-medium tracking-wide relative z-10">{item.label}</span>
              
              {activeTab === item.id && (
                <div className="ml-auto relative z-10">
                  <div className="h-8 w-1.5 rounded-full bg-gradient-to-b from-teal-200 to-teal-400 shadow-lg shadow-teal-300/50"></div>
                </div>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Bottom section with enhanced help and support */}
     
    </aside>
  )
}