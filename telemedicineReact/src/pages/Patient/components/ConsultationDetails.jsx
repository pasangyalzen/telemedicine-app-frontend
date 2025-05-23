// import React, { useEffect, useState } from "react";
// import axios from "axios";

// const ConsultationDetails = ({ appointmentId }) => {
//   const [consultation, setConsultation] = useState(null);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     if (!appointmentId) return;

//     const fetchConsultation = async () => {
//       try {
//         const response = await axios.get(
//           `http://localhost:5186/api/Patient/GetConsultationByAppointmentId/${appointmentId}`,{
//             headers: {
//                 "Authorization": `Bearer ${localStorage.getItem("token")}`, // Add token for authentication
//               },
//           }
//         );
//         setConsultation(response.data);
//         setError("");
//       } catch (err) {
//         setError("Consultation not found for this appointment.");
//         setConsultation(null);
//       }
//     };

//     fetchConsultation();
//   }, [appointmentId]);

//   return (
//     <div className="p-4 bg-white rounded-2xl shadow-md max-w-xl mx-auto mt-6">
//       <h2 className="text-xl font-semibold mb-4 text-gray-800">Consultation Details</h2>
      
//       {error && <p className="text-red-500">{error}</p>}

//       {consultation ? (
//         <div className="space-y-3 text-gray-700">
//           <p>
//             <span className="font-semibold">Consultation ID:</span> {consultation.consultationId}
//           </p>
//           <p>
//             <span className="font-semibold">Appointment ID:</span> {consultation.appointmentId}
//           </p>
//           <p>
//             <span className="font-semibold">Notes:</span> {consultation.notes}
//           </p>
//           <p>
//             <span className="font-semibold">Recommendations:</span> {consultation.recommendations}
//           </p>
//           <p>
//             <span className="font-semibold">Created At:</span>{" "}
//             {new Date(consultation.createdAt).toLocaleString()}
//           </p>
//         </div>
//       ) : !error ? (
//         <p className="text-gray-500">Loading consultation...</p>
//       ) : null}
//     </div>
//   );
// };

// export default ConsultationDetails;