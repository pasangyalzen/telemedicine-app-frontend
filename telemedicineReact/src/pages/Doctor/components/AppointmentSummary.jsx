"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import {
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  RefreshCw,
  Loader2,
  X,
  User,
  Phone,
  Clipboard,
  Briefcase,
  DollarSign,
  Building,
  MapPin,
  CalendarIcon,
} from "lucide-react"
import { fetchAppointmentSummary, getDoctorIdByEmail } from "../services/doctorAppointmentApi"
import { getEmailFromToken } from "../../auth/auth"
import { getUserIdFromToken } from "../../auth/auth"
import DoctorAvailabilityForm from "./DoctorAvailabilityForm"

export default function AppointmentSummary() {
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showRegisterModal, setShowRegisterModal] = useState(false)
  const [isDoctorRegistered, setIsDoctorRegistered] = useState(false)
  const [showAvailabilityForm, setShowAvailabilityForm] = useState(false);

  const doctorEmail = getEmailFromToken()

  useEffect(() => {
    const loadSummary = async () => {
      try {
        const doctorId = await getDoctorIdByEmail(doctorEmail)
        if (doctorId) {
          // If doctorId exists, the doctor is registered
          setIsDoctorRegistered(true)
          const summaryData = await fetchAppointmentSummary(doctorId)
          setSummary(summaryData)
        } else {
          // Doctor not registered
          setIsDoctorRegistered(false)
        }
      } catch (err) {
        console.warn("Skipping summary load:", err.message)
      } finally {
        setLoading(false)
      }
    }

    loadSummary()
  }, [])

  const handleRegister = async () => {
    setShowRegisterModal(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-50 rounded-2xl">
        <div className="text-center">
          <Loader2 className="animate-spin h-10 w-10 text-blue-500 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading your appointment summary...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-800 flex items-center">
            <Calendar className="mr-2 text-blue-600" />
            <span>Appointments Summary</span>
          </h2>
          <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
            {new Date().toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <SummaryCard label="Total Appointments" value={summary?.totalAppointments} icon={<Calendar />} color="blue" />
          <SummaryCard label="Confirmed" value={summary?.confirmedAppointments} icon={<CheckCircle />} color="green" />
          <SummaryCard label="Completed" value={summary?.completedAppointments} icon={<Clock />} color="purple" />
          <SummaryCard label="No Shows" value={summary?.noShowAppointments} icon={<XCircle />} color="red" />
          <SummaryCard
            label="Today's Appointments"
            value={summary?.todayAppointments}
            icon={<AlertTriangle />}
            color="teal"
          />
          <SummaryCard
            label="Rescheduled"
            value={summary?.rescheduledAppointments}
            icon={<RefreshCw />}
            color="amber"
          />
        </div>
      </div>

      {/* Only show the Register button if the doctor is not already registered */}
      {!isDoctorRegistered && (
        <div className="mt-6 flex justify-center">
          <button
            onClick={() => setShowRegisterModal(true)}
            className="px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors duration-200 flex items-center gap-2 shadow-md"
          >
            <User className="h-5 w-5" />
            Register as Doctor
          </button>
        </div>
      )}
      {isDoctorRegistered && (
      <>
        {/* <div className="mt-6 flex justify-center">
          <button
            onClick={() => setShowAvailabilityForm(true)}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2 shadow-md"
          >
            <CalendarIcon className="h-5 w-5" />
            Add Availability
          </button>
        </div> */}

        {showAvailabilityForm && (
          <DoctorAvailabilityForm
            onSuccess={() => setShowAvailabilityForm(false)}
            onClose={() => setShowAvailabilityForm(false)}
          />
        )}
      </>
    )}
      {showRegisterModal && (
        <DoctorRegisterModal
          email={doctorEmail}
          onClose={() => setShowRegisterModal(false)}
          onSubmit={handleRegister}
        />
      )}
    </>
  )
}

function SummaryCard({ label, value, icon, color }) {
  const colorMap = {
    blue: "text-blue-600",
    green: "text-green-600",
    purple: "text-purple-600",
    red: "text-red-600",
    teal: "text-teal-600",
    amber: "text-amber-600",
  }

  return (
    <div className={`bg-${color}-50 border border-${color}-100 p-6 rounded-xl hover:bg-${color}-100 transition-all`}>
      <div className="flex justify-between mb-3">
        <p className={`font-medium ${colorMap[color]}`}>{label}</p>
        <div className={colorMap[color]}>{icon}</div>
      </div>
      <p className="text-4xl font-bold text-gray-800">{value ?? 0}</p>
    </div>
  )
}

function DoctorRegisterModal({ onClose, email }) {
  console.log("Register modal rendering...")
  const [formData, setFormData] = useState({
    UserId: "",
    fullName: "",
    phoneNumber: "",
    gender: "Male",
    dateOfBirth: "",
    licenseNumber: "",
    medicalCollege: "",
    specialization: "",
    yearsOfExperience: "",
    clinicName: "",
    clinicAddress: "",
    consultationFee: "",
    profileImage: null,
  })
    const specializations = [
  "Cardiology",
  "Dermatology",
  "Endocrinology",
  "Gastroenterology",
  "Neurology",
  "Oncology",
  "Orthopedics",
  "Pediatrics",
  "Psychiatry",
  "Radiology",
  "Urology",
  "General Practice",
  "Ophthalmology",
  "Gynecology",
  "Pulmonology",
  "Nephrology",
  "Rheumatology",
  "Anesthesiology",
  "Pathology",
  "Surgery"
];

  // Add state for validation errors
  const [validationErrors, setValidationErrors] = useState({})
  // Add state for form submission
  const [isSubmitting, setIsSubmitting] = useState(false)
  // Add state for general error message
  const [generalError, setGeneralError] = useState("")
  // Add state for success message
  const [successMessage, setSuccessMessage] = useState("")

  // Real-time validation function
  const validateField = (name, value) => {
    let error = null

    switch (name) {
      case "fullName":
        if (!value) error = "Full name is required."
        else if (value.length > 100) error = "Full name cannot exceed 100 characters."
        break

      case "phoneNumber":
        if (!value) error = "Phone number is required."
        else {
          const phoneRegex = /^(\+\d{1,3}[- ]?)?\d{10,14}$/
          if (!phoneRegex.test(value.replace(/[\s()-]/g, ""))) {
            error = "Invalid phone number format."
          }
        }
        break

      case "dateOfBirth":
        if (!value) error = "Date of birth is required."
        else {
          const dobDate = new Date(value)
          if (isNaN(dobDate.getTime())) {
            error = "Please enter a valid date."
          }
        }
        break

      case "licenseNumber":
        if (!value) error = "License number is required."
        else if (value.length > 50) error = "License number cannot exceed 50 characters."
        break

      case "medicalCollege":
        if (!value) error = "Medical college is required."
        break

      case "specialization":
        if (!value) error = "Specialization is required."
        break

      case "yearsOfExperience":
        if (value === "") error = "Years of experience is required."
        else {
          const years = Number.parseInt(value)
          if (isNaN(years)) error = "Years of experience must be a number."
          else if (years < 0 || years > 100) error = "Years of experience must be between 0 and 100."
        }
        break

      case "consultationFee":
        if (value === "") error = "Consultation fee is required."
        else {
          const fee = Number.parseFloat(value)
          if (isNaN(fee)) error = "Consultation fee must be a number."
          else if (fee < 0 || fee > 10000) error = "Consultation fee must be between 0 and 10,000."
        }
        break

      case "clinicName":
        if (!value) error = "Clinic name is required."
        break

      case "clinicAddress":
        if (!value) error = "Clinic address is required."
        break

      case "profileImage":
        if (!value) error = "Profile image is required."
        else {
          const fileName = value.name.toLowerCase()
          const allowedExtensions = [".jpg", ".jpeg", ".png"]
          const hasValidExtension = allowedExtensions.some((ext) => fileName.endsWith(ext))
          if (!hasValidExtension) error = "Only JPG, JPEG, and PNG files are allowed."
        }
        break

      default:
        break
    }

    return error
  }

  // Client-side validation function for form submission
  const validateForm = () => {
    const errors = {}

    // Validate all fields
    Object.entries(formData).forEach(([key, value]) => {
      const error = validateField(key, value)
      if (error) errors[key.charAt(0).toUpperCase() + key.slice(1)] = error
    })

    return errors
  }

  // Helper function to display validation errors
  const getValidationError = (fieldName) => {
    const errorKey = fieldName.charAt(0).toUpperCase() + fieldName.slice(1)
    return validationErrors[errorKey] ? <p className="text-red-500 text-xs mt-1">{validationErrors[errorKey]}</p> : null
  }

  const handleRegister = async () => {
    try {
      // Clear previous messages
      setValidationErrors({})
      setGeneralError("")
      setSuccessMessage("")

      // Perform client-side validation
      const clientErrors = validateForm()
      if (Object.keys(clientErrors).length > 0) {
        setValidationErrors(clientErrors)
        return
      }

      setIsSubmitting(true)

      const form = new FormData()
      form.append("FullName", formData.fullName)
      form.append("PhoneNumber", formData.phoneNumber)
      form.append("Gender", formData.gender)
      form.append("userId", getUserIdFromToken())

      // Use the selected date directly, not the current date
      if (formData.dateOfBirth) {
        form.append("DateOfBirth", formData.dateOfBirth)
      }

      form.append("LicenseNumber", formData.licenseNumber)
      form.append("MedicalCollege", formData.medicalCollege)
      form.append("Specialization", formData.specialization)
      form.append("YearsOfExperience", formData.yearsOfExperience)
      form.append("ClinicName", formData.clinicName)
      form.append("ClinicAddress", formData.clinicAddress)
      form.append("ConsultationFee", formData.consultationFee)
      if (formData.profileImage) {
        form.append("ProfileImage", formData.profileImage)
      }

      console.log("📤 Sending the following FormData:")
      for (const [key, value] of form.entries()) {
        if (value instanceof File) {
          console.log(`${key}: File -> name: ${value.name}, size: ${value.size}, type: ${value.type}`)
        } else {
          console.log(`${key}: ${value}`)
        }
      }

      const response = await axios.post("http://localhost:5186/api/Doctor/RegisterDoctor", form)

      // Show success message
      setSuccessMessage("Doctor registered successfully!")

      // Wait a moment to show the success message before closing
      setTimeout(() => {
        onClose()
        window.location.reload()
      }, 1500)
    } catch (error) {
      console.error("Registration error:", error)

      // Handle foreign key constraint error specifically
      if (error.response?.data?.includes && error.response.data.includes("FK_DoctorDetails_AspNetUsers")) {
        setGeneralError(
          "Registration failed: The user ID does not exist in the system. Please ensure you are logged in with a valid account.",
        )
        return
      }

      // Handle different types of ASP.NET Core validation responses
      if (error.response) {
        console.log("Server response:", error.response.data)

        // Case 1: Standard ASP.NET validation errors object
        if (error.response.data?.errors && typeof error.response.data.errors === "object") {
          const serverErrors = {}

          Object.entries(error.response.data.errors).forEach(([key, messages]) => {
            // Convert property name format if needed (camelCase to PascalCase or vice versa)
            const formattedKey = key.charAt(0).toUpperCase() + key.slice(1)
            serverErrors[formattedKey] = Array.isArray(messages) ? messages[0] : messages
          })

          setValidationErrors(serverErrors)
          return
        }

        // Case 2: ModelState dictionary errors
        if (error.response.data?.modelState && typeof error.response.data.modelState === "object") {
          const serverErrors = {}

          Object.entries(error.response.data.modelState).forEach(([key, messages]) => {
            // Handle property paths like model.Property
            const propertyName = key.includes(".") ? key.split(".").pop() : key
            const formattedKey = propertyName.charAt(0).toUpperCase() + propertyName.slice(1)
            serverErrors[formattedKey] = Array.isArray(messages) ? messages[0] : messages
          })

          setValidationErrors(serverErrors)
          return
        }

        // Case 3: Simple error message
        if (typeof error.response.data === "string") {
          setGeneralError(error.response.data)
          return
        }

        // Case 4: Error object with message
        if (error.response.data?.message) {
          setGeneralError(error.response.data.message)
          return
        }
      }

      // Default error message
      setGeneralError("Doctor registration failed. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e) => {
    const { name, value, files, type } = e.target
    const newValue = type === "file" ? files[0] : value

    // Update the form data
    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }))

    // Real-time validation
    const error = validateField(name, newValue)

    // Update validation errors
    setValidationErrors((prev) => {
      const errorKey = name.charAt(0).toUpperCase() + name.slice(1)
      const newErrors = { ...prev }

      if (error) {
        newErrors[errorKey] = error
      } else {
        delete newErrors[errorKey]
      }

      return newErrors
    })
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full overflow-y-auto max-h-[90vh] relative">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-600 to-teal-500 text-white px-6 py-4 rounded-t-xl">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Register as Doctor</h2>
            <button
              onClick={onClose}
              className="text-white hover:bg-teal-700 rounded-full p-1 transition-colors duration-200"
              aria-label="Close modal"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <p className="text-teal-100 text-sm mt-1">Complete your profile to start accepting appointments</p>
        </div>

        {/* Form */}
        <div className="p-6">
          {/* Success message */}
          {successMessage && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-600 text-sm font-medium">{successMessage}</p>
            </div>
          )}

          {/* General error message */}
          {generalError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{generalError}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-700 border-b pb-2">Personal Information</h3>

              <div className="space-y-1">
                <input type="hidden" name="UserId" value={formData.UserId} />

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    name="fullName"
                    placeholder="Full Name"
                    className={`w-full pl-10 pr-3 py-2 border ${
                      validationErrors.FullName ? "border-red-500" : "border-gray-300"
                    } rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent`}
                    onChange={handleChange}
                    value={formData.fullName}
                  />
                </div>
                {getValidationError("fullName")}
              </div>

              <div className="space-y-1">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Phone className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    name="phoneNumber"
                    placeholder="Phone Number"
                    className={`w-full pl-10 pr-3 py-2 border ${
                      validationErrors.PhoneNumber ? "border-red-500" : "border-gray-300"
                    } rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent`}
                    onChange={handleChange}
                    value={formData.phoneNumber}
                  />
                </div>
                {getValidationError("phoneNumber")}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <select
                    name="gender"
                    className={`w-full px-3 py-2 border ${
                      validationErrors.Gender ? "border-red-500" : "border-gray-300"
                    } rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent`}
                    onChange={handleChange}
                    value={formData.gender}
                  >
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </select>
                  {getValidationError("gender")}
                </div>

                <div className="space-y-1">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <CalendarIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      name="dateOfBirth"
                      type="date"
                      className={`w-full pl-10 pr-3 py-2 border ${
                        validationErrors.DateOfBirth ? "border-red-500" : "border-gray-300"
                      } rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent`}
                      onChange={handleChange}
                      value={formData.dateOfBirth}
                    />
                  </div>
                  {getValidationError("dateOfBirth")}
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Profile Image</label>
                <input
                  name="profileImage"
                  type="file"
                  accept=".jpg,.jpeg,.png"
                  className={`w-full px-3 py-2 border ${
                    validationErrors.ProfileImage ? "border-red-500" : "border-gray-300"
                  } rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent`}
                  onChange={handleChange}
                />
                {getValidationError("profileImage")}
              </div>
            </div>

            {/* Professional Information */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-700 border-b pb-2">Professional Information</h3>

              <div className="space-y-1">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Clipboard className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    name="licenseNumber"
                    placeholder="License Number"
                    className={`w-full pl-10 pr-3 py-2 border ${
                      validationErrors.LicenseNumber ? "border-red-500" : "border-gray-300"
                    } rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent`}
                    onChange={handleChange}
                    value={formData.licenseNumber}
                  />
                </div>
                {getValidationError("licenseNumber")}
              </div>

              <div className="space-y-1">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Briefcase className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  name="specialization"
                  className={`w-full pl-10 pr-3 py-2 border ${
                    validationErrors.specialization ? "border-red-500" : "border-gray-300"
                  } rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent`}
                  onChange={handleChange}
                  value={formData.specialization}
                >
                  <option value="">Select Specialization</option>
                  {specializations.map((spec) => (
                    <option key={spec} value={spec}>
                      {spec}
                    </option>
                  ))}
                </select>
              </div>
              {getValidationError("specialization")}
            </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Clock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      name="yearsOfExperience"
                      placeholder="Years of Experience"
                      type="number"
                      className={`w-full pl-10 pr-3 py-2 border ${
                        validationErrors.YearsOfExperience ? "border-red-500" : "border-gray-300"
                      } rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-transparent`}
                      onChange={handleChange}
                      value={formData.yearsOfExperience}
                      min="0"
                      max="100"
                    />
                  </div>
                  {getValidationError("yearsOfExperience")}
                </div>

                <div className="space-y-1">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <DollarSign className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      name="consultationFee"
                      placeholder="Consultation Fee"
                      type="number"
                      className={`w-full pl-10 pr-3 py-2 border ${
                        validationErrors.ConsultationFee ? "border-red-500" : "border-gray-300"
                      } rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-transparent`}
                      onChange={handleChange}
                      value={formData.consultationFee}
                      min="0"
                      max="10000"
                      step="0.01"
                    />
                  </div>
                  {getValidationError("consultationFee")}
                </div>
              </div>

              <div className="space-y-1">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Building className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    name="medicalCollege"
                    placeholder="Medical College"
                    className={`w-full pl-10 pr-3 py-2 border ${
                      validationErrors.MedicalCollege ? "border-red-500" : "border-gray-300"
                    } rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent`}
                    onChange={handleChange}
                    value={formData.medicalCollege}
                  />
                </div>
                {getValidationError("medicalCollege")}
              </div>
            </div>
          </div>

          {/* Clinic Information */}
          <div className="mt-6">
            <h3 className="font-semibold text-gray-700 border-b pb-2 mb-4">Clinic Information</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Building className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    name="clinicName"
                    placeholder="Clinic Name"
                    className={`w-full pl-10 pr-3 py-2 border ${
                      validationErrors.ClinicName ? "border-red-500" : "border-gray-300"
                    } rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent`}
                    onChange={handleChange}
                    value={formData.clinicName}
                  />
                </div>
                {getValidationError("clinicName")}
              </div>

              <div className="space-y-1">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <MapPin className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    name="clinicAddress"
                    placeholder="Clinic Address"
                    className={`w-full pl-10 pr-3 py-2 border ${
                      validationErrors.ClinicAddress ? "border-red-500" : "border-gray-300"
                    } rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent`}
                    onChange={handleChange}
                    value={formData.clinicAddress}
                  />
                </div>
                {getValidationError("clinicAddress")}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 px-6 py-4 bg-gray-50 rounded-b-xl flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white text-black border border-gray-300 rounded-lg hover:bg-black hover:text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
            disabled={isSubmitting}
          >
            Cancel
          </button>

          <button
            onClick={handleRegister}
            className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 flex items-center"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin h-4 w-4 mr-2" />
                Registering...
              </>
            ) : (
              "Register"
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export { DoctorRegisterModal }