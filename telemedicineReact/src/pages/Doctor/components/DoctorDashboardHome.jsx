export default function DoctorDashboardHome({ inviteLink, dropdownOpen, toggleDropdown }) {
    return (
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
              <div className="absolute left-0 mt-2 w-40 bg-white text-gray-500 shadow-md rounded-md z-10">
                <button className="block w-full px-4 py-2 text-left hover:text-[#65cccc]">Text Message</button>
                <button className="block w-full px-4 py-2 text-left hover:text-[#65cccc]">Email</button>
                <button className="block w-full px-4 py-2 text-left hover:text-[#65cccc]">Calendar</button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }