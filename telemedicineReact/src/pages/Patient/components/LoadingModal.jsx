export const LogoutModal = ({ onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 bg-white bg-opacity-50 flex justify-center items-center z-50 animate-fadeIn">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-scaleIn">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Confirm Logout</h2>
          <p className="text-gray-600">Are you sure you want to logout from your account?</p>

          <div className="mt-6 flex justify-end gap-3">
            <button
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
