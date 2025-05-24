import { Facebook, Instagram, Twitter, Youtube, Heart, Shield, Award, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { PATHS } from "../constants/path";

export default function Footer() {
  return (
    <footer className="relative bg-gradient-to-br from-teal-100 via-teal-50 to-teal-200 text-teal-800 py-16 px-6 mt-0 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-10 left-10 w-32 h-32 border border-teal-400 rounded-full"></div>
        <div className="absolute bottom-20 right-20 w-24 h-24 border border-teal-300 rounded-full"></div>
        <div className="absolute top-1/2 left-1/3 w-16 h-16 border border-teal-500 rounded-full"></div>
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* Top decorative border */}
        <div className="w-full h-1 bg-gradient-to-r from-transparent via-teal-400 to-transparent mb-12"></div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 text-sm">
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-teal-700 rounded-xl flex items-center justify-center">
                <Heart className="w-6 h-6 text-white fill-current" />
              </div>
              <h3 className="text-2xl font-bold text-teal-900">TeleChauki</h3>
            </div>
            <p className="text-teal-700 leading-relaxed">
              Revolutionizing healthcare access through secure and convenient telemedicine solutions.
            </p>
            
            <p className="mt-6 text-teal-600 text-xs">
              © {new Date().getFullYear()} TeleChauki. All rights reserved.
            </p>
          </div>

          {/* Professional Services */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-6">
              <Shield className="w-5 h-5 text-teal-600" />
              <h4 className="text-lg font-semibold text-teal-900">Professional</h4>
            </div>
            <ul className="space-y-3">
              <li>
                <Link 
                  to={PATHS.LOGIN} 
                  className="group flex items-center gap-2 hover:text-teal-600 transition-all duration-300 hover:translate-x-1"
                >
                  <span className="w-1 h-1 bg-teal-600 rounded-full group-hover:bg-teal-500"></span>
                  Login
                </Link>
              </li>
              <li>
                <Link 
                  to={PATHS.REGISTER} 
                  className="group flex items-center gap-2 hover:text-teal-600 transition-all duration-300 hover:translate-x-1"
                >
                  <span className="w-1 h-1 bg-teal-600 rounded-full group-hover:bg-teal-500"></span>
                  Register
                </Link>
              </li>
              <li>
                <Link 
                  to={PATHS.DOCTORS} 
                  className="group flex items-center gap-2 hover:text-teal-600 transition-all duration-300 hover:translate-x-1"
                >
                  <span className="w-1 h-1 bg-teal-600 rounded-full group-hover:bg-teal-500"></span>
                  Find a Doctor
                </Link>
              </li>
              <li>
                <Link 
                  to={PATHS.PHARMACISTS} 
                  className="group flex items-center gap-2 hover:text-teal-600 transition-all duration-300 hover:translate-x-1"
                >
                  <span className="w-1 h-1 bg-teal-600 rounded-full group-hover:bg-teal-500"></span>
                  Pharmacy Network
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Info */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-teal-900 mb-6 flex items-center gap-2">
              <div className="w-2 h-6 bg-gradient-to-b from-teal-500 to-teal-700 rounded-full"></div>
              Legal
            </h4>
            <ul className="space-y-3">
              <li>
                <Link 
                  to="/privacy-policy" 
                  className="group flex items-center gap-2 hover:text-teal-600 transition-all duration-300 hover:translate-x-1"
                >
                  <span className="w-1 h-1 bg-teal-600 rounded-full group-hover:bg-teal-500"></span>
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link 
                  to="/terms-of-service" 
                  className="group flex items-center gap-2 hover:text-teal-600 transition-all duration-300 hover:translate-x-1"
                >
                  <span className="w-1 h-1 bg-teal-600 rounded-full group-hover:bg-teal-500"></span>
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Support + Socials */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-teal-900 mb-6 flex items-center gap-2">
              <div className="w-2 h-6 bg-gradient-to-b from-teal-500 to-teal-700 rounded-full"></div>
              Support
            </h4>
            <ul className="space-y-3 mb-8">
              <li>
                <Link 
                  to="/contact-us" 
                  className="group flex items-center gap-2 hover:text-teal-600 transition-all duration-300 hover:translate-x-1"
                >
                  <span className="w-1 h-1 bg-teal-600 rounded-full group-hover:bg-teal-500"></span>
                  Contact Us
                </Link>
              </li>
              <li>
                <Link 
                  to="/about-us" 
                  className="group flex items-center gap-2 hover:text-teal-600 transition-all duration-300 hover:translate-x-1"
                >
                  <span className="w-1 h-1 bg-teal-600 rounded-full group-hover:bg-teal-500"></span>
                  About Us
                </Link>
              </li>
            </ul>
            
            {/* Social Media */}
            <div className="space-y-3">
              <p className="text-teal-700 font-medium text-sm">Follow Us</p>
              <div className="flex gap-3">
                <a
                  href="https://www.facebook.com/share/18xDFHiLzB/?mibextid=wwXIfr"
                  target="_blank"
                  rel="noreferrer"
                  title="Facebook"
                  className="group relative"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-teal-300 to-teal-400 rounded-xl flex items-center justify-center border border-teal-400 hover:border-teal-600 transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-teal-500/25">
                    <Facebook className="w-5 h-5 text-teal-700 group-hover:text-teal-900 transition-colors duration-300" />
                  </div>
                </a>
                <a
                  href="https://www.instagram.com/pasang_gelzeen?igsh=MWZ4ZDlxdmRjazE0MQ%3D%3D&utm_source=qr"
                  target="_blank"
                  rel="noreferrer"
                  title="Instagram"
                  className="group relative"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-teal-300 to-teal-400 rounded-xl flex items-center justify-center border border-teal-400 hover:border-teal-600 transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-teal-500/25">
                    <Instagram className="w-5 h-5 text-teal-700 group-hover:text-teal-900 transition-colors duration-300" />
                  </div>
                </a>
                <a
                  href="https://youtube.com/@pasang_gelzeen?si=9D1QWICJsdm_zAej"
                  target="_blank"
                  rel="noreferrer"
                  title="YouTube"
                  className="group relative"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-teal-300 to-teal-400 rounded-xl flex items-center justify-center border border-teal-400 hover:border-teal-600 transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-teal-500/25">
                    <Youtube className="w-5 h-5 text-teal-700 group-hover:text-teal-900 transition-colors duration-300" />
                  </div>
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noreferrer"
                  title="Twitter"
                  className="group relative"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-teal-300 to-teal-400 rounded-xl flex items-center justify-center border border-teal-400 hover:border-teal-600 transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-teal-500/25">
                    <Twitter className="w-5 h-5 text-teal-700 group-hover:text-teal-900 transition-colors duration-300" />
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-teal-300">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4 text-teal-700 text-sm">
              <span>Made with</span>
              <Heart className="w-4 h-4 text-red-500 fill-current animate-pulse" />
              <span>for better healthcare</span>
            </div>
            <div className="flex items-center gap-2 text-teal-700 text-sm">
              <Shield className="w-4 h-4" />
              <span>Your health data is secure</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}