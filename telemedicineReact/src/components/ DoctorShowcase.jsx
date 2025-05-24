import React, { useEffect, useState } from "react";
import { fetchDoctors } from "../pages/Admin/services/doctorApi";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, Star, MapPin, Calendar, Award, DollarSign, GraduationCap, Building2, Phone, Mail } from "lucide-react";

const DoctorShowcase = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadDoctors = async () => {
      try {
        const data = await fetchDoctors();
        if (Array.isArray(data.doctors)) {
          setDoctors(data.doctors);
        } else {
          console.warn("Expected array but received:", data);
          setDoctors([]);
        }
      } catch (err) {
        setError("Failed to fetch doctors.");
        console.error("Error fetching doctors:", err);
      } finally {
        setLoading(false);
      }
    };

    loadDoctors();
  }, []);

  // Auto-swipe functionality
  useEffect(() => {
    if (!isAutoPlaying || doctors.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === doctors.length - 1 ? 0 : prevIndex + 1
      );
    }, 2500); // Change slide every 4 seconds

    return () => clearInterval(interval);
  }, [doctors.length, isAutoPlaying]);

  const nextDoctor = () => {
    setCurrentIndex(currentIndex === doctors.length - 1 ? 0 : currentIndex + 1);
  };

  const prevDoctor = () => {
    setCurrentIndex(currentIndex === 0 ? doctors.length - 1 : currentIndex - 1);
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 to-cyan-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-teal-300 border-t-teal-600 mx-auto mb-4"></div>
          <p className="text-teal-700 text-lg font-medium">Loading our amazing doctors...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 to-cyan-100 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-2xl shadow-xl border border-red-200">
          <div className="text-red-500 text-6xl mb-4">⚕️</div>
          <p className="text-red-600 text-lg font-medium">{error}</p>
        </div>
      </div>
    );
  }

  if (doctors.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 to-cyan-100 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-2xl shadow-xl">
          <div className="text-teal-400 text-6xl mb-4">👨‍⚕️</div>
          <p className="text-teal-700 text-lg font-medium">No doctors found.</p>
        </div>
      </div>
    );
  }

  const currentDoctor = doctors[currentIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-teal-100 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent mb-4">
            Meet Our Expert Doctors
          </h1>
          <p className="text-teal-700 text-lg max-w-2xl mx-auto">
            Discover our team of highly qualified medical professionals dedicated to providing exceptional healthcare services
          </p>
        </div>

        {/* Main Showcase Container */}
        <div className="relative">
          <div 
            className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-teal-100"
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
          >
            <div className="flex flex-col lg:flex-row min-h-[600px]">
              {/* Left Side - Doctor Image */}
              <div className="lg:w-2/5 relative bg-gradient-to-br from-teal-100 to-cyan-200 flex items-center justify-center p-8">
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-teal-400 to-cyan-400 rounded-full blur-2xl opacity-30 group-hover:opacity-40 transition-opacity duration-500"></div>
                  <div className="relative w-80 h-80 rounded-full overflow-hidden border-8 border-white shadow-2xl">
                    <img
                    src={`http://localhost:5186${currentDoctor.profileImage}`}
                    alt={currentDoctor.fullName}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = "/default-doctor.png";
                    }}
                    />
                  </div>
                  {/* Floating Elements */}
                  <div className="absolute -top-4 -right-4 bg-teal-500 text-white p-3 rounded-full shadow-lg">
                    <Star className="w-6 h-6 fill-current" />
                  </div>
                  <div className="absolute -bottom-4 -left-4 bg-cyan-500 text-white p-3 rounded-full shadow-lg">
                    <Award className="w-6 h-6" />
                  </div>
                </div>
              </div>

              {/* Right Side - Doctor Information */}
              <div className="lg:w-3/5 p-12 flex flex-col justify-center">
                <div className="space-y-6">
                  {/* Name and Specialization */}
                  <div>
                    <h2 className="text-4xl font-bold text-gray-800 mb-2">
                      Dr. {currentDoctor.fullName}
                    </h2>
                    <div className="flex items-center gap-2 mb-4">
                      <div className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white px-4 py-2 rounded-full text-lg font-semibold">
                        {currentDoctor.specialization || "General Practitioner"}
                      </div>
                    </div>
                  </div>

                  {/* Key Information Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-center gap-3 p-4 bg-teal-50 rounded-xl border border-teal-100">
                      <Calendar className="w-6 h-6 text-teal-600" />
                      <div>
                        <p className="text-sm text-teal-600 font-medium">Experience</p>
                        <p className="text-lg font-semibold text-gray-800">{currentDoctor.yearsOfExperience} Years</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-4 bg-cyan-50 rounded-xl border border-cyan-100">
                      <DollarSign className="w-6 h-6 text-cyan-600" />
                      <div>
                        <p className="text-sm text-cyan-600 font-medium">Consultation Fee</p>
                        <p className="text-lg font-semibold text-gray-800">NPR {currentDoctor.consultationFee}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-4 bg-teal-50 rounded-xl border border-teal-100">
                      <Building2 className="w-6 h-6 text-teal-600" />
                      <div>
                        <p className="text-sm text-teal-600 font-medium">Clinic</p>
                        <p className="text-lg font-semibold text-gray-800">{currentDoctor.clinicName}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-4 bg-cyan-50 rounded-xl border border-cyan-100">
                      <MapPin className="w-6 h-6 text-cyan-600" />
                      <div>
                        <p className="text-sm text-cyan-600 font-medium">Location</p>
                        <p className="text-lg font-semibold text-gray-800">{currentDoctor.clinicAddress}</p>
                      </div>
                    </div>
                  </div>

                  {/* Additional Information */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-teal-50 to-cyan-50 rounded-xl border border-teal-100">
                      <GraduationCap className="w-6 h-6 text-teal-600" />
                      <div>
                        <p className="text-sm text-teal-600 font-medium">Education</p>
                        <p className="text-lg font-semibold text-gray-800">{currentDoctor.medicalCollege}</p>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                      <div className="flex items-center gap-3 p-4 bg-teal-50 rounded-xl border border-teal-100 flex-1">
                        <Phone className="w-5 h-5 text-teal-600" />
                        <div>
                          <p className="text-sm text-teal-600 font-medium">Phone</p>
                          <p className="text-base font-semibold text-gray-800">{currentDoctor.phoneNumber}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-4 bg-cyan-50 rounded-xl border border-cyan-100 flex-1">
                        <Mail className="w-5 h-5 text-cyan-600" />
                        <div>
                          <p className="text-sm text-cyan-600 font-medium">Email</p>
                          <p className="text-base font-semibold text-gray-800 truncate">{currentDoctor.email}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <button
                  onClick={() => navigate("/login")}
                   className="w-full sm:w-auto bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white font-bold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                    Book Consultation
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prevDoctor}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white hover:bg-teal-50 p-3 rounded-full shadow-lg border border-teal-100 transition-all duration-300 hover:scale-110"
          >
            <ChevronLeft className="w-6 h-6 text-teal-600" />
          </button>
          <button
            onClick={nextDoctor}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white hover:bg-teal-50 p-3 rounded-full shadow-lg border border-teal-100 transition-all duration-300 hover:scale-110"
          >
            <ChevronRight className="w-6 h-6 text-teal-600" />
          </button>
        </div>

        {/* Dots Indicator */}
        <div className="flex justify-center mt-8 gap-3">
          {doctors.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-4 h-4 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? 'bg-gradient-to-r from-teal-500 to-cyan-500 scale-125'
                  : 'bg-teal-200 hover:bg-teal-300'
              }`}
            />
          ))}
        </div>

        {/* Doctor Counter */}
        <div className="text-center mt-6">
          <p className="text-teal-600 font-medium">
            Doctor {currentIndex + 1} of {doctors.length}
          </p>
        </div>
      </div>
    </div>
  );
};

export default DoctorShowcase;