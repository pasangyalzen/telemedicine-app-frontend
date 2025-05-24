// import { User, CalendarIcon, ClockIcon, FileText, Video, AlertCircle, Hash } from "lucide-react"
// import { useNavigate } from "react-router-dom";
// import { initiatePayment } from "../../Doctor/services/PaymentService";

// export const AppointmentList = ({
//   appointments = [],
//   error = "",
//   searchQuery = "",
//   onViewConsultation = null,
//   showJoinCall = false,
//   onRescheduleClick,
//   onCancelClick,
//   hideProceedPayment = false,
  
// }) => {
//   if (error) {
//     return (
//       <div className="bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-2xl p-6 shadow-lg">
//         <div className="flex items-center">
//           <div className="flex-shrink-0">
//             <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center shadow-md">
//               <AlertCircle className="h-6 w-6 text-white" />
//             </div>
//           </div>
//           <div className="ml-4">
//             <h3 className="text-lg font-semibold text-red-800">Error</h3>
//             <p className="text-sm text-red-700 mt-1">{error}</p>
//           </div>
//         </div>
//       </div>
//     )
//   }

//   if (appointments.length === 0) {
//     return (
//       <div className="text-center py-16 bg-gradient-to-br from-teal-50 via-teal-100 to-cyan-50 rounded-3xl border-2 border-teal-200 shadow-xl">
//         <div className="w-20 h-20 mx-auto bg-gradient-to-br from-teal-400 to-teal-500 rounded-full flex items-center justify-center shadow-lg mb-6">
//           <CalendarIcon className="h-10 w-10 text-white" />
//         </div>
//         <h3 className="text-2xl font-bold text-teal-900 mb-3">No appointments found</h3>
//         <p className="text-base text-teal-700 max-w-md mx-auto leading-relaxed">
//           {searchQuery ? "No results match your search criteria. Try adjusting your filters." : "You don't have any appointments in this category yet."}
//         </p>
//       </div>
//     )
//   }
//   const navigate = useNavigate();

//   return (
//     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//       {appointments.map((item, index) => {
//         console.log("Appointment Item:", item);
//         const appointmentDate = new Date(item.appointmentDate)
//         const isToday = new Date().toDateString() === appointmentDate.toDateString()

//         let statusColor = "bg-slate-100 text-slate-700 border-slate-200"
//         if (item.status === "Completed") statusColor = "bg-gradient-to-r from-teal-100 to-emerald-100 text-teal-800 border-teal-200"
//         if (item.status === "Cancelled") statusColor = "bg-gradient-to-r from-red-100 to-rose-100 text-red-800 border-red-200"
//         if (item.status === "Confirmed") statusColor = "bg-gradient-to-r from-teal-100 to-cyan-100 text-teal-800 border-teal-200"
//         if (item.status === "Pending") statusColor = "bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-800 border-amber-200"

//         return (
//           <div
//             key={index}
//             className="bg-white rounded-3xl shadow-xl border-2 border-teal-100 overflow-hidden hover:shadow-2xl hover:border-teal-200 transition-all duration-500 transform hover:-translate-y-1"
//           >
//             <div className="p-6 bg-gradient-to-br from-teal-50 via-teal-100 to-cyan-50 border-b-2 border-teal-200">
//               <div className="flex justify-between items-center mb-4">
//                 <div className="flex items-center">
//                   <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center text-white shadow-lg">
//                     <User className="w-8 h-8" />
//                   </div>
//                   <div className="ml-4">
//                     <h3 className="text-lg font-bold text-teal-900">{item.doctorName || "N/A"}</h3>
//                     <p className="text-sm text-teal-600 font-medium">Medical Doctor</p>
//                   </div>
//                 </div>
//                 <span className={`px-4 py-2 rounded-2xl text-sm font-bold border-2 shadow-md ${statusColor}`}>
//                   {item.status}
//                 </span>
//               </div>
//             </div>

