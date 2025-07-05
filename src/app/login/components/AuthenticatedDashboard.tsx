"use client";

interface AuthenticatedDashboardProps {
  userEmail: string;
  onGoToMain: () => void;
  onSignOut: () => void;
}

export default function AuthenticatedDashboard({
  userEmail,
  onGoToMain,
  onSignOut,
}: AuthenticatedDashboardProps) {
  return (
    <div className="space-y-6">
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-green-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-green-800">Signed in as</p>
            <p className="text-sm text-green-700">{userEmail}</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <button
          onClick={onGoToMain}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 ease-in-out transform hover:scale-105 shadow-lg"
        >
          Go to Resume Editor
        </button>

        <button
          onClick={onSignOut}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 ease-in-out transform hover:scale-105 shadow-lg"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}
