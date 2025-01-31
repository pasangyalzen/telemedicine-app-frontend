import { useState } from "react";
import { Link } from "react-router-dom";

export default function DoctorWaitingRoomDashboard() {
  // Sample patient queue data (replace with real data)
  const [patients] = useState(["John Doe", "Jane Smith", "Emily Johnson", "Michael Brown"]);

  // Invite link (replace with actual logic)
  const inviteLink = "https://telemedicineapp.com/invite/12345";

  // Dropdown state
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <div className="flex h-screen w-screen">
      {/* Sidebar (Left) */}
      <aside className="w-64 bg-black text-primary-light flex flex-col justify-between h-full">
        <div>
          <h2 className="text-2xl font-light p-4 border-b text-[#65cccc] border-white">TELECHAUKI</h2>

          {/* Patient Queue */}
          <div className="p-4">
            <h3 className="text-lg font-light text-[#65cccc] mb-2">Patient Queue</h3>
            <ul className="space-y-2">
              {patients.length > 0 ? (
                patients.map((patient, index) => (
                  <li key={index} className="text-gray-600 font-montserrat font-medium p-2 rounded hover:text-white">
                    {patient}
                  </li>
                ))
              ) : (
                <li className="text-gray-400">No patients waiting</li>
              )}
            </ul>
          </div>

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
        <div className="p-4 border-t border-gray-700">
          <Link to="/my-account" className="block p-2 rounded text-gray-500 hover:text-white">
            My Account
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
                onClick={() => setDropdownOpen(!dropdownOpen)}
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
            <div key={index} className="bg-white p-4 rounded-lg shadow text-center hover:bg-gray-200 cursor-pointer">
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
