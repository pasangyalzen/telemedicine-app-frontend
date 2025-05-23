import { Pill, Activity, Download, AlertCircle, Hash, CalendarIcon, User } from "lucide-react"
import { jsPDF } from "jspdf"

export const PrescriptionList = ({ prescriptions = [], error = "" }) => {
  const generatePDF = (prescription) => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Prescription Report", 14, 22);

    doc.setFontSize(12);
    doc.text(`Doctor: Dr. ${prescription.doctorName || "N/A"}`, 14, 40);
    doc.text(
      `Date: ${new Date(prescription.prescribedAt).toLocaleDateString()}`,
      14,
      48
    );
    doc.text(`Appointment ID: ${prescription.appointmentId}`, 14, 56);

    doc.setFontSize(14);
    doc.text("Prescription Items:", 14, 70);
    doc.setFontSize(12);

    let y = 78;
    prescription.prescriptionItems.forEach((item, index) => {
      doc.text(`${index + 1}. ${item.medicineName}`, 14, y);
      y += 6;
      doc.text(`   Dosage: ${item.dosage}`, 16, y);
      y += 6;
      doc.text(`   Frequency: ${item.frequency}`, 16, y);
      y += 6;
      doc.text(`   Duration: ${item.duration}`, 16, y);
      if (item.notes) {
        y += 6;
        const notesLines = doc.splitTextToSize(`   Notes: ${item.notes}`, 180);
        doc.text(notesLines, 16, y);
        y += notesLines.length * 6;
      } else {
        y += 6;
      }
      y += 4;
    });

    doc.save(`prescription-${prescription.appointmentId}.pdf`);
  };

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
        <div className="flex">
          <AlertCircle className="h-5 w-5 text-red-500" />
          <div className="ml-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (prescriptions.length === 0) {
    return (
      <div className="text-center py-12 bg-teal-50 rounded-xl border border-teal-100">
        <Pill className="mx-auto h-12 w-12 text-teal-400" />
        <h3 className="mt-2 text-lg font-medium text-teal-900">No prescriptions found</h3>
        <p className="mt-1 text-sm text-teal-600">You don't have any prescriptions at this time.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {prescriptions.map((prescription, index) => (
        <div key={index} className="bg-white rounded-2xl shadow-md border border-teal-100 overflow-hidden">
          <div className="p-5 border-b border-teal-100 bg-gradient-to-r from-teal-100 to-teal-50 space-y-1">
            <div className="flex items-center gap-3 text-teal-800">
              <Hash className="w-4 h-4" />
              <span className="font-medium">Appointment ID:</span>
              <span>{prescription.appointmentId}</span>
            </div>
            <div className="flex items-center gap-3 text-teal-800">
              <User className="w-4 h-4" />
              <span className="font-medium">Doctor:</span>
              <span>{prescription.doctorName || "N/A"}</span>
            </div>
            <div className="flex items-center gap-3 text-teal-800">
              <CalendarIcon className="w-4 h-4" />
              <span className="font-medium">Date:</span>
              <span>
                {new Date(prescription.prescribedAt).toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
          </div>

          <div className="p-5">
            <h4 className="font-semibold text-teal-900 text-lg mb-4 flex items-center">
              <Activity className="w-5 h-5 mr-2 text-teal-700" />
              Prescription Items
            </h4>

            <div className="space-y-4">
              {prescription.prescriptionItems.map((item, idx) => (
                <div key={idx} className="bg-teal-50 p-5 rounded-xl border border-teal-100 shadow-sm">
                  <h5 className="font-semibold text-teal-900 text-base">{item.medicineName}</h5>
                  <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center">
                      <span className="text-teal-600 mr-2">Dosage:</span>
                      <span className="font-medium text-teal-900">{item.dosage}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-teal-600 mr-2">Frequency:</span>
                      <span className="font-medium text-teal-900">{item.frequency}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-teal-600 mr-2">Duration:</span>
                      <span className="font-medium text-teal-900">{item.duration}</span>
                    </div>
                  </div>

                  {item.notes && (
                    <div className="mt-3 pt-3 border-t border-teal-200">
                      <p className="text-sm text-teal-700">
                        <span className="font-medium text-teal-900">Notes:</span> {item.notes}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <button
              onClick={() => generatePDF(prescription)}
              className="mt-5 flex items-center justify-center gap-2 w-full bg-teal-600 text-white px-4 py-3 rounded-xl hover:bg-teal-700 transition-colors duration-300 shadow-md"
            >
              <Download className="w-4 h-4" />
              Download Prescription
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};