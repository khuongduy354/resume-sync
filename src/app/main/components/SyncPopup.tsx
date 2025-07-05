interface SyncPopupProps {
  isVisible: boolean;
  message: string;
  type: "syncing" | "success" | "error";
}

export default function SyncPopup({
  isVisible,
  message,
  type,
}: SyncPopupProps) {
  if (!isVisible) return null;

  const bgColor = {
    syncing: "bg-blue-500",
    success: "bg-green-500",
    error: "bg-red-500",
  }[type];

  const icon = {
    syncing: (
      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
    ),
    success: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
          clipRule="evenodd"
        />
      </svg>
    ),
    error: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
          clipRule="evenodd"
        />
      </svg>
    ),
  }[type];

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-2 duration-300">
      <div
        className={`${bgColor} text-white px-4 py-3 rounded-lg shadow-lg flex items-center space-x-3`}
      >
        {icon}
        <span className="text-sm font-medium">{message}</span>
      </div>
    </div>
  );
}