//             <div className="p-6 space-y-4">
//               <div className="flex items-start p-3 bg-teal-50 rounded-2xl border border-teal-100">
//                 <div className="w-10 h-10 bg-teal-500 rounded-xl flex items-center justify-center mr-4 shadow-md">
//                   <Hash className="w-5 h-5 text-white" />
//                 </div>
//                 <div>
//                   <p className="text-xs text-teal-600 font-medium uppercase tracking-wide">Appointment ID</p>
//                   <p className="text-sm text-teal-900 font-bold">{item.appointmentId}</p>
//                 </div>
//               </div>

//               <div className="flex items-start p-3 bg-gradient-to-r from-teal-50 to-cyan-50 rounded-2xl border border-teal-100">
//                 <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-xl flex items-center justify-center mr-4 shadow-md">
//                   <CalendarIcon className="w-5 h-5 text-white" />
//                 </div>
//                 <div>
//                   <p className="text-xs text-teal-600 font-medium uppercase tracking-wide">Date</p>
//                   <p className="text-sm text-teal-900 font-bold">
//                     {appointmentDate.toLocaleDateString("en-US", {
//                       weekday: "long",
//                       year: "numeric",
//                       month: "long",
//                       day: "numeric",
//                     })}
//                   </p>
//                   {isToday && (
//                     <span className="inline-block mt-1 px-2 py-1 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs font-bold rounded-full shadow-md">
//                       Today
//                     </span>
//                   )}
//                 </div>
//               </div>

//               <div className="flex items-start p-3 bg-gradient-to-r from-cyan-50 to-teal-50 rounded-2xl border border-teal-100">
//                 <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-teal-500 rounded-xl flex items-center justify-center mr-4 shadow-md">
//                   <ClockIcon className="w-5 h-5 text-white" />
//                 </div>
//                 <div>
//                   <p className="text-xs text-teal-600 font-medium uppercase tracking-wide">Time</p>
//                   <p className="text-sm text-teal-900 font-bold">
//                     {item.startTime} - {item.endTime}
//                   </p>
//                 </div>
//               </div>

//               <div className="space-y-3 pt-2">
//                 {onViewConsultation && (
//                   <button
//                     onClick={() => onViewConsultation(item.appointmentId, item)}
//                     className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-teal-600 to-teal-700 text-white px-6 py-4 rounded-2xl hover:from-teal-700 hover:to-teal-800 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-teal-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-semibold"
//                   >
//                     <FileText className="w-5 h-5" />
//                     View Consultation
//                   </button>
//                 )}

//                 {showJoinCall && (
//                   <button
//                     onClick={() => {
//                       const email = localStorage.getItem("email"); // or decode JWT if needed
//                       const room = item.appointmentId;
//                       navigate(`/lobby?email=${encodeURIComponent(email)}&room=${room}`);
//                     }}
//                     className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white px-6 py-4 rounded-2xl hover:from-emerald-700 hover:to-emerald-800 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-emerald-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-semibold"
//                   >
//                     <Video className="w-5 h-5" />
//                     Join Call
//                   </button>
//                 )}

//                 {(item.status === "Pending" || item.status === "Confirmed" || item.status === "Rescheduled") && onRescheduleClick && (
//                   <button
//                     onClick={() => onRescheduleClick(item)}
//                     className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-4 rounded-2xl hover:from-amber-600 hover:to-orange-600 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-amber-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-semibold"
//                   >
//                     Reschedule
//                   </button>
//                 )}

//                 {(onCancelClick && (item.status === "Pending" || item.status === "Rescheduled"))  && (
//                   <button
//                     onClick={() => onCancelClick && onCancelClick(item.appointmentId)}
//                     className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-red-500 to-rose-500 text-white px-6 py-4 rounded-2xl hover:from-red-600 hover:to-rose-600 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-red-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-semibold"
//                   >
//                     Cancel Appointment
//                   </button>
//                 )}

//                 {!hideProceedPayment && item.status !== "Confirmed" ? (
//                   <button
//                     onClick={() => alert(`Proceeding to payment for appointment ID: ${item.appointmentId}`)}
//                     className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-4 rounded-2xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-indigo-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-semibold"
//                   >
//                     Proceed to Payment
//                   </button>
//                 ) : null}
//               </div>
//             </div>
//           </div>
//         )
//       })}
//     </div>
//   )
// }

