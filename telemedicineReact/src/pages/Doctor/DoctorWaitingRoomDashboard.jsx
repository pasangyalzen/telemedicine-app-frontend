import { Link } from "react-router-dom";
import useDoctorDashboard from "../../hooks/useDoctorDashboard";
import PatientQueue from "./ui/PatientQueue";
import { useNavigate } from 'react-router-dom';
import { PATHS } from "../../constants/path";


export default function DoctorWaitingRoomDashboard() {
  const { patients, inviteLink, dropdownOpen, toggleDropdown } = useDoctorDashboard();
  const navigate = useNavigate();
  const handleLogout = () => {
    // Clear the localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userId");
    localStorage.removeItem("role");
    localStorage.removeItem("id");
  
    console.log("Logging out... Redirecting to login page.");
  
    // Navigate to the login page
    navigate("/login");  // This should work if PATHS.LOGIN is defined correctly
  };

  return (
    <div className="flex h-screen w-screen">
      {/* Sidebar (Left) */}
      <aside className="w-64 bg-black text-primary-light flex flex-col justify-between h-full">
        <div>
          <h2 className="text-2xl font-light p-4 border-b text-[#65cccc] border-white">TELECHAUKI</h2>

          {/* Patient Queue Component */}
          <PatientQueue patients={patients} />

          {/* General Navigation */}
          <div className="p-4 border-t border-white">
            <h3 className="text-lg font-light mb-2 text-[#65cccc]">General</h3>
            <nav className="space-y-2">
              <Link to="/doctor-waiting-room-dashboard" className="block p-2 text-gray-400 font-extralight rounded hover:text-white">
                Dashboard
              </Link>
              <Link to="/analytics" className="block p-2 text-gray-400 font-extralight rounded hover:text-white">
                Analytics
              </Link>
              <Link to="/meeting-history" className="block p-2 text-gray-400 font-extralight rounded hover:text-white">
                Meeting History
              </Link>
            </nav>
          </div>
        </div>

        {/* My Account (Bottom) */}
        {/* My Account (Bottom) */}
        <div className="p-4 border-t border-gray-700">
          <Link
            to="#"
            onClick={handleLogout} // Add the logout handler
            className="block p-2 rounded text-gray-500 hover:text-white"
          >
            Logout
          </Link>
        </div>
      </aside>

      {/* Main Content (Middle Section) */}
      <div className="flex-1 flex flex-col p-6 bg-gray-100">
        {/* Top Row - Welcome & Invite Section */}
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-2xl font-bold">Welcome to the Waiting Room</h2>
          <p className="text-gray-600 text-sm mt-2">To invite someone, share this link:</p>

          {/* Invite Link Box */}
          <div className="flex items-center mt-3 bg-gray-100 p-2 rounded">
            <input
              type="text"
              value={inviteLink}
              readOnly
              className="flex-1 bg-transparent text-gray-500 text-sm outline-none"
            />
            <button
              className="px-3 py-1 bg-[#65cccc] text-white rounded-md ml-2 hover:bg-[#45cccc]"
              onClick={() => navigator.clipboard.writeText(inviteLink)}
            >
              Copy
            </button>

            {/* Invite Via Button & Dropdown */}
            <div className="relative">
              <button
                className="px-3 py-1 bg-white text-[#65cccc] rounded-md ml-2 hover:bg-[#65cccc] hover:text-white"
                onClick={toggleDropdown}
              >
                Invite Via
              </button>

              {dropdownOpen && (
                <div className="absolute left-0 mt-2 w-40 bg-white text-gray-500 shadow-md rounded-md">
                  <button className="block w-full px-4 py-2 text-left hover:text-[#65cccc]">Text Message</button>
                  <button className="block w-full px-4 py-2 text-left hover:text-[#65cccc]">Email</button>
                  <button className="block w-full px-4 py-2 text-left hover:text-[#65cccc]">Calendar</button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Row - 4 Columns */}
        <div className="grid grid-cols-4 gap-4 text-sm font-light">
          {["Edit Waiting Room", "Account Settings", "Suggest Improvement", "Telehealth Shop"].map((item, index) => (
            <div key={index} className="bg-[#49cccc] p-4 text-gray-200 rounded-lg shadow text-center hover:bg-[#49cccc] hover:text-white cursor-pointer">
              <h3 className="font-semibold">{item}</h3>
            </div>
          ))}
        </div>
      </div>

      {/* Rightmost Video Section */}
      <div className="w-1/3 bg-white shadow-lg flex flex-col p-6 h-full">
        {/* Video Placeholder */}
        <div className="flex-grow w-full bg-black flex items-center justify-center text-white">
          Video Here
        </div>

        {/* Precall Test Button */}
        <button className="w-full mt-auto px-6 py-3 bg-[#65cccc] text-white rounded-md hover:bg-[#45cccc]">
          Precall Test
        </button>
      </div>
    </div>
  );
}