import React from "react";
import { ShieldCheck, Video, Smartphone, Heart } from "lucide-react";

const features = [
  {
    icon: <ShieldCheck className="w-12 h-12 text-teal-300" />,
    title: "Secure & Private",
    description:
      "We prioritize your privacy and security with industry-leading data protection.",
    highlight: "Bank-level encryption"
  },
  {
    icon: <Video className="w-12 h-12 text-teal-300" />,
    title: "HD Video Consultations",
    description: "Connect with healthcare professionals via high-quality video calls.",
    highlight: "Crystal clear quality"
  },
  {
    icon: <Smartphone className="w-12 h-12 text-teal-300" />,
    title: "Mobile Friendly",
    description: "Access TeleChauki on any device — anytime, anywhere.",
    highlight: "Cross-platform"
  },
  {
    icon: <Heart className="w-12 h-12 text-teal-300" />,
    title: "Continuous Care",
    description:
      "Track your health over time and get personalized follow-up plans.",
    highlight: "24/7 monitoring"
  },
];

export default function FeatureHighlights() {
  return (
    <section className="bg-gradient-to-br from-teal-100 via-slate-50 to-cyan-100 py-20 px-6 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-teal-50 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
      <div className="absolute top-0 right-0 w-72 h-72 bg-cyan-50 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-96 h-96 bg-teal-25 rounded-full mix-blend-multiply filter blur-2xl opacity-25"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-teal-25 text-teal-400 px-4 py-2 rounded-full text-sm font-medium mb-6 border border-teal-50">
            <Heart className="w-4 h-4" />
            <span>Trusted Healthcare Platform</span>
          </div>
          <h2 className="text-5xl font-bold bg-gradient-to-r from-teal-400 to-teal-300 bg-clip-text text-transparent mb-4">
            Why Choose TeleChauki?
          </h2>
          <p className="text-teal-300 text-lg max-w-2xl mx-auto leading-relaxed">
            Experience the future of healthcare with our cutting-edge telemedicine platform designed for your convenience and peace of mind.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map(({ icon, title, description, highlight }, index) => (
            <div 
              key={title} 
              className="group relative bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-2xl border border-teal-50/50 transition-all duration-500 hover:scale-105 hover:bg-white"
              style={{
                animationDelay: `${index * 150}ms`
              }}
            >
              {/* Gradient Border Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-teal-50 via-teal-25 to-cyan-25 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 blur-sm"></div>
              
              {/* Icon Container */}
              <div className="relative mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-teal-25 to-teal-50 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300 shadow-inner">
                  <div className="absolute inset-0 bg-gradient-to-br from-teal-50 to-transparent rounded-2xl opacity-50"></div>
                  <div className="relative z-10">
                    {icon}
                  </div>
                </div>
                {/* Floating highlight badge */}
                <div className="absolute -top-2 -right-2 bg-gradient-to-r from-teal-200 to-teal-300 text-teal-700 text-xs px-2 py-1 rounded-full font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {highlight}
                </div>
              </div>

              {/* Content */}
              <div className="text-center space-y-4">
                <h3 className="text-xl font-bold text-teal-500 group-hover:text-teal-400 transition-colors duration-300">
                  {title}
                </h3>
                <p className="text-teal-400 leading-relaxed text-sm group-hover:text-teal-500 transition-colors duration-300">
                  {description}
                </p>
              </div>

              {/* Bottom accent line */}
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-1 bg-gradient-to-r from-teal-200 to-teal-300 rounded-full group-hover:w-16 transition-all duration-500"></div>
            </div>
          ))}
        </div>

        {/* Bottom CTA Section */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center gap-4 bg-gradient-to-r from-teal-25 to-cyan-25 p-6 rounded-2xl border border-teal-50 shadow-lg">
            <div className="flex -space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-teal-200 to-teal-300 rounded-full border-2 border-white flex items-center justify-center">
                <Heart className="w-5 h-5 text-white fill-current" />
              </div>
              <div className="w-10 h-10 bg-gradient-to-r from-cyan-200 to-teal-200 rounded-full border-2 border-white flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-white" />
              </div>
              <div className="w-10 h-10 bg-gradient-to-r from-teal-300 to-cyan-300 rounded-full border-2 border-white flex items-center justify-center">
                <Video className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className="text-left">
              <p className="text-teal-500 font-semibold">Join thousands of satisfied patients</p>
              <p className="text-teal-400 text-sm">Experience healthcare reimagined</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}