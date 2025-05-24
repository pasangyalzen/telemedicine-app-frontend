import { useEffect, useState } from "react";
import { fetchPharmacists } from "../pages/Admin/services/pharmacistApi";
import { ChevronLeft, ChevronRight, Phone, Mail, MapPin, Building2, Clock, Briefcase, Star, Award } from "lucide-react";

export default function PharmacistShowcase() {
  const [pharmacists, setPharmacists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    const loadPharmacists = async () => {
      try {
        const data = await fetchPharmacists();

        if (Array.isArray(data?.pharmacists)) {
          setPharmacists(data.pharmacists);
        } else {
          console.warn("Expected `data.pharmacists` to be an array. Got:", data);
          setPharmacists([]);
        }
      } catch (err) {
        setError("Failed to load pharmacists.");
        console.error("❌ Pharmacist load error:", err);
      } finally {
        setLoading(false);
      }
    };

    loadPharmacists();
  }, []);

  useEffect(() => {
    if (!isAutoPlaying || pharmacists.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === pharmacists.length - 1 ? 0 : prevIndex + 1
      );
    }, 2500); // Updated to 2500ms as requested

    return () => clearInterval(interval);
  }, [pharmacists.length, isAutoPlaying]);

  const nextPharmacist = () => {
    setCurrentIndex((prev) => (prev === pharmacists.length - 1 ? 0 : prev + 1));
  };

  const prevPharmacist = () => {
    setCurrentIndex((prev) => (prev === 0 ? pharmacists.length - 1 : prev - 1));
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-300 border-t-blue-600 mx-auto mb-4"></div>
          <p className="text-blue-700 text-lg font-medium">Loading our trusted pharmacists...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-2xl shadow-xl border border-red-200">
          <div className="text-red-500 text-6xl mb-4">💊</div>
          <p className="text-red-600 text-lg font-medium">{error}</p>
        </div>
      </div>
    );
  }

  if (pharmacists.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-2xl shadow-xl">
          <div className="text-blue-400 text-6xl mb-4">👨‍⚕️</div>
          <p className="text-blue-700 text-lg font-medium">No pharmacists found.</p>
        </div>
      </div>
    );
  }

  const currentPharmacist = pharmacists[currentIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-100 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
            Meet Our Expert Pharmacists
          </h1>
          <p className="text-blue-700 text-lg max-w-2xl mx-auto">
            Discover our team of licensed pharmaceutical professionals dedicated to providing quality medication services
          </p>
        </div>

        {/* Main Showcase Container */}
        <div className="relative">
          <div 
            className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-blue-100"
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
          >
            <div className="flex flex-col lg:flex-row min-h-[600px]">
              {/* Left Side - Pharmacist Image */}
              <div className="lg:w-2/5 relative bg-gradient-to-br from-blue-100 to-indigo-200 flex items-center justify-center p-8">
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full blur-2xl opacity-30 group-hover:opacity-40 transition-opacity duration-500"></div>
                  <div className="relative w-80 h-80 rounded-full overflow-hidden border-8 border-white shadow-2xl">
                    <img
                      src={`http://localhost:5186${currentPharmacist.profileImage}`}
                      alt={currentPharmacist.fullName}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = "/default-pharmacist.jpg";
                      }}
                    />
                  </div>
                  {/* Floating Elements */}
                  <div className="absolute -top-4 -right-4 bg-blue-500 text-white p-3 rounded-full shadow-lg">
                    <Star className="w-6 h-6 fill-current" />
                  </div>
                  <div className="absolute -bottom-4 -left-4 bg-indigo-500 text-white p-3 rounded-full shadow-lg">
                    <Award className="w-6 h-6" />
                  </div>
                </div>
              </div>

              {/* Right Side - Pharmacist Information */}
              <div className="lg:w-3/5 p-12 flex flex-col justify-center">
                <div className="space-y-6">
                  {/* Name and License */}
                  <div>
                    <h2 className="text-4xl font-bold text-gray-800 mb-2">
                      {currentPharmacist.fullName}
                    </h2>
                    <div className="flex items-center gap-2 mb-4">
                      <div className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-4 py-2 rounded-full text-lg font-semibold">
                        Licensed Pharmacist
                      </div>
                      <div className="bg-gradient-to-r from-indigo-100 to-blue-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-medium">
                        License: {currentPharmacist.licenseNumber}
                      </div>
                    </div>
                  </div>

                  {/* Key Information Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl border border-blue-100">
                      <Building2 className="w-6 h-6 text-blue-600" />
                      <div>
                        <p className="text-sm text-blue-600 font-medium">Pharmacy</p>
                        <p className="text-lg font-semibold text-gray-800">{currentPharmacist.pharmacyName}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-4 bg-indigo-50 rounded-xl border border-indigo-100">
                      <MapPin className="w-6 h-6 text-indigo-600" />
                      <div>
                        <p className="text-sm text-indigo-600 font-medium">Location</p>
                        <p className="text-lg font-semibold text-gray-800">{currentPharmacist.pharmacyAddress}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl border border-blue-100">
                      <Clock className="w-6 h-6 text-blue-600" />
                      <div>
                        <p className="text-sm text-blue-600 font-medium">Working Hours</p>
                        <p className="text-lg font-semibold text-gray-800">{currentPharmacist.workingHours}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-4 bg-indigo-50 rounded-xl border border-indigo-100">
                      <Briefcase className="w-6 h-6 text-indigo-600" />
                      <div>
                        <p className="text-sm text-indigo-600 font-medium">Gender</p>
                        <p className="text-lg font-semibold text-gray-800">{currentPharmacist.gender}</p>
                      </div>
                    </div>
                  </div>

                  {/* Services Offered */}
                  <div className="space-y-4">
                    <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                      <div className="flex items-center gap-3 mb-2">
                        <Briefcase className="w-6 h-6 text-blue-600" />
                        <p className="text-sm text-blue-600 font-medium">Services Offered</p>
                      </div>
                      <p className="text-lg font-semibold text-gray-800">{currentPharmacist.servicesOffered}</p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                      <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl border border-blue-100 flex-1">
                        <Phone className="w-5 h-5 text-blue-600" />
                        <div>
                          <p className="text-sm text-blue-600 font-medium">Phone</p>
                          <p className="text-base font-semibold text-gray-800">{currentPharmacist.phoneNumber}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-4 bg-indigo-50 rounded-xl border border-indigo-100 flex-1">
                        <Mail className="w-5 h-5 text-indigo-600" />
                        <div>
                          <p className="text-sm text-indigo-600 font-medium">Email</p>
                          <p className="text-base font-semibold text-gray-800 truncate">{currentPharmacist.email}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <button className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-bold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                    Contact Pharmacist
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prevPharmacist}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white hover:bg-blue-50 p-3 rounded-full shadow-lg border border-blue-100 transition-all duration-300 hover:scale-110"
          >
            <ChevronLeft className="w-6 h-6 text-blue-600" />
          </button>
          <button
            onClick={nextPharmacist}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white hover:bg-blue-50 p-3 rounded-full shadow-lg border border-blue-100 transition-all duration-300 hover:scale-110"
          >
            <ChevronRight className="w-6 h-6 text-blue-600" />
          </button>
        </div>

        {/* Dots Indicator */}
        <div className="flex justify-center mt-8 gap-3">
          {pharmacists.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-4 h-4 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? 'bg-gradient-to-r from-blue-500 to-indigo-500 scale-125'
                  : 'bg-blue-200 hover:bg-blue-300'
              }`}
            />
          ))}
        </div>

        {/* Pharmacist Counter */}
        <div className="text-center mt-6">
          <p className="text-blue-600 font-medium">
            Pharmacist {currentIndex + 1} of {pharmacists.length}
          </p>
        </div>
      </div>
    </div>
  );
}