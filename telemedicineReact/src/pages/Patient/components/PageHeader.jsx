// PageHeader.jsx
import { Calendar } from "lucide-react";

export const PageHeader = ({ title, activeTab, onBookAppointment }) => {
  return (
    <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
      <div>
        <h2 className="text-2xl font-bold text-teal-900">{title}</h2>
        <p className="text-sm text-teal-600 mt-2">
          {activeTab === "today" && "Your appointments scheduled for today"}
          {activeTab === "upcoming" && "Your upcoming appointments"}
          {activeTab === "past" && "Your past appointment history"}
          {activeTab === "prescriptions" && "Your prescribed medications"}
        </p>
      </div>

      {activeTab !== "prescriptions" && (
        <button
          onClick={onBookAppointment}
          className="mt-4 md:mt-0 inline-flex items-center px-5 py-3 border border-transparent text-sm font-medium rounded-xl shadow-md text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all duration-300"
        >
          <Calendar className="w-5 h-5 mr-2" />
          Book New Appointment
        </button>
      )}
    </div>
  );
};