// import { User, CalendarIcon, ClockIcon, FileText, Video, AlertCircle, Hash } from "lucide-react";
// import { useNavigate} from "react-router-dom";
// import { useState, useEffect } from "react";
// import { initiatePayment } from "../../Doctor/services/PaymentService";
// import { fetchConsultationFeeByDoctorId } from "../../Admin/services/patientApi";

// export const AppointmentList = ({
//   appointments = [],
//   error = "",
//   searchQuery = "",
//   onViewConsultation = null,
//   showJoinCall = false,
//   onRescheduleClick,
//   onCancelClick,
//   hideProceedPayment = false,
// }) => {
//   const [consultationFees, setConsultationFees] = useState();
//   const navigate = useNavigate();

//   useEffect(() => {
//   const fetchAllFees = async () => {
//     const fees = {};
//     for (const item of appointments) {
//       try {

//         const fee = await fetchConsultationFeeByDoctorId(item.doctorId);
//         fees[item.appointmentId] = fee;
//       } catch (err) {
//         fees[item.appointmentId] = 0;
//         console.error("Failed to fetch fee for", item.doctorId, err);
//       }
//     }
//     setConsultationFees(fees); // ✅ Set once after collecting all fees
//   };

//   if (appointments.length > 0) {
//     fetchAllFees();
//   }
// }, [appointments]);

//   if (error) {
//     return (
//       <div className="bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-2xl p-6 shadow-lg">
//         <div className="flex items-center">
//           <div className="flex-shrink-0">
//             <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center shadow-md">
//               <AlertCircle className="h-6 w-6 text-white" />
//             </div>
//           </div>
//           <div className="ml-4">
//             <h3 className="text-lg font-semibold text-red-800">Error</h3>
//             <p className="text-sm text-red-700 mt-1">{error}</p>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (appointments.length === 0) {
//     return (
//       <div className="text-center py-16 bg-gradient-to-br from-teal-50 via-teal-100 to-cyan-50 rounded-3xl border-2 border-teal-200 shadow-xl">
//         <div className="w-20 h-20 mx-auto bg-gradient-to-br from-teal-400 to-teal-500 rounded-full flex items-center justify-center shadow-lg mb-6">
//           <CalendarIcon className="h-10 w-10 text-white" />
//         </div>
//         <h3 className="text-2xl font-bold text-teal-900 mb-3">No appointments found</h3>
//         <p className="text-base text-teal-700 max-w-md mx-auto leading-relaxed">
//           {searchQuery ? "No results match your search criteria. Try adjusting your filters." : "You don't have any appointments in this category yet."}
//         </p>
//       </div>
//     );
//   }

//   return (
//     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//       {appointments.map((item, index) => {
//         console.log("item",item);
//         const doctorId = item.doctorId;
//         // const consultationFee = fetchConsultationFeeByDoctorId(doctorId);
//         const appointmentDate = new Date(item.appointmentDate);
//         const isToday = new Date().toDateString() === appointmentDate.toDateString();

//         let statusColor = "bg-slate-100 text-slate-700 border-slate-200";
//         if (item.status === "Completed") statusColor = "bg-gradient-to-r from-teal-100 to-emerald-100 text-teal-800 border-teal-200";
//         if (item.status === "Cancelled") statusColor = "bg-gradient-to-r from-red-100 to-rose-100 text-red-800 border-red-200";
//         if (item.status === "Confirmed") statusColor = "bg-gradient-to-r from-teal-100 to-cyan-100 text-teal-800 border-teal-200";
//         if (item.status === "Pending") statusColor = "bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-800 border-amber-200";

//         return (
//           <div
//             key={index}
//             className="bg-white rounded-3xl shadow-xl border-2 border-teal-100 overflow-hidden hover:shadow-2xl hover:border-teal-200 transition-all duration-500 transform hover:-translate-y-1"
//           >
//             <div className="p-6 bg-gradient-to-br from-teal-50 via-teal-100 to-cyan-50 border-b-2 border-teal-200">
//               <div className="flex justify-between items-center mb-4">
//                 <div className="flex items-center">
//                   <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center text-white shadow-lg">
//                     <User className="w-8 h-8" />
//                   </div>
//                   <div className="ml-4">
//                     <h3 className="text-lg font-bold text-teal-900">{item.doctorName || "N/A"}</h3>
//                     <p className="text-sm text-teal-600 font-medium">Medical Doctor</p>
//                   </div>
//                 </div>
//                 <span className={`px-4 py-2 rounded-2xl text-sm font-bold border-2 shadow-md ${statusColor}`}>
//                   {item.status}
//                 </span>
//               </div>
//             </div>

