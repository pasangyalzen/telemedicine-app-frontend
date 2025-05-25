// ✅ Ensure you already have email from token
import { useEffect, useState } from "react";
import { getEmailFromToken } from "../auth/auth";
import { apiClient } from "./usePharmacistData";
import { User, FileText, Package, Calendar, Archive , Bell } from "lucide-react";

const PharmacistSidebar = ({ activeTab, setActiveTab }) => {
  const [pharmacist, setPharmacist] = useState(null);

  useEffect(() => {
    const fetchPharmacistInfo = async () => {
      const token = localStorage.getItem("token");
      const email = getEmailFromToken();
      if (!token || !email) return;

      try {
        const response = await apiClient.get(`/GetPharmacistByEmail/${email}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPharmacist(response.data);
      } catch (err) {
        console.error("Failed to fetch pharmacist profile info:", err);
      }
    };

    fetchPharmacistInfo();
  }, []);

  const menuItems = [
    { id: "requests", label: "Patient Requests", icon: User, color: "from-teal-400 to-cyan-400" },
    { id: "consultations", label: "Consultations", icon: FileText, color: "from-emerald-400 to-teal-400" },
    { id: "prescriptions", label: "Prescriptions", icon: Package, color: "from-teal-500 to-blue-400" },
    { id: "appointments", label: "Appointments", icon: Calendar, color: "from-cyan-400 to-teal-500" },
    // { id: "inventory", label: "Inventory", icon: Archive, color: "from-teal-400 to-emerald-400" },
  ];

  return (
    <aside className="w-64 bg-gradient-to-br from-teal-900 via-teal-800 to-cyan-900 shadow-2xl flex flex-col h-full relative overflow-hidden border-r border-teal-700/50">
      <div className="p-5 border-b border-teal-600/40 relative z-10">
        <div className="relative flex items-center space-x-3 bg-teal-800/50 backdrop-blur-xl rounded-2xl p-3 border border-teal-500/30 shadow-xl">
          <div className="relative">
            {pharmacist?.profileImage ? (
              <img
                src={`http://localhost:5186${pharmacist.profileImage}`}
                alt="Pharmacist"
                className="w-10 h-10 rounded-xl object-cover border-2 border-white/20 shadow-xl"
              />
            ) : (
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-200 to-cyan-300 flex items-center justify-center shadow-xl border-2 border-white/20">
                <User className="w-5 h-5 text-teal-900" />
              </div>
            )}
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full flex items-center justify-center shadow-lg border border-white">
              <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
            </div>
          </div>
          <div className="flex-1">
            <p className="text-xs text-teal-200/70 font-semibold uppercase tracking-wide mb-0.5">
              Pharmacist
            </p>
            <p className="text-base font-bold text-white leading-tight">
              {pharmacist?.fullName || ""}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <div className="flex-1 p-3 relative z-10 overflow-y-auto">
        <div className="flex items-center mb-4 px-2">
          <h3 className="text-xs font-bold text-teal-200/90 uppercase tracking-widest mr-2">Navigation</h3>
          <div className="h-px bg-gradient-to-r from-teal-300/40 via-cyan-300/60 to-transparent flex-grow"></div>
          <Bell className="w-4 h-4 text-teal-300/60 ml-2" />
        </div>

        <nav className="space-y-2">
          {menuItems.map(({ id, label, icon: Icon, color }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`group flex items-center gap-3 w-full px-3 py-3 rounded-lg transition-all duration-400 transform hover:scale-[1.03] relative overflow-hidden
                ${activeTab === id
                  ? "bg-gradient-to-r from-teal-500/70 via-cyan-400/50 to-teal-500/70 text-white font-semibold shadow-lg border border-teal-300/50 shadow-teal-500/40"
                  : "hover:bg-gradient-to-r hover:from-teal-600/60 hover:to-cyan-700/50 text-teal-100 hover:text-white hover:shadow-md hover:shadow-teal-500/30"
                }`}
            >
              {activeTab === id && (
                <>
                  <div className="absolute inset-0 bg-gradient-to-r from-teal-400/30 via-cyan-300/20 to-teal-400/30 animate-pulse rounded-lg" />
                  <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-teal-200 via-cyan-200 to-teal-300 rounded-r-full shadow-lg shadow-teal-300/70" />
                </>
              )}

              <div className={`relative p-2 rounded-lg transition-all duration-400 shadow-md ${
                activeTab === id
                  ? `bg-gradient-to-br ${color} text-white shadow-lg`
                  : "text-teal-300 group-hover:bg-teal-600/50 group-hover:text-teal-100 bg-teal-700/25"
              }`}>
                <Icon className="w-4 h-4" />
              </div>

              <div className="flex-1 relative z-10">
                <span className="font-semibold tracking-wide text-sm block select-none">
                  {label}
                </span>
              </div>

              {activeTab === id && (
                <div className="ml-auto relative z-10">
                  <div className="h-7 w-1.5 rounded-full bg-gradient-to-b from-teal-200 via-cyan-200 to-teal-300 shadow-md shadow-teal-300/70" />
                </div>
              )}
            </button>
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default PharmacistSidebar;