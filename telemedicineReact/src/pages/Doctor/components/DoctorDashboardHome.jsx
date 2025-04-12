import React, { useEffect, useState } from "react";
import { fetchAppointmentSummary } from "../services/doctorAppointmentApi";
import { getDoctorIdByEmail } from "../services/doctorAppointmentApi"; 
import { getEmailFromToken } from "../../auth/auth";
import { Calendar, Clock, CheckCircle, XCircle, AlertTriangle, RefreshCw, Loader2 } from "lucide-react";

export default function AppointmentSummary() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // 🔐 1. Define doctor email here
  const doctorEmail = getEmailFromToken(); // or extract from token/localStorage
  
  useEffect(() => {
    const loadSummary = async () => {
      try {
        const doctorId = await getDoctorIdByEmail(doctorEmail);
        const data = await fetchAppointmentSummary(doctorId);
        setSummary(data);
      } catch (error) {
        console.error("Failed to fetch appointment summary", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadSummary();
  }, []);
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-50 rounded-2xl">
        <div className="text-center">
          <Loader2 className="animate-spin h-10 w-10 text-blue-500 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading your appointment summary...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-gray-800 flex items-center">
          <Calendar className="mr-2 text-blue-600" />
          <span>Appointments Summary</span>
        </h2>
        <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
          {new Date().toLocaleDateString('en-US', {month: 'long', day: 'numeric', year: 'numeric'})}
        </span>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <SummaryCard 
          label="Total Appointments" 
          value={summary.totalAppointments}
          icon={<Calendar className="h-6 w-6" />}
          color="blue" 
        />
        <SummaryCard 
          label="Confirmed" 
          value={summary.confirmedAppointments} 
          icon={<CheckCircle className="h-6 w-6" />}
          color="green" 
        />
        <SummaryCard 
          label="Completed" 
          value={summary.completedAppointments} 
          icon={<Clock className="h-6 w-6" />}
          color="purple" 
        />
        <SummaryCard 
          label="No Shows" 
          value={summary.noShowAppointments} 
          icon={<XCircle className="h-6 w-6" />}
          color="red" 
        />
        <SummaryCard 
          label="Today's Appointments" 
          value={summary.todayAppointments} 
          icon={<AlertTriangle className="h-6 w-6" />}
          color="teal" 
        />
        <SummaryCard 
          label="Rescheduled" 
          value={summary.rescheduledAppointments} 
          icon={<RefreshCw className="h-6 w-6" />}
          color="amber" 
        />
      </div>
    </div>
  );
}

function SummaryCard({ label, value, icon, color }) {
  // Map color names to Tailwind classes
  const colorClasses = {
    blue: {
      bg: "bg-blue-50",
      border: "border-blue-100", 
      text: "text-blue-600",
      hover: "hover:bg-blue-100"
    },
    green: {
      bg: "bg-green-50", 
      border: "border-green-100", 
      text: "text-green-600",
      hover: "hover:bg-green-100"
    },
    purple: {
      bg: "bg-purple-50", 
      border: "border-purple-100", 
      text: "text-purple-600",
      hover: "hover:bg-purple-100"
    },
    red: {
      bg: "bg-red-50", 
      border: "border-red-100", 
      text: "text-red-600",
      hover: "hover:bg-red-100"
    },
    teal: {
      bg: "bg-teal-50", 
      border: "border-teal-100", 
      text: "text-teal-600",
      hover: "hover:bg-teal-100"
    },
    amber: {
      bg: "bg-amber-50", 
      border: "border-amber-100", 
      text: "text-amber-600",
      hover: "hover:bg-amber-100"
    }
  };
  
  const classes = colorClasses[color];
  
  return (
    <div className={`${classes.bg} ${classes.border} ${classes.hover} p-6 rounded-xl border transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg`}>
      <div className="flex justify-between items-center mb-3">
        <p className={`text-md font-medium ${classes.text}`}>{label}</p>
        <div className={`${classes.text}`}>
          {icon}
        </div>
      </div>
      <p className="text-4xl font-bold text-gray-800">{value}</p>
    </div>
  );
}