//             <div className="p-6 space-y-4">
//               <div className="flex items-start p-3 bg-teal-50 rounded-2xl border border-teal-100">
//                 <div className="w-10 h-10 bg-teal-500 rounded-xl flex items-center justify-center mr-4 shadow-md">
//                   <Hash className="w-5 h-5 text-white" />
//                 </div>
//                 <div>
//                   <p className="text-xs text-teal-600 font-medium uppercase tracking-wide">Appointment ID</p>
//                   <p className="text-sm text-teal-900 font-bold">{item.appointmentId}</p>
//                 </div>
//               </div>

//               <div className="flex items-start p-3 bg-gradient-to-r from-teal-50 to-cyan-50 rounded-2xl border border-teal-100">
//                 <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-xl flex items-center justify-center mr-4 shadow-md">
//                   <CalendarIcon className="w-5 h-5 text-white" />
//                 </div>
//                 <div>
//                   <p className="text-xs text-teal-600 font-medium uppercase tracking-wide">Date</p>
//                   <p className="text-sm text-teal-900 font-bold">
//                     {appointmentDate.toLocaleDateString("en-US", {
//                       weekday: "long",
//                       year: "numeric",
//                       month: "long",
//                       day: "numeric",
//                     })}
//                   </p>
//                   {isToday && (
//                     <span className="inline-block mt-1 px-2 py-1 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs font-bold rounded-full shadow-md">
//                       Today
//                     </span>
//                   )}
//                 </div>
//               </div>

//               <div className="flex items-start p-3 bg-gradient-to-r from-cyan-50 to-teal-50 rounded-2xl border border-teal-100">
//                 <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-teal-500 rounded-xl flex items-center justify-center mr-4 shadow-md">
//                   <ClockIcon className="w-5 h-5 text-white" />
//                 </div>
//                 <div>
//                   <p className="text-xs text-teal-600 font-medium uppercase tracking-wide">Time</p>
//                   <p className="text-sm text-teal-900 font-bold">
//                     {item.startTime} - {item.endTime}
//                   </p>
//                 </div>
//               </div>

//               <div className="space-y-3 pt-2">
//                 {onViewConsultation && (
//                   <button
//                     onClick={() => onViewConsultation(item.appointmentId, item)}
//                     className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-teal-600 to-teal-700 text-white px-6 py-4 rounded-2xl hover:from-teal-700 hover:to-teal-800 transition-all duration-300 font-semibold"
//                   >
//                     <FileText className="w-5 h-5" />
//                     View Consultation
//                   </button>
//                 )}

//                 {showJoinCall && (
//                   <button
//                     onClick={() => {
//                       const email = localStorage.getItem("email");
//                       const room = item.appointmentId;
//                       navigate(`/lobby?email=${encodeURIComponent(email)}&room=${room}`);
//                     }}
//                     className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white px-6 py-4 rounded-2xl hover:from-emerald-700 hover:to-emerald-800 transition-all duration-300 font-semibold"
//                   >
//                     <Video className="w-5 h-5" />
//                     Join Call
//                   </button>
//                 )}

//                 {(item.status === "Pending" || item.status === "Confirmed" || item.status === "Rescheduled") && onRescheduleClick && (
//                   <button
//                     onClick={() => onRescheduleClick(item)}
//                     className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-4 rounded-2xl hover:from-amber-600 hover:to-orange-600 transition-all duration-300 font-semibold"
//                   >
//                     Reschedule
//                   </button>
//                 )}

