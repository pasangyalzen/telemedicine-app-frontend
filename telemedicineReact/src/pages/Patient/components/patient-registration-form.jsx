"use client"

import { useState } from "react"
import axios from "axios"
import {
  X,
  User,
  Phone,
  Calendar,
  MapPin,
  Heart,
  Shield,
  FileText,
  AlertCircle,
  Loader2,
  Users,
  Activity,
  CheckCircle,
  XCircle,
} from "lucide-react"
import { getUserIdFromToken } from "../../auth/auth"

const PatientRegisterModal = ({ onClose, onSuccess, email, isOpen, allowCancel = true }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    gender: "Male",
    dateOfBirth: "",
    bloodGroup: "",
    address: "",
    emergencyContactName: "",
    emergencyContactNumber: "",
    healthInsuranceProvider: "",
    medicalHistory: "",
    maritalStatus: "Single",
    allergies: "",
    chronicDiseases: "",
    medications: "",
    profileImage: null,
  })

  const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]
  const maritalStatuses = ["Single", "Married", "Divorced", "Widowed", "Other"]

  // Add state for validation errors
  const [validationErrors, setValidationErrors] = useState({})
  // Add state for form submission
  const [isSubmitting, setIsSubmitting] = useState(false)
  // Add state for general error message
  const [generalError, setGeneralError] = useState("")
  // Add state for success message
  const [successMessage, setSuccessMessage] = useState("")
  // Add state for field validation status
  const [fieldValidationStatus, setFieldValidationStatus] = useState({})

  if (!isOpen) return null

  // Enhanced validation helper functions
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const isValidName = (name) => {
    // Allow letters, spaces, hyphens, apostrophes, and common international characters
    const nameRegex = /^[a-zA-ZÀ-ÿ\u0100-\u017F\u0180-\u024F\u1E00-\u1EFF\s'-]+$/
    return nameRegex.test(name)
  }

  const isValidPhoneNumber = (phone) => {
    // Remove all non-digit characters except + at the beginning
    const cleanPhone = phone.replace(/[^\d+]/g, "")

    // Check various international formats
    const patterns = [
      /^\+\d{1,3}\d{10,14}$/, // International format with country code
      /^\d{10,15}$/, // Domestic format
      /^\+1\d{10}$/, // US/Canada format
      /^\+44\d{10}$/, // UK format
      /^\+91\d{10}$/, // India format
    ]

    return patterns.some((pattern) => pattern.test(cleanPhone))
  }

  const calculateAge = (dateOfBirth) => {
    const today = new Date()
    const birthDate = new Date(dateOfBirth)
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }

    return age
  }

  const isValidDate = (dateString) => {
    const date = new Date(dateString)
    return date instanceof Date && !isNaN(date) && dateString === date.toISOString().split("T")[0]
  }

  const sanitizeText = (text) => {
    // Remove potentially harmful characters but keep medical terminology
    return text.replace(/[<>{}]/g, "").trim()
  }

  // Enhanced real-time validation function
  const validateField = (name, value) => {
    let error = null
    let warning = null
    let success = false

    switch (name) {
      case "fullName":
        if (!value) {
          error = "Full name is required."
        } else if (value.length < 2) {
          error = "Full name must be at least 2 characters."
        } else if (value.length > 100) {
          error = "Full name cannot exceed 100 characters."
        } else if (!isValidName(value)) {
          error = "Full name can only contain letters, spaces, hyphens, and apostrophes."
        } else if (value.split(" ").length < 2) {
          warning = "Consider including both first and last name."
        } else {
          success = true
        }
        break

      case "phoneNumber":
        if (!value) {
          error = "Phone number is required."
        } else if (value.length < 10) {
          error = "Phone number must be at least 10 digits."
        } else if (value.length > 20) {
          error = "Phone number cannot exceed 20 characters."
        } else if (!isValidPhoneNumber(value)) {
          error = "Please enter a valid phone number format (e.g., +1234567890 or 1234567890)."
        } else {
          success = true
        }
        break

      case "dateOfBirth":
        if (!value) {
          error = "Date of birth is required."
        } else if (!isValidDate(value)) {
          error = "Please enter a valid date."
        } else {
          const dobDate = new Date(value)
          const today = new Date()
          const minDate = new Date("1900-01-01")
          const age = calculateAge(value)

          if (dobDate < minDate) {
            error = "Date of birth must be after January 1, 1900."
          } else if (dobDate > today) {
            error = "Date of birth cannot be in the future."
          } else if (age < 0) {
            error = "Invalid date of birth."
          } else if (age > 150) {
            error = "Please verify the date of birth. Age appears to be over 150 years."
          } else if (age < 13) {
            warning = "Patients under 13 may require parental consent."
          } else if (age > 100) {
            warning = "Please verify the date of birth for patients over 100 years."
          } else {
            success = true
          }
        }
        break

      case "bloodGroup":
        if (value && !bloodGroups.includes(value)) {
          error = "Please select a valid blood group."
        } else if (value) {
          success = true
        }
        break

      case "address":
        if (value) {
          if (value.length < 10) {
            warning = "Address seems too short. Please provide a complete address."
          } else if (value.length > 500) {
            error = "Address cannot exceed 500 characters."
          } else if (!/\d/.test(value)) {
            warning = "Consider including a street number in your address."
          } else {
            success = true
          }
        }
        break

      case "emergencyContactName":
        if (value) {
          if (value.length < 2) {
            error = "Emergency contact name must be at least 2 characters."
          } else if (value.length > 100) {
            error = "Emergency contact name cannot exceed 100 characters."
          } else if (!isValidName(value)) {
            error = "Emergency contact name can only contain letters, spaces, hyphens, and apostrophes."
          } else {
            success = true
          }
        }
        break

      case "emergencyContactNumber":
        if (value) {
          if (value.length < 10) {
            error = "Emergency contact number must be at least 10 digits."
          } else if (!isValidPhoneNumber(value)) {
            error = "Please enter a valid emergency contact number."
          } else if (value === formData.phoneNumber) {
            warning = "Emergency contact should be different from your phone number."
          } else {
            success = true
          }
        }
        break

      case "healthInsuranceProvider":
        if (value) {
          if (value.length < 2) {
            error = "Insurance provider name must be at least 2 characters."
          } else if (value.length > 100) {
            error = "Insurance provider name cannot exceed 100 characters."
          } else {
            success = true
          }
        }
        break

      case "medicalHistory":
        if (value) {
          const sanitized = sanitizeText(value)
          if (sanitized.length > 2000) {
            error = "Medical history cannot exceed 2000 characters."
          } else if (sanitized.length > 0) {
            success = true
          }
        }
        break

      case "allergies":
        if (value) {
          const sanitized = sanitizeText(value)
          if (sanitized.length > 500) {
            error = "Allergies description cannot exceed 500 characters."
          } else if (sanitized.length > 0) {
            success = true
          }
        }
        break

      case "chronicDiseases":
        if (value) {
          const sanitized = sanitizeText(value)
          if (sanitized.length > 1000) {
            error = "Chronic diseases description cannot exceed 1000 characters."
          } else if (sanitized.length > 0) {
            success = true
          }
        }
        break

      case "medications":
        if (value) {
          const sanitized = sanitizeText(value)
          if (sanitized.length > 1000) {
            error = "Medications list cannot exceed 1000 characters."
          } else if (sanitized.length > 0) {
            success = true
          }
        }
        break

      case "profileImage":
        if (value) {
          const fileName = value.name.toLowerCase()
          const allowedExtensions = [".jpg", ".jpeg", ".png", ".webp"]
          const hasValidExtension = allowedExtensions.some((ext) => fileName.endsWith(ext))

          if (!hasValidExtension) {
            error = "Only JPG, JPEG, PNG, and WebP files are allowed."
          } else if (value.size > 5 * 1024 * 1024) {
            error = "File size must be less than 5MB."
          } else if (value.size < 1024) {
            warning = "File seems very small. Please ensure it's a valid image."
          } else {
            success = true
          }
        }
        break

      default:
        break
    }

    return { error, warning, success }
  }

  // Enhanced form validation function
  const validateForm = () => {
    const errors = {}
    let hasErrors = false

    // Required fields validation
    const requiredFields = ["fullName", "phoneNumber", "dateOfBirth"]
    requiredFields.forEach((field) => {
      const validation = validateField(field, formData[field])
      if (validation.error) {
        errors[field.charAt(0).toUpperCase() + field.slice(1)] = validation.error
        hasErrors = true
      }
    })

    // Optional fields validation
    Object.keys(formData).forEach((field) => {
      if (!requiredFields.includes(field) && formData[field]) {
        const validation = validateField(field, formData[field])
        if (validation.error) {
          errors[field.charAt(0).toUpperCase() + field.slice(1)] = validation.error
          hasErrors = true
        }
      }
    })

    // Cross-field validation
    if (formData.emergencyContactNumber && formData.phoneNumber) {
      if (formData.emergencyContactNumber === formData.phoneNumber) {
        errors.EmergencyContactNumber = "Emergency contact must be different from your phone number."
        hasErrors = true
      }
    }

    // Age-based validation
    if (formData.dateOfBirth) {
      const age = calculateAge(formData.dateOfBirth)
      if (age < 13 && !formData.emergencyContactName) {
        errors.EmergencyContactName = "Emergency contact is required for patients under 13."
        hasErrors = true
      }
    }

    // Check user authentication
    const userId = getUserIdFromToken()
    if (!userId) {
      errors.UserId = "User authentication required. Please log in again."
      hasErrors = true
    }

    return errors
  }

  // Helper function to display validation errors with enhanced styling
  const getValidationError = (fieldName) => {
    const errorKey = fieldName.charAt(0).toUpperCase() + fieldName.slice(1)
    const validation = fieldValidationStatus[fieldName] || {}

    if (validationErrors[errorKey]) {
      return (
        <div className="flex items-center space-x-1 mt-1">
          <XCircle className="w-3 h-3 text-red-500" />
          <p className="text-red-500 text-xs">{validationErrors[errorKey]}</p>
        </div>
      )
    }

    if (validation.error) {
      return (
        <div className="flex items-center space-x-1 mt-1">
          <XCircle className="w-3 h-3 text-red-500" />
          <p className="text-red-500 text-xs">{validation.error}</p>
        </div>
      )
    }

    if (validation.warning) {
      return (
        <div className="flex items-center space-x-1 mt-1">
          <AlertCircle className="w-3 h-3 text-yellow-500" />
          <p className="text-yellow-600 text-xs">{validation.warning}</p>
        </div>
      )
    }

    if (validation.success && formData[fieldName]) {
      return (
        <div className="flex items-center space-x-1 mt-1">
          <CheckCircle className="w-3 h-3 text-green-500" />
          <p className="text-green-600 text-xs">Looks good!</p>
        </div>
      )
    }

    return null
  }

  // Get input border color based on validation status
  const getInputBorderColor = (fieldName) => {
    const errorKey = fieldName.charAt(0).toUpperCase() + fieldName.slice(1)
    const validation = fieldValidationStatus[fieldName] || {}

    if (validationErrors[errorKey] || validation.error) {
      return "border-red-500 focus:ring-red-500"
    }

    if (validation.warning) {
      return "border-yellow-400 focus:ring-yellow-500"
    }

    if (validation.success && formData[fieldName]) {
      return "border-green-400 focus:ring-green-500"
    }

    return "border-gray-300 focus:ring-blue-500"
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
      form.append("UserId", getUserIdFromToken())
      form.append("FullName", sanitizeText(formData.fullName))
      form.append("PhoneNumber", formData.phoneNumber.replace(/[^\d+]/g, ""))
      form.append("Gender", formData.gender)

      // Format the date properly for SQL Server
      if (formData.dateOfBirth) {
        const dateObj = new Date(formData.dateOfBirth)
        const formattedDate = dateObj.toISOString().split("T")[0] + "T00:00:00.000Z"
        form.append("DateOfBirth", formattedDate)
      }

      if (formData.bloodGroup) form.append("BloodGroup", formData.bloodGroup)
      if (formData.address) form.append("Address", sanitizeText(formData.address))
      if (formData.emergencyContactName)
        form.append("EmergencyContactName", sanitizeText(formData.emergencyContactName))
      if (formData.emergencyContactNumber)
        form.append("EmergencyContactNumber", formData.emergencyContactNumber.replace(/[^\d+]/g, ""))
      if (formData.healthInsuranceProvider)
        form.append("HealthInsuranceProvider", sanitizeText(formData.healthInsuranceProvider))
      if (formData.medicalHistory) form.append("MedicalHistory", sanitizeText(formData.medicalHistory))
      if (formData.maritalStatus) form.append("MaritalStatus", formData.maritalStatus)
      if (formData.allergies) form.append("Allergies", sanitizeText(formData.allergies))
      if (formData.chronicDiseases) form.append("ChronicDiseases", sanitizeText(formData.chronicDiseases))
      if (formData.medications) form.append("Medications", sanitizeText(formData.medications))
      if (formData.profileImage) form.append("ProfileImage", formData.profileImage)

      console.log("📤 Sending Patient Registration FormData:")
      for (const [key, value] of form.entries()) {
        if (value instanceof File) {
          console.log(`${key}: File -> name: ${value.name}, size: ${value.size}, type: ${value.type}`)
        } else {
          console.log(`${key}: ${value}`)
        }
      }

      const response = await axios.post("http://localhost:5186/api/Patient/RegisterPatient", form, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })

      console.log("✅ Registration successful:", response.data)

      // Show success message
      setSuccessMessage("Patient registered successfully!")

      // Call onSuccess immediately after showing success message
      setTimeout(() => {
        console.log("🎉 Calling onSuccess callback")
        if (onSuccess) {
          onSuccess()
        }
      }, 1000)
    } catch (error) {
      console.error("❌ Registration error:", error)

      // Handle different types of ASP.NET Core validation responses
      if (error.response) {
        console.log("Server response:", error.response.data)

        // Case 1: Standard ASP.NET validation errors object
        if (error.response.data?.errors && typeof error.response.data.errors === "object") {
          const serverErrors = {}
          Object.entries(error.response.data.errors).forEach(([key, messages]) => {
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
      setGeneralError("Patient registration failed. Please try again.")
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

    // Real-time validation with enhanced feedback
    const validation = validateField(name, newValue)

    // Update field validation status
    setFieldValidationStatus((prev) => ({
      ...prev,
      [name]: validation,
    }))

    // Update validation errors for real-time feedback
    setValidationErrors((prev) => {
      const errorKey = name.charAt(0).toUpperCase() + name.slice(1)
      const newErrors = { ...prev }

      if (validation.error) {
        newErrors[errorKey] = validation.error
      } else {
        delete newErrors[errorKey]
      }

      return newErrors
    })
  }

  const handleClose = () => {
    if (!isSubmitting && allowCancel && onClose) {
      onClose()
    }
  }

  // Calculate form completion percentage
  const getFormCompletionPercentage = () => {
    const totalFields = Object.keys(formData).length
    const filledFields = Object.values(formData).filter((value) => value && value !== "").length
    return Math.round((filledFields / totalFields) * 100)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full overflow-y-auto max-h-[90vh] relative">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white px-6 py-4 rounded-t-xl">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">Register as Patient</h2>
              <div className="flex items-center space-x-2 mt-2">
                <div className="w-32 bg-blue-400 rounded-full h-2">
                  <div
                    className="bg-white h-2 rounded-full transition-all duration-300"
                    style={{ width: `${getFormCompletionPercentage()}%` }}
                  ></div>
                </div>
                <span className="text-xs text-blue-100">{getFormCompletionPercentage()}% complete</span>
              </div>
            </div>
            {allowCancel && (
              <button
                onClick={handleClose}
                className="text-white hover:bg-blue-700 rounded-full p-1 transition-colors duration-200"
                aria-label="Close modal"
                disabled={isSubmitting}
              >
                <X className="w-6 h-6" />
              </button>
            )}
          </div>
          <p className="text-blue-100 text-sm mt-1">
            {allowCancel
              ? "Complete your profile to start booking appointments"
              : "Registration is required to access the platform"}
          </p>
        </div>

        {/* Form */}
        <div className="p-6">
          {/* Success message */}
          {successMessage && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <p className="text-green-600 text-sm font-medium">{successMessage}</p>
            </div>
          )}

          {/* General error message */}
          {generalError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
              <XCircle className="w-5 h-5 text-red-600" />
              <p className="text-red-600 text-sm">{generalError}</p>
            </div>
          )}

          {/* Registration requirement notice */}
          {!allowCancel && (
            <div className="mb-4 p-4 bg-orange-50 border border-orange-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-5 h-5 text-orange-600" />
                <p className="text-orange-800 text-sm font-medium">Registration Required</p>
              </div>
              <p className="text-orange-700 text-sm mt-1">
                Please complete your registration to access appointments and other healthcare services.
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-700 border-b pb-2">Personal Information</h3>

              <div className="space-y-1">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    name="fullName"
                    placeholder="Full Name *"
                    className={`w-full pl-10 pr-3 py-3 border ${getInputBorderColor("fullName")} rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:border-transparent transition-colors duration-200`}
                    onChange={handleChange}
                    value={formData.fullName}
                    disabled={isSubmitting}
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
                    placeholder="Phone Number * (e.g., +1234567890)"
                    className={`w-full pl-10 pr-3 py-3 border ${getInputBorderColor("phoneNumber")} rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:border-transparent transition-colors duration-200`}
                    onChange={handleChange}
                    value={formData.phoneNumber}
                    disabled={isSubmitting}
                  />
                </div>
                {getValidationError("phoneNumber")}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <select
                    name="gender"
                    className={`w-full px-3 py-3 border ${getInputBorderColor("gender")} rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:border-transparent transition-colors duration-200`}
                    onChange={handleChange}
                    value={formData.gender}
                    disabled={isSubmitting}
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                  {getValidationError("gender")}
                </div>

                <div className="space-y-1">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Calendar className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      name="dateOfBirth"
                      type="date"
                      max={new Date().toISOString().split("T")[0]}
                      min="1900-01-01"
                      className={`w-full pl-10 pr-3 py-3 border ${getInputBorderColor("dateOfBirth")} rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:border-transparent transition-colors duration-200`}
                      onChange={handleChange}
                      value={formData.dateOfBirth}
                      disabled={isSubmitting}
                    />
                  </div>
                  {getValidationError("dateOfBirth")}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Heart className="h-5 w-5 text-gray-400" />
                    </div>
                    <select
                      name="bloodGroup"
                      className={`w-full pl-10 pr-3 py-3 border ${getInputBorderColor("bloodGroup")} rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:border-transparent transition-colors duration-200`}
                      onChange={handleChange}
                      value={formData.bloodGroup}
                      disabled={isSubmitting}
                    >
                      <option value="">Select Blood Group</option>
                      {bloodGroups.map((group) => (
                        <option key={group} value={group}>
                          {group}
                        </option>
                      ))}
                    </select>
                  </div>
                  {getValidationError("bloodGroup")}
                </div>

                <div className="space-y-1">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Users className="h-5 w-5 text-gray-400" />
                    </div>
                    <select
                      name="maritalStatus"
                      className={`w-full pl-10 pr-3 py-3 border ${getInputBorderColor("maritalStatus")} rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:border-transparent transition-colors duration-200`}
                      onChange={handleChange}
                      value={formData.maritalStatus}
                      disabled={isSubmitting}
                    >
                      {maritalStatuses.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </div>
                  {getValidationError("maritalStatus")}
                </div>
              </div>

              <div className="space-y-1">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <MapPin className="h-5 w-5 text-gray-400" />
                  </div>
                  <textarea
                    name="address"
                    placeholder="Complete Address (Street, City, State, ZIP)"
                    rows={3}
                    className={`w-full pl-10 pr-3 py-3 border ${getInputBorderColor("address")} rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:border-transparent resize-none transition-colors duration-200`}
                    onChange={handleChange}
                    value={formData.address}
                    disabled={isSubmitting}
                  />
                </div>
                {getValidationError("address")}
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Profile Image</label>
                <input
                  name="profileImage"
                  type="file"
                  accept=".jpg,.jpeg,.png,.webp"
                  className={`w-full px-3 py-3 border ${getInputBorderColor("profileImage")} rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:border-transparent transition-colors duration-200`}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
                <p className="text-xs text-gray-500">Max file size: 5MB (JPG, JPEG, PNG, WebP)</p>
                {getValidationError("profileImage")}
              </div>
            </div>

            {/* Medical & Emergency Information */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-700 border-b pb-2">Medical & Emergency Information</h3>

              <div className="space-y-1">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    name="emergencyContactName"
                    placeholder="Emergency Contact Name"
                    className={`w-full pl-10 pr-3 py-3 border ${getInputBorderColor("emergencyContactName")} rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:border-transparent transition-colors duration-200`}
                    onChange={handleChange}
                    value={formData.emergencyContactName}
                    disabled={isSubmitting}
                  />
                </div>
                {getValidationError("emergencyContactName")}
              </div>

              <div className="space-y-1">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Phone className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    name="emergencyContactNumber"
                    placeholder="Emergency Contact Number"
                    className={`w-full pl-10 pr-3 py-3 border ${getInputBorderColor("emergencyContactNumber")} rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:border-transparent transition-colors duration-200`}
                    onChange={handleChange}
                    value={formData.emergencyContactNumber}
                    disabled={isSubmitting}
                  />
                </div>
                {getValidationError("emergencyContactNumber")}
              </div>

              <div className="space-y-1">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Shield className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    name="healthInsuranceProvider"
                    placeholder="Health Insurance Provider"
                    className={`w-full pl-10 pr-3 py-3 border ${getInputBorderColor("healthInsuranceProvider")} rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:border-transparent transition-colors duration-200`}
                    onChange={handleChange}
                    value={formData.healthInsuranceProvider}
                    disabled={isSubmitting}
                  />
                </div>
                {getValidationError("healthInsuranceProvider")}
              </div>

              <div className="space-y-1">
                <div className="relative">
                  <div className="absolute top-3 left-3 pointer-events-none">
                    <FileText className="h-5 w-5 text-gray-400" />
                  </div>
                  <textarea
                    name="medicalHistory"
                    placeholder="Medical History (Previous surgeries, major illnesses, etc.)"
                    rows={3}
                    maxLength={2000}
                    className={`w-full pl-10 pr-3 py-3 border ${getInputBorderColor("medicalHistory")} rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:border-transparent resize-none transition-colors duration-200`}
                    onChange={handleChange}
                    value={formData.medicalHistory}
                    disabled={isSubmitting}
                  />
                </div>
                <div className="flex justify-between items-center">
                  {getValidationError("medicalHistory")}
                  <span className="text-xs text-gray-400 ml-auto">{formData.medicalHistory.length}/2000</span>
                </div>
              </div>

              <div className="space-y-1">
                <div className="relative">
                  <div className="absolute top-3 left-3 pointer-events-none">
                    <AlertCircle className="h-5 w-5 text-gray-400" />
                  </div>
                  <textarea
                    name="allergies"
                    placeholder="Known Allergies (Food, medication, environmental)"
                    rows={2}
                    maxLength={500}
                    className={`w-full pl-10 pr-3 py-3 border ${getInputBorderColor("allergies")} rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:border-transparent resize-none transition-colors duration-200`}
                    onChange={handleChange}
                    value={formData.allergies}
                    disabled={isSubmitting}
                  />
                </div>
                <div className="flex justify-between items-center">
                  {getValidationError("allergies")}
                  <span className="text-xs text-gray-400 ml-auto">{formData.allergies.length}/500</span>
                </div>
              </div>

              <div className="space-y-1">
                <div className="relative">
                  <div className="absolute top-3 left-3 pointer-events-none">
                    <Activity className="h-5 w-5 text-gray-400" />
                  </div>
                  <textarea
                    name="chronicDiseases"
                    placeholder="Chronic Diseases (Diabetes, hypertension, etc.)"
                    rows={2}
                    maxLength={1000}
                    className={`w-full pl-10 pr-3 py-3 border ${getInputBorderColor("chronicDiseases")} rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:border-transparent resize-none transition-colors duration-200`}
                    onChange={handleChange}
                    value={formData.chronicDiseases}
                    disabled={isSubmitting}
                  />
                </div>
                <div className="flex justify-between items-center">
                  {getValidationError("chronicDiseases")}
                  <span className="text-xs text-gray-400 ml-auto">{formData.chronicDiseases.length}/1000</span>
                </div>
              </div>

              <div className="space-y-1">
                <div className="relative">
                  <div className="absolute top-3 left-3 pointer-events-none">
                    <FileText className="h-5 w-5 text-gray-400" />
                  </div>
                  <textarea
                    name="medications"
                    placeholder="Current Medications (Include dosage and frequency)"
                    rows={2}
                    maxLength={1000}
                    className={`w-full pl-10 pr-3 py-3 border ${getInputBorderColor("medications")} rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:border-transparent resize-none transition-colors duration-200`}
                    onChange={handleChange}
                    value={formData.medications}
                    disabled={isSubmitting}
                  />
                </div>
                <div className="flex justify-between items-center">
                  {getValidationError("medications")}
                  <span className="text-xs text-gray-400 ml-auto">{formData.medications.length}/1000</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 px-6 py-4 bg-gray-50 rounded-b-xl flex justify-end space-x-3">
          {allowCancel && (
            <button
              onClick={handleClose}
              className="px-6 py-3 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              disabled={isSubmitting}
            >
              Cancel
            </button>
          )}

          <button
            onClick={handleRegister}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isSubmitting || Object.keys(validationErrors).length > 0}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin h-4 w-4 mr-2" />
                Registering...
              </>
            ) : (
              "Register as Patient"
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default PatientRegisterModal
