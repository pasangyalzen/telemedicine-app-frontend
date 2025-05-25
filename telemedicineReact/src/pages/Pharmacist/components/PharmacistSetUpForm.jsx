"use client"

import { useState } from "react"
import axios from "axios"
import toast from "react-hot-toast"
import { X, User, Phone, Calendar, Building, MapPin, Briefcase, Clock, Loader2 } from "lucide-react"
import { getUserIdFromToken } from "../../auth/auth"

const PharmacistSetupForm = ({ isOpen, onClose, onSuccess, email }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    gender: "Male",
    dateOfBirth: "",
    pharmacyName: "",
    licenseNumber: "",
    pharmacyAddress: "",
    workingHours: "",
    servicesOffered: "",
    profileImage: null,
  })

  // Add state for validation errors
  const [validationErrors, setValidationErrors] = useState({})
  // Add state for form submission
  const [isSubmitting, setIsSubmitting] = useState(false)
  // Add state for general error message
  const [generalError, setGeneralError] = useState("")
  // Add state for success message
  const [successMessage, setSuccessMessage] = useState("")

  if (!isOpen) return null

  const API_URL = "http://localhost:5186/api"

  const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  })

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

      case "pharmacyName":
        if (!value) error = "Pharmacy name is required."
        else if (value.length > 100) error = "Pharmacy name cannot exceed 100 characters."
        break

      case "licenseNumber":
        if (!value) error = "License number is required."
        else if (value.length > 50) error = "License number cannot exceed 50 characters."
        break

      case "pharmacyAddress":
        if (!value) error = "Pharmacy address is required."
        else if (value.length > 500) error = "Pharmacy address cannot exceed 500 characters."
        break

      case "workingHours":
        if (value && value.length > 100) error = "Working hours cannot exceed 100 characters."
        break

      case "servicesOffered":
        if (value && value.length > 1000) error = "Services offered cannot exceed 1000 characters."
        break

      case "profileImage":
        if (value) {
          const fileName = value.name.toLowerCase()
          const allowedExtensions = [".jpg", ".jpeg", ".png"]
          const hasValidExtension = allowedExtensions.some((ext) => fileName.endsWith(ext))
          if (!hasValidExtension) error = "Only JPG, JPEG, and PNG files are allowed."
          else if (value.size > 5 * 1024 * 1024) error = "File size must be less than 5MB."
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

    // Required fields validation
    const requiredFields = [
      "fullName",
      "phoneNumber",
      "dateOfBirth",
      "pharmacyName",
      "licenseNumber",
      "pharmacyAddress",
    ]

    requiredFields.forEach((field) => {
      const error = validateField(field, formData[field])
      if (error) errors[field.charAt(0).toUpperCase() + field.slice(1)] = error
    })

    // Optional fields validation
    const optionalFields = ["workingHours", "servicesOffered", "profileImage"]
    optionalFields.forEach((field) => {
      if (formData[field]) {
        const error = validateField(field, formData[field])
        if (error) errors[field.charAt(0).toUpperCase() + field.slice(1)] = error
      }
    })

    // Add this check in validateForm function
    const userId = getUserIdFromToken()
    if (!userId) {
      errors.UserId = "User authentication required. Please log in again."
    }

    return errors
  }

  // Helper function to display validation errors
  const getValidationError = (fieldName) => {
    const errorKey = fieldName.charAt(0).toUpperCase() + fieldName.slice(1)
    return validationErrors[errorKey] ? <p className="text-red-500 text-xs mt-1">{validationErrors[errorKey]}</p> : null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    

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

    const formDataToSend = new FormData()
    formDataToSend.append("UserId", getUserIdFromToken()) // Add this line
    formDataToSend.append("FullName", formData.fullName)
    formDataToSend.append("PhoneNumber", formData.phoneNumber)
    formDataToSend.append("Gender", formData.gender)
    formDataToSend.append("DateOfBirth", formData.dateOfBirth)
    formDataToSend.append("PharmacyName", formData.pharmacyName)
    formDataToSend.append("LicenseNumber", formData.licenseNumber)
    formDataToSend.append("PharmacyAddress", formData.pharmacyAddress)
    formDataToSend.append("WorkingHours", formData.workingHours)
    formDataToSend.append("ServicesOffered", formData.servicesOffered)
    if (formData.profileImage) {
      formDataToSend.append("ProfileImage", formData.profileImage)
    }

    try {
      setIsSubmitting(true)
      await apiClient.post("/Pharmacist/RegisterPharmacist", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      // Show success message
      setSuccessMessage("Pharmacist registered successfully!")
      toast.success("Pharmacist registered successfully!")

      // Reset form
      setFormData({
        fullName: "",
        phoneNumber: "",
        gender: "Male",
        dateOfBirth: "",
        pharmacyName: "",
        licenseNumber: "",
        pharmacyAddress: "",
        workingHours: "",
        servicesOffered: "",
        profileImage: null,
      })

      // Wait a moment to show the success message before closing
      setTimeout(() => {
        if (onSuccess) {
          onSuccess()
        }
        window.location.reload()
      }, 1500)
    } catch (error) {
      console.error("Registration error:", error)

      // Add this check in the catch block before other error handling
      if (error.response?.status === 401) {
        setGeneralError("Authentication failed. Please log in again.")
        return
      }

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
      setGeneralError("Pharmacist registration failed. Please try again.")
      toast.error("Registration failed. Please try again.")
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

  const handleClose = () => {
    if (!isSubmitting) {
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full overflow-y-auto max-h-[90vh] relative">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-600 to-teal-500 text-white px-6 py-4 rounded-t-xl">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Complete Pharmacist Registration</h2>
            <button
              onClick={handleClose}
              disabled={isSubmitting}
              className="text-white hover:bg-teal-700 rounded-full p-1 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Close modal"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <p className="text-teal-100 text-sm mt-1">Complete your profile to start managing your pharmacy</p>
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

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-700 border-b pb-2">Personal Information</h3>

                <div className="space-y-1">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="fullName"
                      placeholder="Full Name *"
                      value={formData.fullName}
                      onChange={handleChange}
                      disabled={isSubmitting}
                      className={`w-full pl-10 pr-3 py-3 border ${
                        validationErrors.FullName ? "border-red-500" : "border-gray-300"
                      } rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed`}
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
                      type="tel"
                      name="phoneNumber"
                      placeholder="Phone Number *"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      disabled={isSubmitting}
                      className={`w-full pl-10 pr-3 py-3 border ${
                        validationErrors.PhoneNumber ? "border-red-500" : "border-gray-300"
                      } rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed`}
                    />
                  </div>
                  {getValidationError("phoneNumber")}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      disabled={isSubmitting}
                      className="w-full px-3 py-3 border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <Calendar className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="date"
                        name="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={handleChange}
                        disabled={isSubmitting}
                        className={`w-full pl-10 pr-3 py-3 border ${
                          validationErrors.DateOfBirth ? "border-red-500" : "border-gray-300"
                        } rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed`}
                      />
                    </div>
                    {getValidationError("dateOfBirth")}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Profile Image</label>
                  <input
                    type="file"
                    name="profileImage"
                    accept=".jpg,.jpeg,.png"
                    onChange={handleChange}
                    disabled={isSubmitting}
                    className={`w-full px-3 py-3 border ${
                      validationErrors.ProfileImage ? "border-red-500" : "border-gray-300"
                    } rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed`}
                  />
                  <p className="text-sm text-gray-500 mt-1">Accepted formats: JPG, JPEG, PNG (Max: 5MB)</p>
                  {getValidationError("profileImage")}
                </div>
              </div>

              {/* Pharmacy Information */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-700 border-b pb-2">Pharmacy Information</h3>

                <div className="space-y-1">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Building className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="pharmacyName"
                      placeholder="Pharmacy Name *"
                      value={formData.pharmacyName}
                      onChange={handleChange}
                      disabled={isSubmitting}
                      className={`w-full pl-10 pr-3 py-3 border ${
                        validationErrors.PharmacyName ? "border-red-500" : "border-gray-300"
                      } rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed`}
                    />
                  </div>
                  {getValidationError("pharmacyName")}
                </div>

                <div className="space-y-1">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Briefcase className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="licenseNumber"
                      placeholder="License Number *"
                      value={formData.licenseNumber}
                      onChange={handleChange}
                      disabled={isSubmitting}
                      className={`w-full pl-10 pr-3 py-3 border ${
                        validationErrors.LicenseNumber ? "border-red-500" : "border-gray-300"
                      } rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed`}
                    />
                  </div>
                  {getValidationError("licenseNumber")}
                </div>

                <div className="space-y-1">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <MapPin className="h-5 w-5 text-gray-400" />
                    </div>
                    <textarea
                      name="pharmacyAddress"
                      placeholder="Pharmacy Address *"
                      value={formData.pharmacyAddress}
                      onChange={handleChange}
                      disabled={isSubmitting}
                      rows={3}
                      className={`w-full pl-10 pr-3 py-3 border ${
                        validationErrors.PharmacyAddress ? "border-red-500" : "border-gray-300"
                      } rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed resize-none`}
                    />
                  </div>
                  {getValidationError("pharmacyAddress")}
                </div>

                <div className="space-y-1">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Clock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="workingHours"
                      placeholder="Working Hours (e.g. 9 AM - 6 PM)"
                      value={formData.workingHours}
                      onChange={handleChange}
                      disabled={isSubmitting}
                      className={`w-full pl-10 pr-3 py-3 border ${
                        validationErrors.WorkingHours ? "border-red-500" : "border-gray-300"
                      } rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed`}
                    />
                  </div>
                  {getValidationError("workingHours")}
                </div>

                <div className="space-y-1">
                  <textarea
                    name="servicesOffered"
                    placeholder="Services Offered (Optional)"
                    value={formData.servicesOffered}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    rows={3}
                    className={`w-full px-3 py-3 border ${
                      validationErrors.ServicesOffered ? "border-red-500" : "border-gray-300"
                    } rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed resize-none`}
                  />
                  {getValidationError("servicesOffered")}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-gray-200 pt-6 flex justify-end space-x-4">
              <button
                type="button"
                onClick={handleClose}
                disabled={isSubmitting}
                className="px-6 py-3 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin h-4 w-4 mr-2" />
                    Registering...
                  </>
                ) : (
                  "Complete Registration"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default PharmacistSetupForm
