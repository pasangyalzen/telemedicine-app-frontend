// import BackGroundVideo from '../assets/LandingPageVideo.mp4'
// import { useNavigate } from 'react-router-dom';
// import { PATHS } from '../constants/path';

// export default function Homeinfo() {
//   const navigate = useNavigate();
//   return (
//     <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
//       {/* Left Column - Text Content */}
//       <div className="space-y-8 flex flex-col justify-center text-center">
//         <div className="space-y-4">
//           <h1 className="text-white text-5xl lg:text-6xl font-light leading-tight">
//             The world's
//             <br />
//             most loved
//             <br />
//             <span className="relative inline-block">
//               telemedicine
//               <div className="absolute -inset-1 "></div>
//             </span>
//             <br />
//             solution
//           </h1>
//         </div>

//         <p className="text-white/90 text-xl">
//           Experience why more than 1 million providers trust us already.
//         </p>

//         <div className="flex flex-wrap gap-4 justify-center">
//           {/* Get Started for Free Button with Arrow */}
//           <button 
//             onClick={() => navigate(PATHS.REGISTER)}
//             className="font-sans font-semibold px-6 py-3 bg-[#7FD1C7] text-[#012f33] rounded-md hover:bg-opacity-90 transition-colors relative group">
//             <span className="transition-all duration-300 group-hover:mr-3">Get started for free</span>
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               fill="none"
//               viewBox="0 0 24 24"
//               stroke-width="4"
//               stroke="currentColor"
//               className="w-5 h-5 absolute right-0 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300"
//             >
//               <path
//                 stroke-linecap="round"
//                 stroke-linejoin="round"
//                 d="m8.25 4.5 7.5 7.5-7.5 7.5"
//               />
//             </svg>
//           </button>

//           {/* Schedule a Clinic Demo Button with Arrow */}
//           <button className="font-sans font-semibold px-6 py-3 border border-[#7FD1C7] bg-primary-light text-[#7FD1C7] rounded-md hover:bg-[#7FD1C7] hover:text-primary-dark transition-colors relative group">
//             <span className="transition-all duration-300 group-hover:mr-3">Schedule a Clinic demo</span>
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               fill="none"
//               viewBox="0 0 24 24"
//               stroke-width="4"
//               stroke="currentColor"
//               className="w-5 h-5 absolute right-0 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300"
//             >
//               <path
//                 stroke-linecap="round"
//                 stroke-linejoin="round"
//                 d="m8.25 4.5 7.5 7.5-7.5 7.5"
//               />
//             </svg>
//           </button>
//         </div>
//       </div>

//       {/* Right Column - Image Placeholder */}
//       <div className="bg-white/10 rounded-2xl h-[600px] w-full overflow-hidden relative">
//         <video
//           className="absolute inset-0 w-full h-full object-cover"
//           src={BackGroundVideo}
//           autoPlay
//           loop
//           muted
//         ></video>
//       </div>
//     </div>
//   );
// }
