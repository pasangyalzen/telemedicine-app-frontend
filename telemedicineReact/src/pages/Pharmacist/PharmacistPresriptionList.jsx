export const PharmacistPrescriptionList = ({ prescriptions }) => {
  if (!Array.isArray(prescriptions) || prescriptions.length === 0) {
    return <p>No prescriptions found.</p>;
  }

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">Prescriptions</h3>
      <ul className="space-y-4">
        {prescriptions.map((rx) => (
          <li key={rx.id} className="bg-white p-4 rounded-lg shadow">
            <p>Patient: {rx.patientName}</p>
            <p>Doctor: {rx.doctorName}</p>
            <p>Medications: {rx.medications.join(", ")}</p>
            <p>Date Issued: {rx.dateIssued}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};