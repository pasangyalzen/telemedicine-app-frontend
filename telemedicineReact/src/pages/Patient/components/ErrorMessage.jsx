import { AlertCircle } from "lucide-react"

export const ErrorMessage = ({ message, onRetry }) => {
  return (
    <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
      <div className="flex">
        <div className="flex-shrink-0">
          <AlertCircle className="h-5 w-5 text-red-500" />
        </div>
        <div className="ml-3">
          <p className="text-sm text-red-700">{message}</p>
          {onRetry && (
            <button onClick={onRetry} className="mt-2 text-sm font-medium text-red-700 hover:text-red-600">
              Try again
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
