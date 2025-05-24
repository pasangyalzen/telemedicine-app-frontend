import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const PharmacistCreateForm = ({ isOpen, onClose }) => {
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [gender, setGender] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [pharmacyName, setPharmacyName] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");
  const [pharmacyAddress, setPharmacyAddress] = useState("");
  const [workingHours, setWorkingHours] = useState("");
  const [servicesOffered, setServicesOffered] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const API_URL = "http://localhost:5186/api";

  const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !fullName ||
      !phoneNumber ||
      !gender ||
      !dateOfBirth ||
      !pharmacyName ||
      !licenseNumber ||
      !pharmacyAddress
    ) {
      toast.error("Please fill all required fields.");
      return;
    }

    const formData = new FormData();
    formData.append("FullName", fullName);
    formData.append("PhoneNumber", phoneNumber);
    formData.append("Gender", gender);
    formData.append("DateOfBirth", dateOfBirth);
    formData.append("PharmacyName", pharmacyName);
    formData.append("LicenseNumber", licenseNumber);
    formData.append("PharmacyAddress", pharmacyAddress);
    formData.append("WorkingHours", workingHours);
    formData.append("ServicesOffered", servicesOffered);
    if (profileImage) {
      formData.append("ProfileImage", profileImage);
    }

    // Include UserId if required by your API (get it from your auth token or context)
    // formData.append("UserId", userId);

    try {
      setLoading(true);
      await apiClient.post("/Admin/Pharmacist/RegisterPharmacist", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Pharmacist registered successfully!");
      onClose();
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data?.message || "Registration failed.");
      } else {
        toast.error("Network error during registration.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-xl relative overflow-auto max-h-[90vh]">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 text-3xl font-semibold transition"
          aria-label="Close modal"
        >
          &times;
        </button>

        <h2 className="text-3xl font-extrabold mb-6 text-center text-teal-700 tracking-wide">
          Register Pharmacist
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block mb-1 font-semibold">Full Name*</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold">Phone Number*</label>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold">Gender*</label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="" disabled>
                Select gender
              </option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block mb-1 font-semibold">Date of Birth*</label>
            <input
              type="date"
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold">Pharmacy Name*</label>
            <input
              type="text"
              value={pharmacyName}
              onChange={(e) => setPharmacyName(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold">License Number*</label>
            <input
              type="text"
              value={licenseNumber}
              onChange={(e) => setLicenseNumber(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold">Pharmacy Address*</label>
            <textarea
              value={pharmacyAddress}
              onChange={(e) => setPharmacyAddress(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold">Working Hours</label>
            <input
              type="text"
              value={workingHours}
              onChange={(e) => setWorkingHours(e.target.value)}
              placeholder="e.g. 9 AM - 6 PM"
              className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold">Services Offered</label>
            <textarea
              value={servicesOffered}
              onChange={(e) => setServicesOffered(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold">Profile Image (jpg, jpeg, png)</label>
            <input
              type="file"
              accept=".jpg,.jpeg,.png"
              onChange={(e) => setProfileImage(e.target.files[0])}
              className="w-full"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-md shadow-md transition"
          >
            {loading ? "Registering..." : "Register Pharmacist"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PharmacistCreateForm;