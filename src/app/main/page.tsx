"use client";

import Editor from "./components/Editor";
import LivePreview from "./components/LivePreview";
import SyncPopup from "./components/SyncPopup";
import Header from "./components/Header";
import { useAuth } from "./components/useAuth";
import { useSyncManager } from "./components/useSyncManager";

export default function Page() {
  const { userEmail, isSigningOut, resumeContent, setResumeContent, signOut } =
    useAuth();
  const { pendingSync, syncPopup, handlePendingSync } =
    useSyncManager(resumeContent);

  const handleSignOut = async () => {
    await signOut(() => handlePendingSync("logout"));
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sync popup */}
      <SyncPopup
        isVisible={syncPopup.isVisible}
        message={syncPopup.message}
        type={syncPopup.type}
      />

      {/* Header with user info and logout */}
      <Header
        pendingSync={pendingSync}
        resumeContent={resumeContent}
        userEmail={userEmail}
        isSigningOut={isSigningOut}
        onSignOut={handleSignOut}
      />

      {/* Main content with top padding for header */}
      <div className="flex w-full pt-16">
        <Editor
          resumeContent={resumeContent}
          setResumeContent={setResumeContent}
        />

        <LivePreview resumeContent={resumeContent} />
      </div>
    </div>
  );
}
