"use client";

interface PendingSync {
  timeoutId: NodeJS.Timeout;
  patchPayload: any;
}

interface HeaderProps {
  pendingSync: PendingSync | undefined;
  resumeContent: any;
  userEmail: string;
  isSigningOut: boolean;
  onSignOut: () => void;
}

export default function Header({
  pendingSync,
  resumeContent,
  userEmail,
  isSigningOut,
  onSignOut,
}: HeaderProps) {
  return (
    <div className="absolute top-0 left-0 right-0 z-10 bg-white shadow-sm border-b border-gray-200">
      <div className="flex justify-between items-center px-6 py-3">
        <div className="flex items-center space-x-4">
          <h1 className="text-lg font-semibold text-gray-800">Resume Sync</h1>
          {/* Sync status indicator */}
          {pendingSync ? (
            <div className="flex items-center space-x-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm border border-blue-200">
              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600"></div>
              <span>Syncing...</span>
            </div>
          ) : (
            resumeContent && (
              <div className="flex items-center space-x-2 px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm border border-green-200">
                <svg
                  className="w-3 h-3"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Synced</span>
              </div>
            )
          )}
        </div>

        <div className="flex items-center space-x-4">
          {userEmail && (
            <span className="text-sm text-gray-600">{userEmail}</span>
          )}
          <button
            onClick={onSignOut}
            disabled={isSigningOut}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition duration-200 ${
              isSigningOut
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-red-600 hover:bg-red-700 text-white hover:shadow-md"
            }`}
          >
            {isSigningOut ? (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                <span>Signing out...</span>
              </div>
            ) : (
              "Sign Out"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
