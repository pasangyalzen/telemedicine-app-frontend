export const LoadingSpinner = ({ message = "Loading..." }) => {
  return (
    <div className="flex flex-col items-center justify-center h-64">
      <div className="w-16 h-16 border-t-4 border-b-4 border-teal-600 rounded-full animate-spin mb-4"></div>
      <p className="text-teal-700 font-medium">{message}</p>
    </div>
  )
}
