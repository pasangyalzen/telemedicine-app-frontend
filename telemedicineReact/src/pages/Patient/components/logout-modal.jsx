import { LogOut, AlertTriangle } from 'lucide-react'

export const LogoutModal = ({ onConfirm, onCancel, isOpen = true }) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 animate-fadeIn backdrop-blur-sm">
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-scaleIn border border-gray-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-4">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-red-400/30 flex items-center justify-center mr-3">
              <AlertTriangle className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Confirm Logout</h2>
              <p className="text-red-100 text-sm mt-1">You're about to sign out</p>
            </div>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-6">
          <div className="flex items-start space-x-3">
            <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0">
              <LogOut className="w-6 h-6 text-red-500" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Are you sure you want to logout?</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                You will be signed out of your account and redirected to the login page. Any unsaved changes may be
                lost.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex justify-end gap-3">
            <button
              onClick={onCancel}
              className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200 transition-all duration-200 font-medium"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-5 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-200 font-medium shadow-md flex items-center"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* CSS for animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        .animate-scaleIn {
          animation: scaleIn 0.2s ease-out;
        }
      `}</style>
    </div>
  )
}