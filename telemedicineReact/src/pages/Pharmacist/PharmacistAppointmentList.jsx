export const PharmacistAppointmentList = ({ appointments }) => {
  if (!Array.isArray(appointments) || appointments.length === 0) {
    return <p>No appointments available.</p>;
  }

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">Appointments</h3>
      <ul className="space-y-4">
        {appointments.map((appt) => (
          <li key={appt.id} className="bg-white p-4 rounded-lg shadow">
            <p>Patient: {appt.patientName}</p>
            <p>Date: {appt.date}</p>
            <p>Status: {appt.status}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};