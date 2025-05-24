import React from "react";
import { Users, UserCheck, Building2, Calendar, TrendingUp, Sparkles } from "lucide-react";

export default function StatisticsSection({ data }) {
  if (!data) return null;

  const stats = [
    { 
      label: "Doctors Served", 
      value: data.totalDoctors || 0,
      icon: <UserCheck className="w-8 h-8 text-white" />,
      color: "from-teal-400 to-teal-500",
      bgAccent: "bg-teal-200",
      textColor: "text-teal-700"
    },
    { 
      label: "Patients Reached", 
      value: data.totalPatients || 0,
      icon: <Users className="w-8 h-8 text-white" />,
      color: "from-teal-300 to-teal-400",
      bgAccent: "bg-teal-100",
      textColor: "text-teal-600"
    },
    { 
      label: "Pharmacists", 
      value: data.totalPharmacists || 0,
      icon: <Building2 className="w-8 h-8 text-white" />,
      color: "from-teal-500 to-teal-600",
      bgAccent: "bg-teal-300",
      textColor: "text-teal-800"
    },
    { 
      label: "Appointments", 
      value: data.totalAppointments || 0,
      icon: <Calendar className="w-8 h-8 text-white" />,
      color: "from-teal-400 to-teal-500",
      bgAccent: "bg-teal-200",
      textColor: "text-teal-700"
    },
  ];

  return (
    <section className="relative bg-gradient-to-br from-teal-50 via-white to-teal-100 py-20 px-6 overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-teal-100/50 to-transparent rounded-full opacity-60 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-teal-200/40 to-transparent rounded-full opacity-50 blur-3xl"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-teal-100/30 rounded-full opacity-40 blur-2xl"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto text-center">
        {/* Header Section */}
        <div className="mb-16">
          <div className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full border border-teal-200 mb-6 shadow-sm">
            <TrendingUp className="w-4 h-4 text-teal-500" />
            <span className="text-teal-600 text-sm font-medium">Real-time Statistics</span>
          </div>
          
          <h2 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-teal-600 via-teal-500 to-teal-400 bg-clip-text text-transparent mb-6">
            Our Impact in Numbers
          </h2>
          <p className="text-xl text-teal-600 max-w-3xl mx-auto leading-relaxed">
            Join thousands of healthcare professionals and patients who trust our platform for quality care and seamless medical services.
          </p>
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {stats.map((stat, index) => (
            <div 
              key={stat.label} 
              className="group relative"
              style={{
                animation: `slideInUp 0.6s ease-out ${index * 0.15}s both`
              }}
            >
              {/* Card */}
              <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-teal-200/50 shadow-lg hover:shadow-xl transition-all duration-500 group-hover:scale-105 group-hover:bg-white/90 hover:border-teal-300/60">
                {/* Icon Container */}
                <div className="relative mb-6">
                  <div className={`w-16 h-16 mx-auto bg-gradient-to-br ${stat.color} rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110`}>
                    {stat.icon}
                    <div className="absolute inset-0 bg-white/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  
                  {/* Floating sparkle */}
                  <Sparkles className="absolute -top-1 -right-1 w-4 h-4 text-teal-400 opacity-0 group-hover:opacity-100 transition-all duration-500 animate-pulse" />
                </div>
                
                {/* Statistics Value */}
                <div className="mb-4">
                  <p className="text-4xl md:text-5xl font-extrabold text-teal-600 mb-2 group-hover:text-teal-500 transition-colors duration-300">
                    {stat.value.toLocaleString()}
                  </p>
                  <div className={`w-12 h-1 ${stat.bgAccent} rounded-full mx-auto transition-all duration-300 group-hover:w-16`}></div>
                </div>
                
                {/* Label */}
                <p className={`${stat.textColor} font-semibold text-lg group-hover:text-opacity-80 transition-all duration-300`}>
                  {stat.label}
                </p>
                
                {/* Bottom Glow Effect */}
                <div className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-1 bg-gradient-to-r ${stat.color} rounded-full transition-all duration-500 group-hover:w-20 opacity-60`}></div>
              </div>
              
              {/* Connecting Lines (hidden on mobile) */}
              {index < stats.length - 1 && (
                <div className="hidden lg:block absolute top-20 -right-4 w-8 h-0.5 bg-gradient-to-r from-teal-300/50 to-transparent z-0"></div>
              )}
            </div>
          ))}
        </div>
        
        {/* Bottom Achievement Section */}
        <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 border border-teal-200/60 shadow-lg">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-left">
              <h3 className="text-2xl font-bold text-teal-600 mb-2">Growing Every Day</h3>
              <p className="text-teal-500">Trusted by healthcare professionals nationwide</p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex -space-x-2">
                <div className="w-12 h-12 bg-gradient-to-r from-teal-400 to-teal-500 rounded-full border-3 border-white flex items-center justify-center shadow-lg">
                  <UserCheck className="w-6 h-6 text-white" />
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-teal-300 to-teal-400 rounded-full border-3 border-white flex items-center justify-center shadow-lg">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-teal-500 to-teal-600 rounded-full border-3 border-white flex items-center justify-center shadow-lg">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
              </div>
              
              <div className="text-center">
                <p className="text-2xl font-bold text-teal-600">99.9%</p>
                <p className="text-teal-500 text-sm">Uptime</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
}