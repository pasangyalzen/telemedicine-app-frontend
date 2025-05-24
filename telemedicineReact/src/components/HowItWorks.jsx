import React from "react";
import { User, Calendar, ClipboardCheck, Heart, CheckCircle, Star } from "lucide-react";

const steps = [
  {
    icon: <User className="w-12 h-12 text-white" />,
    title: "Create Your Account",
    description: "Sign up easily and get started with your telemedicine journey in just 2 minutes.",
    highlight: "Quick Setup",
    number: "01"
  },
  {
    icon: <Calendar className="w-12 h-12 text-white" />,
    title: "Book Appointments",  
    description: "Schedule consultations with doctors and pharmacists at your convenience, 24/7.",
    highlight: "Instant Booking",
    number: "02"
  },
  {
    icon: <ClipboardCheck className="w-12 h-12 text-white" />,
    title: "Receive Prescriptions",
    description: "Get your prescriptions digitally and manage your health records efficiently.",
    highlight: "Digital First",
    number: "03"
  },
  {
    icon: <Heart className="w-12 h-12 text-white" />,
    title: "Stay Healthy",
    description: "Manage your health seamlessly with our continuous care and monitoring support.",
    highlight: "24/7 Care",
    number: "04"
  },
];

export default function HowItWorks() {
  return (
    <section className="relative bg-gradient-to-br from-teal-50 via-white to-cyan-50 py-20 px-6 overflow-hidden">
      {/* Floating Background Elements */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-r from-teal-50 to-cyan-50 rounded-full opacity-30 animate-pulse"></div>
      <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-r from-cyan-50 to-teal-50 rounded-full opacity-20 animate-pulse" style={{animationDelay: '1s'}}></div>
      <div className="absolute bottom-20 left-1/4 w-20 h-20 bg-gradient-to-r from-teal-25 to-cyan-25 rounded-full opacity-25 animate-pulse" style={{animationDelay: '2s'}}></div>
      
      <div className="relative max-w-7xl mx-auto text-center">
        {/* Header Section */}
        <div className="mb-16">
          <div className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full border border-teal-50 mb-6 shadow-sm">
            <CheckCircle className="w-4 h-4 text-teal-400" />
            <span className="text-teal-500 text-sm font-medium">Simple 4-Step Process</span>
          </div>
          
          <h2 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-teal-500 via-teal-400 to-cyan-400 bg-clip-text text-transparent mb-6">
            How It Works
          </h2>
          <p className="text-xl text-teal-400 max-w-2xl mx-auto leading-relaxed">
            Get started with premium healthcare in minutes. Our streamlined process makes quality care accessible to everyone.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {steps.map((step, index) => (
            <div 
              key={step.title} 
              className="group relative"
              style={{
                animation: `slideInUp 0.6s ease-out ${index * 0.1}s both`
              }}
            >
              {/* Connecting Line (hidden on mobile) */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-16 -right-4 w-8 h-0.5 bg-gradient-to-r from-teal-100 to-transparent z-0"></div>
              )}
              
              {/* Card */}
              <div className="relative bg-white/70 backdrop-blur-sm rounded-3xl p-8 border border-white/50 shadow-lg hover:shadow-2xl transition-all duration-500 group-hover:scale-105 group-hover:bg-white/80">
                {/* Number Badge */}
                <div className="absolute -top-3 -right-3 w-8 h-8 bg-gradient-to-r from-teal-400 to-cyan-400 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-lg">
                  {step.number}
                </div>
                
                {/* Highlight Badge */}
                <div className="absolute -top-2 left-6 px-3 py-1 bg-gradient-to-r from-teal-50 to-cyan-50 rounded-full border border-teal-100 opacity-0 group-hover:opacity-100 transition-all duration-300 transform -translate-y-1 group-hover:translate-y-0">
                  <span className="text-teal-500 text-xs font-semibold">{step.highlight}</span>
                </div>
                
                {/* Icon Container */}
                <div className="relative mb-6">
                  <div className="w-20 h-20 mx-auto bg-gradient-to-br from-teal-400 to-cyan-400 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                    {step.icon}
                    <div className="absolute inset-0 bg-white/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  
                  {/* Floating particles */}
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-teal-200 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 animate-bounce"></div>
                  <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-cyan-200 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-700 animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
                
                {/* Content */}
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-teal-600 group-hover:text-teal-500 transition-colors duration-300">
                    {step.title}
                  </h3>
                  <p className="text-teal-500 leading-relaxed group-hover:text-teal-400 transition-colors duration-300">
                    {step.description}
                  </p>
                </div>
                
                {/* Bottom Accent Line */}
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-gradient-to-r from-teal-300 to-cyan-300 rounded-full transition-all duration-300 group-hover:w-20"></div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Call to Action Section */}
        <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 border border-white/50 shadow-lg">
          <div className="flex flex-col items-center space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Star className="w-5 h-5 text-teal-400 fill-current" />
              <Star className="w-5 h-5 text-teal-400 fill-current" />
              <Star className="w-5 h-5 text-teal-400 fill-current" />
              <Star className="w-5 h-5 text-teal-400 fill-current" />
              <Star className="w-5 h-5 text-teal-400 fill-current" />
              <span className="text-teal-500 font-semibold ml-2">Trusted by 10,000+ patients</span>
            </div>
            <h3 className="text-2xl font-bold text-teal-600">Ready to get started?</h3>
            <p className="text-teal-500 text-center max-w-md">Join thousands of satisfied patients who've made the switch to convenient, quality healthcare.</p>
            <button className="mt-4 px-8 py-4 bg-gradient-to-r from-teal-400 to-cyan-400 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 hover:from-teal-500 hover:to-cyan-500">
              Start Your Journey Today
            </button>
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