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
      className={`fixed top-0 left-0 h-full w-72 bg-gradient-to-br from-teal-800 via-teal-700 to-teal-600 shadow-xl transition-transform z-30 ${showSidebar ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
    >
      {/* Header with refined gradient */}
      <div className="p-6 bg-gradient-to-r from-teal-900 to-teal-700 text-white border-b border-teal-500/30">
        <div className="flex items-center gap-2">
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
            <p className="font-semibold text-white text-lg">{patient?.fullName || "Patient"}</p>
            <div className="flex items-center mt-1">
              <span
                className={`w-2 h-2 rounded-full mr-2 ${
                  patient?.status ? "bg-teal-300" : "bg-red-400"
                }`}
              ></span>
              <p className="text-sm text-teal-200">
                {patient?.status ? "Active Patient" : "Inactive Patient"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation with improved styling */}
      <div className="p-4 text-sm text-white mt-2">
        <div className="flex items-center justify-between px-2 mb-4">
          <h2 className="text-xs font-semibold text-teal-200 uppercase tracking-wider">Main Menu</h2>
          <div className="h-px bg-gradient-to-r from-transparent via-teal-400/30 to-transparent flex-grow ml-3"></div>
        </div>

        <nav className="space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id)
                setShowSidebar(false)
              }}
              className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all duration-300
                ${
                  activeTab === item.id
                    ? "bg-gradient-to-r from-teal-500/40 to-teal-400/20 text-white font-medium shadow-lg border border-teal-400/20"
                    : "hover:bg-teal-600/40 text-teal-100 hover:text-white"
                }`}
            >
              <div
                className={`p-1.5 rounded-lg ${activeTab === item.id ? "bg-teal-200 text-teal-900" : "text-teal-200"}`}
              >
                {getIcon(item.icon)}
              </div>
              <span>{item.label}</span>
              {activeTab === item.id && <div className="ml-auto h-6 w-1 rounded-full bg-teal-300"></div>}
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
  )
}
