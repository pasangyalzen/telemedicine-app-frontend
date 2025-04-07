export default function DoctorMeetingHistory() {
    return (
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h2 className="text-2xl font-bold mb-4">Meeting History</h2>
        <p className="text-gray-600 text-sm">You can list past meetings with patients here, including date, time, and notes.</p>
  
        {/* Placeholder list */}
        <ul className="mt-4 space-y-3">
          <li className="bg-gray-100 p-3 rounded text-sm text-gray-700">🗓️ 2025-04-01 | John Doe | 10:00 AM - 10:30 AM</li>
          <li className="bg-gray-100 p-3 rounded text-sm text-gray-700">🗓️ 2025-04-02 | Jane Smith | 11:00 AM - 11:45 AM</li>
        </ul>
      </div>
    );
  }