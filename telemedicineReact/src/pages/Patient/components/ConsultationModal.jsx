import { X, FileText, CheckCircle, AlertCircle, Calendar, Download } from "lucide-react"
import { jsPDF } from "jspdf"

export const ConsultationModal = ({ consultationData, consultationLoading, selectedAppointment, onClose }) => {
  console.log("Report", selectedAppointment);
  // Function to generate PDF report
  const generatePDF = () => {
    if (!consultationData) return;

    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Consultation Report", 14, 22);

    doc.setFontSize(12);
    doc.text(`Doctor: Dr. ${selectedAppointment?.doctorName || "Unknown"}`, 14, 40);

    const appointmentDateStr = selectedAppointment?.appointmentDate
      ? new Date(selectedAppointment.appointmentDate).toLocaleDateString()
      : "N/A";
    doc.text(`Date: ${appointmentDateStr}`, 14, 50);

    // Add Patient Name and Appointment ID here
    doc.text(`Patient: ${selectedAppointment?.patientName || "N/A"}`, 14, 60);
    doc.text(`Appointment ID: ${selectedAppointment?.appointmentId || "N/A"}`, 14, 70);

    doc.setFontSize(14);
    doc.text("Doctor's Notes:", 14, 85);
    doc.setFontSize(12);

    const notes = consultationData.notes || "No notes provided";
    const notesLines = doc.splitTextToSize(notes, 180);
    doc.text(notesLines, 14, 95);

    let yPosition = 95 + notesLines.length * 7 + 10; // adjust y-position based on notes length

    doc.setFontSize(14);
    doc.text("Recommendations:", 14, yPosition);
    doc.setFontSize(12);

    const recommendations = consultationData.recommendations || "No recommendations provided";
    const recLines = doc.splitTextToSize(recommendations, 180);
    doc.text(recLines, 14, yPosition + 10);

    yPosition = yPosition + 10 + recLines.length * 7 + 10;

    if (consultationData.createdAt) {
      doc.setFontSize(10);
      const createdOnStr = new Date(consultationData.createdAt).toLocaleDateString();
      doc.text(`Created on: ${createdOnStr}`, 14, yPosition);
    }

    doc.save("consultation-report.pdf");
  };

  return (
    <div
      className="fixed inset-0 bg-teal-900 bg-opacity-50 flex justify-center items-center z-50 p-4 animate-fadeIn backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-scaleIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-teal-800 to-teal-600 text-white px-6 py-5 flex-shrink-0">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold">Consultation Details</h3>
            <button
              onClick={onClose}
              className="text-white hover:bg-teal-700 rounded-full p-1 transition-colors duration-200"
              aria-label="Close modal"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          {selectedAppointment && (
            <p className="text-teal-100 mt-2">
              Dr. {selectedAppointment.doctorName || "Unknown"} -{" "}
              {new Date(selectedAppointment.appointmentDate).toLocaleDateString()}
            </p>
          )}
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto flex-grow">
          {consultationLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-16 h-16 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin mb-4"></div>
              <p className="text-teal-700">Loading consultation details...</p>
            </div>
          ) : consultationData ? (
            consultationData.error ? (
              <div className="flex items-center justify-center py-8 text-red-600">
                <AlertCircle className="w-6 h-6 mr-2" />
                <p>{consultationData.error}</p>
              </div>
            ) : (
              <div className="space-y-8">
                <div className="bg-teal-50 rounded-xl p-5 border border-teal-100 shadow-sm">
                  <h4 className="text-teal-800 font-medium mb-3 flex items-center">
                    <FileText className="w-5 h-5 mr-2 text-teal-600" />
                    Doctor's Notes
                  </h4>
                  <p className="text-gray-700 whitespace-pre-line bg-white p-3 rounded border border-teal-100 min-h-[60px]">
                    {consultationData.notes || "No notes provided"}
                  </p>
                </div>

                <div className="bg-green-50 rounded-lg p-4 border border-green-100">
                  <h4 className="text-green-800 font-medium mb-2 flex items-center">
                    <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
                    Recommendations
                  </h4>
                  <p className="text-gray-700 whitespace-pre-line bg-white p-3 rounded border border-green-100 min-h-[60px]">
                    {consultationData.recommendations || "No recommendations provided"}
                  </p>
                </div>

                {consultationData.createdAt && (
                  <p className="text-sm text-gray-500 flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    Created on: {new Date(consultationData.createdAt).toLocaleDateString()}
                  </p>
                )}
              </div>
            )
          ) : (
            <div className="text-center py-8">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-3" />
              <h4 className="text-lg font-medium text-gray-700">No consultation details available</h4>
              <p className="text-gray-500 mt-1">
                The doctor hasn't uploaded any consultation details for this appointment.
              </p>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="border-t border-gray-200 px-6 py-4 bg-gray-50 flex justify-end flex-shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
          >
            Close
          </button>

          {consultationData && !consultationData.error && (
            <button
              onClick={generatePDF}
              className="ml-3 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 flex items-center"
            >
              <Download className="w-4 h-4 mr-2" />
              Download Report
            </button>
          )}
        </div>
      </div>
    </div>
  )
}