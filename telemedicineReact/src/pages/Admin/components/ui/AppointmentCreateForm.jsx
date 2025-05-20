import React, { useEffect, useState } from "react";
import axios from "axios";
import Input from "../../../../components/ui/Input";
import Button from "../../../../components/Button";
import { Calendar, Clock, User, Search, FileText, X } from "lucide-react";

const API_URL = "http://localhost:5186/api";

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

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
  "Surgery",
];

const AppointmentCreateForm = ({
  handleCreateAppointment,
  cancelCreateForm,
  formData,
  setFormData,
  isModalOpen,
}) => {
  const [doctors, setDoctors] = useState([]);
  const [availabilities, setAvailabilities] = useState([]);
  const [availableTimes, setAvailableTimes] = useState([]);
  const [patients, setPatients] = useState([]);
  const [activeStep, setActiveStep] = useState(1);

  // Reset scheduledTime on modal open as before
  useEffect(() => {
    if (isModalOpen) {
      setFormData((prev) => ({
        ...prev,
        scheduledTime: "",
        doctorId: null,
        patientId: null,
        specialization: "",
        appointmentDate: "",
        startTime: "",
        endTime: "",
        patientSearchQuery: "",
      }));
      setDoctors([]);
      setAvailabilities([]);
      setAvailableTimes([]);
      setPatients([]);
      setActiveStep(1);
    }
  }, [isModalOpen, setFormData]);

  // Fetch doctors by specialization
  useEffect(() => {
    if (!formData.specialization) {
      setDoctors([]);
      setFormData((prev) => ({ ...prev, doctorId: null }));
      return;
    }

    apiClient
      .get(`/Doctor/GetDoctorsBySpecialization?specialization=${formData.specialization}`)
      .then((res) => {
        setDoctors(res.data);
        setFormData((prev) => ({ ...prev, doctorId: null }));
        setAvailabilities([]);
        setAvailableTimes([]);
        setFormData((prev) => ({
          ...prev,
          appointmentDate: "",
          startTime: "",
          endTime: "",
        }));
      })
      .catch(() => {
        setDoctors([]);
      });
  }, [formData.specialization, setFormData]);

  // Fetch doctor availability on doctor change
  useEffect(() => {
    if (!formData.doctorId) {
      setAvailabilities([]);
      setAvailableTimes([]);
      setFormData((prev) => ({
        ...prev,
        appointmentDate: "",
        startTime: "",
        endTime: "",
      }));
      return;
    }

    apiClient
      .get(`/Doctor/GetAvailability/${formData.doctorId}`)
      .then((res) => {
        setAvailabilities(res.data);
        setAvailableTimes([]);
        setFormData((prev) => ({
          ...prev,
          appointmentDate: "",
          startTime: "",
          endTime: "",
        }));
      })
      .catch(() => {
        setAvailabilities([]);
        setAvailableTimes([]);
      });
  }, [formData.doctorId, setFormData]);

  // Update available times based on selected appointmentDate
  useEffect(() => {
    if (!formData.appointmentDate || !availabilities.length) {
      setAvailableTimes([]);
      setFormData((prev) => ({ ...prev, startTime: "", endTime: "" }));
      return;
    }
    const selectedDay = new Date(formData.appointmentDate).getDay(); // Sunday=0 ... Saturday=6

    // Filter availabilities for that day
    const dayAvailabilities = availabilities.filter(
      (a) => a.dayOfWeek === selectedDay
    );

    const times = dayAvailabilities.map((a) => ({
      startTime: a.startTime,
      endTime: a.endTime,
    }));

    setAvailableTimes(times);
    setFormData((prev) => ({ ...prev, startTime: "", endTime: "" }));
  }, [formData.appointmentDate, availabilities, setFormData]);

  // Search patients based on query
  useEffect(() => {
    if (!formData.patientSearchQuery || formData.patientSearchQuery.length < 3) {
      setPatients([]);
      setFormData((prev) => ({ ...prev, patientId: null }));
      return;
    }

    apiClient
      .get(`/Doctor/SearchPatients?query=${encodeURIComponent(formData.patientSearchQuery)}`)
      .then((res) => setPatients(res.data))
      .catch(() => setPatients([]));
  }, [formData.patientSearchQuery, setFormData]);

  // Manage form steps
  useEffect(() => {
    if (formData.specialization && formData.doctorId) {
      setActiveStep(Math.max(activeStep, 2));
    }
    if (formData.appointmentDate && formData.startTime) {
      setActiveStep(Math.max(activeStep, 3));
    }
  }, [formData, activeStep]);

  // Progress indicator computation
  const getStepProgress = () => {
    if (activeStep === 1) {
      return formData.specialization && formData.doctorId ? 100 : formData.specialization ? 50 : 0;
    } else if (activeStep === 2) {
      return formData.appointmentDate && formData.startTime ? 100 : formData.appointmentDate ? 50 : 0;
    } else if (activeStep === 3) {
      return formData.patientId ? 100 : formData.patientSearchQuery ? 50 : 0;
    }
    return 0;
  };

  const getSelectedDoctor = () => {
    if (!formData.doctorId) return null;
    return doctors.find(doc => doc.doctorId === formData.doctorId);
  };

  const selectedDoctor = getSelectedDoctor();

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden w-full max-w-3xl">
      {/* Header with progress steps */}
      <div className="bg-gradient-to-r from-teal-600 to-teal-400 text-white p-6">
        <h3 className="text-2xl font-bold mb-4">Schedule Your Appointment</h3>
        
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${activeStep >= 1 ? 'bg-white text-teal-600' : 'bg-teal-700 text-white'} font-bold`}>1</div>
            <span className={activeStep >= 1 ? 'font-medium' : 'text-teal-100'}>Select Doctor</span>
          </div>
          <div className="h-1 w-12 bg-teal-300"></div>
          <div className="flex items-center space-x-2">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${activeStep >= 2 ? 'bg-white text-teal-600' : 'bg-teal-700 text-white'} font-bold`}>2</div>
            <span className={activeStep >= 2 ? 'font-medium' : 'text-teal-100'}>Choose Time</span>
          </div>
          <div className="h-1 w-12 bg-teal-300"></div>
          <div className="flex items-center space-x-2">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${activeStep >= 3 ? 'bg-white text-teal-600' : 'bg-teal-700 text-white'} font-bold`}>3</div>
            <span className={activeStep >= 3 ? 'font-medium' : 'text-teal-100'}>Patient Details</span>
          </div>
        </div>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleCreateAppointment(e, formData);
        }}
        className="p-6"
      >
        {/* Step 1: Doctor Selection */}
        <div className={`${activeStep === 1 ? 'block' : 'hidden'}`}>
          <div className="mb-6">
            <h4 className="text-lg font-semibold text-gray-700 mb-2 flex items-center">
              <span className="bg-teal-100 text-teal-600 p-1 rounded-full mr-2">
                <Calendar size={20} />
              </span>
              Select Specialization
            </h4>
            <div className="relative">
              <select
                className="w-full p-3 pl-4 rounded-lg border-2 border-gray-200 focus:border-teal-500 focus:ring focus:ring-teal-200 focus:ring-opacity-50 transition-all bg-white text-gray-700 appearance-none"
                value={formData.specialization || ""}
                onChange={(e) =>
                  setFormData({ ...formData, specialization: e.target.value })
                }
                required
              >
                <option value="" disabled>
                  Choose medical specialization
                </option>
                {specializations.map((spec) => (
                  <option key={spec} value={spec}>
                    {spec}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h4 className="text-lg font-semibold text-gray-700 mb-2 flex items-center">
              <span className="bg-teal-100 text-teal-600 p-1 rounded-full mr-2">
                <User size={20} />
              </span>
              Select Doctor
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {doctors.length > 0 ? (
                doctors.map((doc) => (
                  <div
                    key={doc.doctorId}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      formData.doctorId === doc.doctorId
                        ? "border-teal-500 bg-teal-50"
                        : "border-gray-200 hover:border-teal-300"
                    }`}
                    onClick={() =>
                      setFormData({ ...formData, doctorId: doc.doctorId })
                    }
                  >
                    <div className="flex items-center gap-3">
                      <div className="bg-teal-100 text-teal-600 p-3 rounded-full">
                        <User size={24} />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{doc.fullName}</p>
                        <p className="text-sm text-gray-500">{doc.specialization}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : formData.specialization ? (
                <div className="col-span-2 p-4 bg-gray-50 rounded-lg text-center text-gray-500">
                  No doctors available for this specialization
                </div>
              ) : (
                <div className="col-span-2 p-4 bg-gray-50 rounded-lg text-center text-gray-500">
                  Select a specialization first
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-between items-center mt-6">
            <button
              type="button"
              onClick={cancelCreateForm}
              className="px-4 py-2 rounded-lg border border-red-300 hover:bg-red-50 text-red-600 font-medium flex items-center bg-transparent"
            >
              <X size={18} className="mr-1" /> Cancel
            </button>
            <button
              type="button"
              className={`px-6 py-2 rounded-lg flex items-center font-medium ${
                formData.doctorId
                  ? "bg-teal-600 hover:bg-teal-700 text-white"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
              disabled={!formData.doctorId}
              onClick={() => setActiveStep(2)}
            >
              Next
              <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </button>
          </div>
        </div>

        {/* Step 2: Date & Time Selection */}
        <div className={`${activeStep === 2 ? 'block' : 'hidden'}`}>
          {selectedDoctor && (
            <div className="mb-6 p-3 bg-teal-50 rounded-lg flex items-center">
              <div className="bg-teal-100 text-teal-600 p-2 rounded-full mr-3">
                <User size={20} />
              </div>
              <div>
                <p className="text-sm text-teal-600">Selected Doctor</p>
                <p className="font-medium text-gray-800">{selectedDoctor.fullName} - {selectedDoctor.specialization}</p>
              </div>
            </div>
          )}

          <div className="mb-6">
            <h4 className="text-lg font-semibold text-gray-700 mb-2 flex items-center">
              <span className="bg-teal-100 text-teal-600 p-1 rounded-full mr-2">
                <Calendar size={20} />
              </span>
              Select Date
            </h4>
            <div className="relative">
              <Input
                type="date"
                name="appointmentDate"
                value={formData.appointmentDate || ""}
                onChange={(e) =>
                  setFormData({ ...formData, appointmentDate: e.target.value })
                }
                disabled={!formData.doctorId}
                required
                className="w-full p-3 pl-4 rounded-lg border-2 border-gray-200 focus:border-teal-500 focus:ring focus:ring-teal-200 focus:ring-opacity-50 transition-all bg-white text-gray-700"
              />
            </div>
          </div>

          <div className="mb-6">
            <h4 className="text-lg font-semibold text-gray-700 mb-2 flex items-center">
              <span className="bg-teal-100 text-teal-600 p-1 rounded-full mr-2">
                <Clock size={20} />
              </span>
              Select Time Slot
            </h4>
            
            {formData.appointmentDate ? (
              availableTimes.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {availableTimes.map(({ startTime, endTime }, idx) => (
                    <div
                      key={idx}
                      className={`p-3 border-2 rounded-lg text-center cursor-pointer transition-all ${
                        formData.startTime === startTime && formData.endTime === endTime
                          ? "border-teal-500 bg-teal-50"
                          : "border-gray-200 hover:border-teal-300"
                      }`}
                      onClick={() => {
                        setFormData((prev) => ({
                          ...prev,
                          startTime: startTime,
                          endTime: endTime,
                        }));
                      }}
                    >
                      <div className="flex items-center justify-center gap-1 text-gray-700">
                        <Clock size={16} className="text-teal-600" />
                        <span>{startTime} - {endTime}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 bg-amber-50 rounded-lg border border-amber-200 text-amber-700 text-center">
                  No available time slots for the selected date
                </div>
              )
            ) : (
              <div className="p-4 bg-gray-50 rounded-lg text-center text-gray-500">
                Please select a date first
              </div>
            )}
          </div>

          <div className="flex justify-between items-center mt-6">
            <button
            type="button"
            onClick={cancelCreateForm}
            className="px-4 py-2 rounded-lg border border-red-300 hover:bg-red-50 text-red-600 font-medium flex items-center bg-transparent"
          >
            <X size={18} className="mr-1" /> Cancel
          </button>
            <button
              type="button"
              className={`px-6 py-2 rounded-lg flex items-center font-medium ${
                formData.startTime && formData.endTime
                  ? "bg-teal-600 hover:bg-teal-700 text-white"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
              disabled={!formData.startTime || !formData.endTime}
              onClick={() => setActiveStep(3)}
            >
              Next
              <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </button>
          </div>
        </div>

        {/* Step 3: Patient Selection & Reason */}
        <div className={`${activeStep === 3 ? 'block' : 'hidden'}`}>
          {formData.startTime && formData.endTime && (
            <div className="mb-6 p-3 bg-teal-50 rounded-lg">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center">
                  <div className="bg-teal-100 text-teal-600 p-2 rounded-full mr-2">
                    <User size={16} />
                  </div>
                  <div className="text-sm">
                    <p className="text-teal-600">Doctor</p>
                    <p className="font-medium text-gray-800">{selectedDoctor?.fullName}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="bg-teal-100 text-teal-600 p-2 rounded-full mr-2">
                    <Calendar size={16} />
                  </div>
                  <div className="text-sm">
                    <p className="text-teal-600">Date</p>
                    <p className="font-medium text-gray-800">{new Date(formData.appointmentDate).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="bg-teal-100 text-teal-600 p-2 rounded-full mr-2">
                    <Clock size={16} />
                  </div>
                  <div className="text-sm">
                    <p className="text-teal-600">Time</p>
                    <p className="font-medium text-gray-800">{formData.startTime} - {formData.endTime}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="mb-6">
            <h4 className="text-lg font-semibold text-gray-700 mb-2 flex items-center">
              <span className="bg-teal-100 text-teal-600 p-1 rounded-full mr-2">
                <Search size={20} />
              </span>
              Patient Information
            </h4>
            <div className="relative mb-2">
              <Input
                type="text"
                name="patientSearchQuery"
                value={formData.patientSearchQuery || ""}
                onChange={(e) =>
                  setFormData({ ...formData, patientSearchQuery: e.target.value, patientId: null })
                }
                placeholder="Search by name, email or phone (min 3 chars)"
                className="w-full p-3 pl-10 rounded-lg border-2 border-gray-200 focus:border-teal-500 focus:ring focus:ring-teal-200 focus:ring-opacity-50 transition-all bg-white text-gray-700"
                autoComplete="off"
              />
              <div className="absolute left-3 top-3 text-gray-400">
                <Search size={18} />
              </div>
            </div>
          
            {/* Dropdown Search Results */}
            {patients.length > 0 && !formData.patientId && (
              <div className="bg-white border border-gray-200 rounded-lg shadow-lg mt-1 overflow-hidden">
                <div className="max-h-48 overflow-y-auto">
                  {patients.map((p) => (
                    <div
                      key={p.patientId}
                      className="p-3 hover:bg-teal-50 cursor-pointer border-b border-gray-100 flex items-center"
                      onClick={() => {
                        setFormData((prev) => ({
                          ...prev,
                          patientId: p.patientId,
                          patientSearchQuery: `${p.fullName} (${p.email})`,
                        }));
                        setPatients([]);
                      }}
                    >
                      <div className="bg-teal-100 text-teal-600 p-2 rounded-full mr-3">
                        <User size={16} />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{p.fullName}</p>
                        <div className="flex text-xs text-gray-500 gap-2">
                          <span>{p.email}</span>
                          <span>•</span>
                          <span>{p.phoneNumber}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Show Selected Patient */}
            {formData.patientId && (
              <div className="mt-2 p-3 bg-green-50 rounded-lg border border-green-100 flex items-center">
                <div className="bg-green-100 text-green-600 p-2 rounded-full mr-3">
                  <User size={16} />
                </div>
                <div>
                  <p className="text-sm text-green-600">Selected Patient</p>
                  <p className="font-medium text-gray-800">{formData.patientSearchQuery}</p>
                </div>
                <button 
                  type="button"
                  className="ml-auto text-gray-400 hover:text-red-500"
                  onClick={() => setFormData((prev) => ({
                    ...prev,
                    patientId: null,
                    patientSearchQuery: "",
                  }))}
                >
                  <X size={18} />
                </button>
              </div>
            )}
          </div>

          <div className="mb-6">
            <h4 className="text-lg font-semibold text-gray-700 mb-2 flex items-center">
              <span className="bg-teal-100 text-teal-600 p-1 rounded-full mr-2">
                <FileText size={20} />
              </span>
              Reason for Visit
            </h4>
            <div className="relative">
              <Input
                type="text"
                name="reason"
                value={formData.reason || ""}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                placeholder="Briefly describe the reason for this appointment"
                className="w-full p-3 pl-4 rounded-lg border-2 border-gray-200 focus:border-teal-500 focus:ring focus:ring-teal-200 focus:ring-opacity-50 transition-all bg-white text-gray-700"
              />
            </div>
          </div>

          <div className="flex justify-between items-center mt-6">
            <button
            type="button"
            onClick={cancelCreateForm}
            className="px-4 py-2 rounded-lg border border-red-300 hover:bg-red-50 text-red-600 font-medium flex items-center bg-transparent"
          >
            <X size={18} className="mr-1" /> Cancel
          </button>
            <Button 
              type="submit"
              className="px-6 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-medium flex items-center disabled:bg-gray-300 disabled:cursor-not-allowed"
              disabled={!formData.patientId}
            >
              Schedule Appointment
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AppointmentCreateForm;