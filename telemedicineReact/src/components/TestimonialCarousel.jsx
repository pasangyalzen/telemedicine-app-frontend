// import React, { useState, useEffect } from "react";

// const testimonials = [
//   {
//     name: "Emily Johnson",
//     role: "Patient",
//     photo: "/testimonials/emily.jpg", // Replace with your images path
//     message:
//       "TeleChauki made my healthcare experience effortless and personal. Highly recommend!",
//   },
//   {
//     name: "Dr. Mark Wilson",
//     role: "Doctor",
//     photo: "/testimonials/mark.jpg",
//     message:
//       "The platform streamlined my appointments and helped me deliver better care remotely.",
//   },
//   {
//     name: "Sofia Lee",
//     role: "Pharmacist",
//     photo: "/testimonials/sofia.jpg",
//     message:
//       "Managing prescriptions digitally has never been easier thanks to TeleChauki.",
//   },
// ];

// export default function TestimonialsCarousel() {
//   const [current, setCurrent] = useState(0);

//   useEffect(() => {
//     const intervalId = setInterval(() => {
//       setCurrent((prev) => (prev + 1) % testimonials.length);
//     }, 7000);
//     return () => clearInterval(intervalId);
//   }, []);

//   const { name, role, photo, message } = testimonials[current];

//   return (
//     <section className="bg-teal-50 py-16 px-6 text-center max-w-3xl mx-auto rounded-xl shadow-lg">
//       <h2 className="text-4xl font-bold text-teal-900 mb-8">What Our Users Say</h2>
//       <div className="flex flex-col items-center space-y-6">
//         <img
//           src={photo}
//           alt={name}
//           className="w-24 h-24 rounded-full object-cover border-4 border-teal-300 shadow-md"
//           onError={(e) => {
//             e.currentTarget.onerror = null;
//             e.currentTarget.src = "/default-user.png";
//           }}
//         />
//         <p className="text-teal-700 italic text-lg max-w-xl">{`"${message}"`}</p>
//         <p className="text-teal-900 font-semibold">{name}</p>
//         <p className="text-teal-600 text-sm">{role}</p>

//         {/* Dots */}
//         <div className="flex space-x-3 mt-4">
//           {testimonials.map((_, idx) => (
//             <button
//               key={idx}
//               className={`w-3 h-3 rounded-full ${
//                 idx === current ? "bg-teal-700" : "bg-teal-300"
//               }`}
//               onClick={() => setCurrent(idx)}
//               aria-label={`Show testimonial ${idx + 1}`}
//             />
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// }