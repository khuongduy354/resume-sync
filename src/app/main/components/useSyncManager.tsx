"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { IResume } from "@/lib/schemas/resume.schema";
import { resumeAPI } from "@/lib/apiClient";

type PendingSync = {
  timeoutId: NodeJS.Timeout;
  patchPayload: {
    id: string;
    content: IResume["content"];
    user_updated_at: IResume["user_updated_at"];
  };
};

export function useSyncManager(resumeContent: IResume | undefined) {
  const [pendingSync, setPendingSync] = useState<PendingSync>();
  const [syncPopup, setSyncPopup] = useState<{
    isVisible: boolean;
    message: string;
    type: "syncing" | "success" | "error";
  }>({
    isVisible: false,
    message: "",
    type: "syncing",
  });

  const showSyncPopup = useCallback(
    (
      message: string,
      type: "syncing" | "success" | "error",
      duration = 2000
    ) => {
      setSyncPopup({ isVisible: true, message, type });
      if (type !== "syncing") {
        setTimeout(
          () => setSyncPopup((prev) => ({ ...prev, isVisible: false })),
          duration
        );
      }
    },
    []
  );

  const hideSyncPopup = useCallback(() => {
    setSyncPopup((prev) => ({ ...prev, isVisible: false }));
  }, []);

  // Auto-sync effect
  useEffect(() => {
    if (!resumeContent) {
      setPendingSync(undefined);
      return;
    }

    const interval = 2000;
    resumeContent.user_updated_at = new Date().toISOString();
    const patchPayload = {
      id: resumeContent.id,
      content: resumeContent.content,
      user_updated_at: resumeContent.user_updated_at,
    };

    async function syncResumeContent() {
      try {
        if (resumeContent) {
          showSyncPopup("Syncing changes...", "syncing");
          await resumeAPI.syncResume(patchPayload);
          showSyncPopup("Changes saved!", "success");
        }
      } catch (err) {
        showSyncPopup("Failed to sync changes", "error");
      } finally {
        setPendingSync(undefined);
      }
    }

    const timeoutId = setTimeout(syncResumeContent, interval);
    setPendingSync({ timeoutId, patchPayload });

    return () => {
      clearTimeout(timeoutId);
    };
  }, [resumeContent, showSyncPopup]);

  // Handle pending sync for critical actions
  const handlePendingSync = useCallback(
    async (reason: string = "emergency") => {
      if (!pendingSync) return;

      clearTimeout(pendingSync.timeoutId);
      try {
        console.log(`${reason} sync triggered`);
        hideSyncPopup();
        showSyncPopup(`Syncing before ${reason}...`, "syncing");
        await resumeAPI.syncResume(pendingSync.patchPayload, true);
        showSyncPopup("Changes saved!", "success");
      } catch (error) {
        console.error(`Failed to sync resume during ${reason}:`, error);
        showSyncPopup("Sync failed", "error");
      } finally {
        setPendingSync(undefined);
      }
    },
    [pendingSync, hideSyncPopup, showSyncPopup]
  );

  // Emergency sync on visibility change
  useEffect(() => {
    const handleEmergencySync = () => {
      if (document.visibilityState !== "hidden") return;
      handlePendingSync("emergency");
    };

    document.addEventListener("visibilitychange", handleEmergencySync);

    return () => {
      document.removeEventListener("visibilitychange", handleEmergencySync);
    };
  }, [handlePendingSync]);

  return {
    pendingSync,
    syncPopup,
    handlePendingSync,
    showSyncPopup,
    hideSyncPopup,
  };
}
