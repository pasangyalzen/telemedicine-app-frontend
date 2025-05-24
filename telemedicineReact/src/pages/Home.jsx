// src/pages/Home.jsx
import { useNavigate } from "react-router-dom";
import Navbar from "../layouts/Navbar";
import Button from "../components/Button";
import BackGroundVideo from "../assets/LandingPageVideo.mp4";
import DoctorShowcase from "../components/ DoctorShowcase";
import PharmacistShowcase from "../components/PharmacistShowcase";
import Footer from "../components/Footer";
import StatisticsContainer from "../components/StatisticsContainer";
import HowItWorks from "../components/HowItWorks";
// import TestimonialsCarousel from "../components/TestimonialCarousel";
import FeatureHighlights from "../components/FeatureHighlights";
import { PATHS } from "../constants/path";

export default function Home() {
  return (
    <div className="bg-gradient-to-br from-teal-25 via-white to-cyan-25 min-h-screen">
      <div className="fixed top-0 left-0 right-0 z-50">
        <Navbar />
      </div>

      <div className="h-max w-screen flex flex-col justify-center text-center pt-20">
        {/* Hero Section with Light Teal Background */}
        <div className="min-h-screen w-full bg-gradient-to-br from-teal-50 via-teal-25 to-cyan-50 px-8 py-12 flex items-center relative overflow-hidden">
          {/* Floating Background Elements */}
          <div className="absolute top-20 left-10 w-40 h-40 bg-gradient-to-r from-teal-100 to-cyan-100 rounded-full opacity-40 animate-pulse"></div>
          <div className="absolute top-1/3 right-20 w-32 h-32 bg-gradient-to-r from-cyan-100 to-teal-100 rounded-full opacity-30 animate-pulse" style={{animationDelay: '1s'}}></div>
          <div className="absolute bottom-32 left-1/4 w-24 h-24 bg-gradient-to-r from-teal-75 to-cyan-75 rounded-full opacity-35 animate-pulse" style={{animationDelay: '2s'}}></div>
          
          <HomeInfo />
        </div>

        {/* Statistics Section */}
        <StatisticsContainer />

        {/* How It Works Section */}
        <HowItWorks />

        {/* Testimonials
        <TestimonialsCarousel /> */}

        {/* Feature Highlights */}
        <FeatureHighlights />

        {/* Animated Doctors Section */}
        <DoctorShowcase />

        {/* Animated Pharmacists Section */}
        <PharmacistShowcase />

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
}

function HomeInfo() {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 relative z-10">
      <div className="space-y-8 flex flex-col justify-center text-center lg:text-left">
        {/* Trust Badge */}
        <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-teal-200 shadow-sm w-fit mx-auto lg:mx-0">
          <div className="w-2 h-2 bg-teal-500 rounded-full animate-pulse"></div>
          <span className="text-teal-700 text-sm font-medium">Trusted by 1M+ providers</span>
        </div>

        <div className="space-y-6">
          <h1 className="text-teal-900 text-5xl lg:text-7xl font-bold leading-tight">
            The world's
            <br /> most loved{" "}
            <br />
            <span className="relative inline-block">
              <span className="bg-gradient-to-r from-teal-600 via-cyan-600 to-teal-600 bg-clip-text text-transparent">
                telemedicine
              </span>
              {/* Decorative underline */}
              <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-teal-400 to-cyan-400 rounded-full opacity-80"></div>
            </span>
            <br /> solution
          </h1>
        </div>

        <p className="text-teal-700 text-xl lg:text-2xl leading-relaxed max-w-lg mx-auto lg:mx-0">
          Experience premium healthcare with cutting-edge technology and
          personalized care that patients love.
        </p>

        <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
          <button
            onClick={() => navigate(PATHS.REGISTER)}
            className="px-8 py-4 bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 hover:from-teal-600 hover:to-cyan-600"
          >
            Get started for free
          </button>
          <button className="px-8 py-4 bg-white/80 backdrop-blur-sm text-teal-700 font-semibold rounded-full border-2 border-teal-200 hover:border-teal-300 hover:bg-white/90 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
            Schedule a Clinic demo
          </button>
        </div>

        {/* Feature Pills */}
        <div className="flex flex-wrap gap-3 justify-center lg:justify-start pt-4">
          <div className="px-4 py-2 bg-teal-100 text-teal-700 text-sm font-medium rounded-full">
            ✓ HIPAA Compliant
          </div>
          <div className="px-4 py-2 bg-cyan-100 text-cyan-700 text-sm font-medium rounded-full">
            ✓ 24/7 Support
          </div>
          <div className="px-4 py-2 bg-teal-100 text-teal-700 text-sm font-medium rounded-full">
            ✓ Easy Integration
          </div>
        </div>
      </div>

      {/* Video Container with Enhanced Design */}
      <div className="relative group">
        {/* Glow Effect */}
        <div className="absolute -inset-4 bg-gradient-to-r from-teal-200 to-cyan-200 rounded-3xl opacity-30 group-hover:opacity-50 transition-opacity duration-500 blur-xl"></div>
        
        {/* Main Video Container */}
        <div className="relative bg-white/20 backdrop-blur-sm rounded-3xl h-[600px] w-full overflow-hidden border border-white/30 shadow-2xl group-hover:shadow-3xl transition-all duration-500">
          {/* Decorative Corner Elements */}
          <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-teal-300 rounded-tl-lg opacity-60"></div>
          <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-cyan-300 rounded-tr-lg opacity-60"></div>
          <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-teal-300 rounded-bl-lg opacity-60"></div>
          <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-cyan-300 rounded-br-lg opacity-60"></div>
          
          {/* Video */}
          <video
            className="absolute inset-0 w-full h-full object-cover rounded-3xl"
            src={BackGroundVideo}
            autoPlay
            loop
            muted
            playsInline
          ></video>
          
          {/* Overlay for better text readability if needed */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent rounded-3xl"></div>
          
          {/* Play indicator (optional) */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
              <div className="w-0 h-0 border-l-6 border-l-white border-t-4 border-t-transparent border-b-4 border-b-transparent ml-1"></div>
            </div>
          </div>
        </div>
        
        {/* Floating Elements */}
        <div className="absolute -top-6 -right-6 w-12 h-12 bg-gradient-to-r from-teal-200 to-cyan-200 rounded-full opacity-60 animate-bounce"></div>
        <div className="absolute -bottom-4 -left-4 w-8 h-8 bg-gradient-to-r from-cyan-200 to-teal-200 rounded-full opacity-50 animate-bounce" style={{animationDelay: '0.5s'}}></div>
      </div>
    </div>
  );
}