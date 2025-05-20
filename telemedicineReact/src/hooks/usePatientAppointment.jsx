// // src/hooks/usePatientData.ts
// import { useEffect, useState } from "react";
// import {
//   fetchTodaysAppointments,
//   fetchUpcomingAppointments,
//   fetchPastAppointments,
//   fetchPrescriptions,
// } from "../api/patientApi";

// export const usePatientData = (patientId: string) => {
//   const [loading, setLoading] = useState(true);
//   const [today, setToday] = useState([]);
//   const [upcoming, setUpcoming] = useState([]);
//   const [past, setPast] = useState([]);
//   const [prescriptions, setPrescriptions] = useState([]);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchAll = async () => {
//       try {
//         setLoading(true);
//         const [todayRes, upcomingRes, pastRes, prescriptionRes] = await Promise.all([
//           fetchTodaysAppointments(patientId),
//           fetchUpcomingAppointments(patientId),
//           fetchPastAppointments(patientId),
//           fetchPrescriptions(patientId),
//         ]);
//         setToday(todayRes);
//         setUpcoming(upcomingRes);
//         setPast(pastRes);
//         setPrescriptions(prescriptionRes);
//       } catch (err: any) {
//         setError(err.message || "Failed to fetch data.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchAll();
//   }, [patientId]);

//   return { loading, today, upcoming, past, prescriptions, error };
// };