//                 {(onCancelClick && (item.status === "Pending" || item.status === "Rescheduled")) && (
//                   <button
//                     onClick={() => onCancelClick(item.appointmentId)}
//                     className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-red-500 to-rose-500 text-white px-6 py-4 rounded-2xl hover:from-red-600 hover:to-rose-600 transition-all duration-300 font-semibold"
//                   >
//                     Cancel Appointment
//                   </button>
//                 )}

//                 {!hideProceedPayment && item.status !== "Confirmed" && (
//                   <button
//                     onClick={() => initiatePayment({
//                       amount: consultationFees?.[item.appointmentId] || 0, // example amount
//                       orderId: `APPT-${item.appointmentId}`,
//                       orderName: `Consultation with ${item.doctorName}`,
//                       customerName: localStorage.getItem("name") || "Patient",
//                       customerEmail: localStorage.getItem("email") || "",
//                       customerPhone: localStorage.getItem("phone") || ""
//                     })}
//                     className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-4 rounded-2xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 font-semibold"
//                   >
//                     Proceed to Payment
//                   </button>
//                 )}
//               </div>
//             </div>
//           </div>
//         );
//       })}
//     </div>
//   );
// };

import {
  User,
  CalendarIcon,
  ClockIcon,
  FileText,
  Video,
  AlertCircle,
  Hash,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { initiatePayment } from "../../Doctor/services/PaymentService";
import { fetchConsultationFeeByDoctorId } from "../../Admin/services/patientApi";

export const AppointmentList = ({
  appointments = [],
  error = "",
  searchQuery = "",
  onViewConsultation = null,
  showJoinCall = false,
  onRescheduleClick,
  onCancelClick,
  hideProceedPayment = false,
}) => {
  const [consultationFees, setConsultationFees] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAllFees = async () => {
      const fees = {};
      for (const item of appointments) {
        try {
          const fee = await fetchConsultationFeeByDoctorId(item.doctorId);
          fees[item.appointmentId] = fee;
        } catch (err) {
          fees[item.appointmentId] = 0;
          console.error("❌ Fee fetch error:", err);
        }
      }
      setConsultationFees(fees);
    };

    if (appointments.length > 0) {
      fetchAllFees();
    }
  }, [appointments]);

  if (error) {
    return (
      <div className="bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-2xl p-6 shadow-lg">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center shadow-md">
            <AlertCircle className="h-6 w-6 text-white" />
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-semibold text-red-800">Error</h3>
            <p className="text-sm text-red-700 mt-1">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (appointments.length === 0) {
    return (
      <div className="text-center py-16 bg-gradient-to-br from-teal-50 via-teal-100 to-cyan-50 rounded-3xl border-2 border-teal-200 shadow-xl">
        <div className="w-20 h-20 mx-auto bg-gradient-to-br from-teal-400 to-teal-500 rounded-full flex items-center justify-center shadow-lg mb-6">
          <CalendarIcon className="h-10 w-10 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-teal-900 mb-3">No appointments found</h3>
        <p className="text-base text-teal-700 max-w-md mx-auto leading-relaxed">
          {searchQuery
            ? "No results match your search criteria. Try adjusting your filters."
            : "You don't have any appointments in this category yet."}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {appointments.map((item, index) => {
        const appointmentDate = new Date(item.appointmentDate);
        const isToday = new Date().toDateString() === appointmentDate.toDateString();

        let statusColor = "bg-slate-100 text-slate-700 border-slate-200";
        if (item.status === "Completed")
          statusColor = "bg-gradient-to-r from-teal-100 to-emerald-100 text-teal-800 border-teal-200";
        if (item.status === "Cancelled")
          statusColor = "bg-gradient-to-r from-red-100 to-rose-100 text-red-800 border-red-200";
        if (item.status === "Confirmed")
          statusColor = "bg-gradient-to-r from-teal-100 to-cyan-100 text-teal-800 border-teal-200";
        if (item.status === "Pending")
          statusColor = "bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-800 border-amber-200";

        return (
          <div
            key={index}
            className="bg-white rounded-3xl shadow-xl border-2 border-teal-100 overflow-hidden hover:shadow-2xl hover:border-teal-200 transition-all duration-500 transform hover:-translate-y-1"
          >
            <div className="p-6 bg-gradient-to-br from-teal-50 via-teal-100 to-cyan-50 border-b-2 border-teal-200">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center text-white shadow-lg">
                    <User className="w-8 h-8" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-bold text-teal-900">{item.doctorName || "N/A"}</h3>
                    <p className="text-sm text-teal-600 font-medium">Medical Doctor</p>
                  </div>
                </div>
                <span className={`px-4 py-2 rounded-2xl text-sm font-bold border-2 shadow-md ${statusColor}`}>
                  {item.status}
                </span>
              </div>
            </div>

            <div className="p-6 space-y-4">
              {/* Appointment ID */}
              <div className="flex items-start p-3 bg-teal-50 rounded-2xl border border-teal-100">
                <div className="w-10 h-10 bg-teal-500 rounded-xl flex items-center justify-center mr-4 shadow-md">
                  <Hash className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-xs text-teal-600 font-medium uppercase tracking-wide">Appointment ID</p>
                  <p className="text-sm text-teal-900 font-bold">{item.appointmentId}</p>
                </div>
              </div>

              {/* Date */}
              <div className="flex items-start p-3 bg-gradient-to-r from-teal-50 to-cyan-50 rounded-2xl border border-teal-100">
                <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-xl flex items-center justify-center mr-4 shadow-md">
                  <CalendarIcon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-xs text-teal-600 font-medium uppercase tracking-wide">Date</p>
                  <p className="text-sm text-teal-900 font-bold">
                    {appointmentDate.toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                  {isToday && (
                    <span className="inline-block mt-1 px-2 py-1 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs font-bold rounded-full shadow-md">
                      Today
                    </span>
                  )}
                </div>
              </div>

              {/* Time */}
              <div className="flex items-start p-3 bg-gradient-to-r from-cyan-50 to-teal-50 rounded-2xl border border-teal-100">
                <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-teal-500 rounded-xl flex items-center justify-center mr-4 shadow-md">
                  <ClockIcon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-xs text-teal-600 font-medium uppercase tracking-wide">Time</p>
                  <p className="text-sm text-teal-900 font-bold">
                    {item.startTime} - {item.endTime}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-2">
                {onViewConsultation && (
                  <button
                    onClick={() => onViewConsultation(item.appointmentId, item)}
                    className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-teal-600 to-teal-700 text-white px-6 py-4 rounded-2xl font-semibold"
                  >
                    <FileText className="w-5 h-5" />
                    View Consultation
                  </button>
                )}

                {showJoinCall && (
                  <button
                    onClick={() => {
                      const email = localStorage.getItem("email");
                      const room = item.appointmentId;
                      navigate(`/lobby?email=${encodeURIComponent(email)}&room=${room}`);
                    }}
                    className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white px-6 py-4 rounded-2xl font-semibold"
                  >
                    <Video className="w-5 h-5" />
                    Join Call
                  </button>
                )}

                {(item.status === "Pending" || item.status === "Confirmed" || item.status === "Rescheduled") &&
                  onRescheduleClick && (
                    <button
                      onClick={() => onRescheduleClick(item)}
                      className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-4 rounded-2xl font-semibold"
                    >
                      Reschedule
                    </button>
                  )}

                {(onCancelClick && (item.status === "Pending" || item.status === "Rescheduled")) && (
                  <button
                    onClick={() => onCancelClick(item.appointmentId)}
                    className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-red-500 to-rose-500 text-white px-6 py-4 rounded-2xl font-semibold"
                  >
                    Cancel Appointment
                  </button>
                )}

                {!hideProceedPayment && item.status !== "Confirmed" && (
                  <button
                    onClick={() => {
                      localStorage.setItem("appointmentId", item.appointmentId); // ✅ Save selected ID
                      initiatePayment({
                        amount: consultationFees?.[item.appointmentId] || 0,
                        orderId: `APPT-${item.appointmentId}`,
                        orderName: `Consultation with ${item.doctorName}`,
                        customerName: localStorage.getItem("name") || "Patient",
                        customerEmail: localStorage.getItem("email") || "",
                        customerPhone: localStorage.getItem("phone") || "",
                      });
                    }}
                    className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-4 rounded-2xl font-semibold"
                  >
                    Proceed to Payment
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};