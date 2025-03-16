// import { Bell, ChevronDown, Settings, LogOut } from "lucide-react";
// import { useState } from "react";
// import { useNavigate } from "react-router-dom";

// const Header = ({ selectedMenu, setDropdownOpen, dropdownOpen, handleLogoutClick }) => {
//   const navigate = useNavigate();

//   return (
//     <div className="bg-primary-dark text-[#65cccc] p-4 flex justify-between items-center border-b border-gray-700">
//       <h1 className="text-2xl font-bold uppercase">{selectedMenu}</h1>

//       <div className="flex items-center space-x-4">
//         {/* Notification */}
//         <div className="relative">
//           <Bell className="w-6 h-6 text-[#65cccc] hover:text-white cursor-pointer" />
//           <span className="absolute top-0 right-0 bg-red-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">3</span>
//         </div>

//         {/* Admin Dropdown */}
//         <div className="relative">
//           <button onClick={() => setDropdownOpen(!dropdownOpen)} className="flex bg-primary items-center space-x-2 text-[#65cccc] hover:text-white">
//             <span>Admin</span>
//             <ChevronDown className="w-4 h-4" />
//           </button>

//           {dropdownOpen && (
//             <div className="absolute right-0 mt-2 w-40 rounded-lg shadow-lg">
//               <button onClick={() => navigate("/admin/settings")} className="block w-full px-4 py-2 text-left hover:bg-primary-light hover:text-white">
//                 <Settings className="w-5 h-5 inline mr-2" />
//                 Settings
//               </button>

//               <button onClick={handleLogoutClick} className="block w-full px-4 py-2 text-left hover:bg-primary-light hover:text-white">
//                 <LogOut className="w-5 h-5 inline mr-2" />
//                 Logout
//               </button>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Header;