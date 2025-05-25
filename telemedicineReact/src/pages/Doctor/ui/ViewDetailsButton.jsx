import { useState, useEffect } from 'react';
import { FileSearch, X, Pill, Calendar, ClipboardList, AlertCircle } from 'lucide-react';
import { apiClient } from '../services/doctorAppointmentApi';
import toast from 'react-hot-toast';

const ViewDetailsButton = ({ appointmentId }) => {
  const [showModal, setShowModal] = useState(false);
  const [consultationDetails, setConsultationDetails] = useState(null);
  const [prescriptionDetails, setPrescriptionDetails] = useState([]);
  
  const fetchDetails = async () => {
    try {
      const token = localStorage.getItem("token");
      
      // Step 1: Get Consultation ID from Appointment ID
      const consultationIdRes = await apiClient.get(`GetConsultationIdByAppointmentId/${appointmentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      const consultationId = consultationIdRes.data.consultationId;
      
      // Step 2: Get actual consultation details
      const consultationRes = await apiClient.get(`/GetConsultationById/${consultationId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      setConsultationDetails(consultationRes.data);
      
      // Step 3: Get Prescription directly using appointmentId
      const prescriptionRes = await apiClient.get(`/GetPrescriptionByAppointmentId/${appointmentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      setPrescriptionDetails(prescriptionRes.data.prescriptionItems || []);
      setShowModal(true);
    } catch (err) {
      console.error("Error fetching consultation/prescription:", err);
      toast.error("Either the consultation or Prescription is missing.")
    }
  };

  return (
    <>
      <button
        onClick={fetchDetails}
        className="flex items-center bg-blue-500 text-white hover:bg-blue-600 px-4 py-2 text-sm rounded-full shadow-sm transition-all font-medium"
      >
        <FileSearch size={16} className="mr-2" />
        View Details
      </button>
      
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full md:w-3/4 lg:w-2/3 xl:w-1/2 max-h-[90vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-4 flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">Patient Consultation Summary</h2>
              <button 
                onClick={() => setShowModal(false)} 
                className="text-white hover:bg-blue-700 rounded-full p-1 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            {/* Content Area */}
            <div className="p-6 overflow-y-auto">
              {/* Consultation Details Card */}
              <div className="bg-blue-50 rounded-lg p-5 mb-6 border border-blue-100 shadow-sm">
                <div className="flex items-center mb-3 border-b border-blue-200 pb-2">
                  <ClipboardList className="text-blue-600 mr-2" size={20} />
                  <h3 className="text-lg font-semibold text-blue-800">Consultation Details</h3>
                </div>
                
                {consultationDetails ? (
                  <div className="space-y-3">
                    <div>
                      <div className="font-medium text-blue-800 mb-1">Notes</div>
                      <div className="bg-white rounded-md p-3 border border-blue-100 text-gray-700">
                        {consultationDetails.notes || "No notes recorded"}
                      </div>
                    </div>
                    
                    <div>
                      <div className="font-medium text-blue-800 mb-1">Recommendations</div>
                      <div className="bg-white rounded-md p-3 border border-blue-100 text-gray-700">
                        {consultationDetails.recommendations || "No recommendations provided"}
                      </div>
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar size={16} className="mr-2 text-blue-600" />
                      <span>Consultation Date: {new Date(consultationDetails.createdAt).toLocaleString()}</span>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center p-4 text-gray-500">
                    <AlertCircle size={18} className="mr-2" />
                    No consultation record found
                  </div>
                )}
              </div>
              
              {/* Prescription Card */}
              <div className="bg-green-50 rounded-lg p-5 border border-green-100 shadow-sm">
                <div className="flex items-center mb-4 border-b border-green-200 pb-2">
                  <Pill className="text-green-600 mr-2" size={20} />
                  <h3 className="text-lg font-semibold text-green-800">Prescription</h3>
                </div>
                
                {prescriptionDetails.length > 0 ? (
                  <div className="space-y-3">
                    {prescriptionDetails.map((item, idx) => (
                      <div key={idx} className="bg-white rounded-md p-4 border border-green-100 shadow-sm">
                        <div className="font-semibold text-green-800 mb-2">{item.medicineName}</div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                          <div className="bg-green-50 px-3 py-1 rounded text-sm">
                            <span className="font-medium">Dosage:</span> {item.dosage}
                          </div>
                          <div className="bg-green-50 px-3 py-1 rounded text-sm">
                            <span className="font-medium">Frequency:</span> {item.frequency}
                          </div>
                          <div className="bg-green-50 px-3 py-1 rounded text-sm">
                            <span className="font-medium">Duration:</span> {item.duration}
                          </div>
                        </div>
                        {item.notes && (
                          <div className="mt-2 text-sm text-gray-600 bg-yellow-50 p-2 rounded border-l-2 border-yellow-400">
                            <span className="font-medium text-yellow-700">Note:</span> {item.notes}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center justify-center p-4 text-gray-500">
                    <AlertCircle size={18} className="mr-2" />
                    No prescription has been issued for this appointment
                  </div>
                )}
              </div>
            </div>
            
            {/* Footer */}
            <div className="border-t border-gray-200 p-4 bg-gray-50 flex justify-end">
              <button 
                onClick={() => setShowModal(false)} 
                className="bg-red-500 hover:bg-red-600 text-white font-medium px-5 py-2 rounded-lg transition-colors shadow-sm flex items-center"
              >
                <X size={16} className="mr-2" />
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ViewDetailsButton;