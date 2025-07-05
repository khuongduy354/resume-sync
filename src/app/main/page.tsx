"use client";

import { useEffect, useRef, useState } from "react";
import { IResume } from "@/lib/schemas/resume.schema";
import { resumeAPI } from "@/lib/apiClient";
import Editor from "./components/Editor";
import LivePreview from "./components/LivePreview";

type PendingSync = {
  timeoutId: NodeJS.Timeout;
  patchPayload: {
    id: string;
    content: IResume["content"];
    user_updated_at: IResume["user_updated_at"];
  };
};

export default function Page() {
  const [resumeContent, setResumeContent] = useState<IResume>();
  const [pendingSync, setPendingSync] = useState<PendingSync>();

  useEffect(() => {
    // perform sync debounce after X seconds intervals of inactivity in resumeContent
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
          await resumeAPI.syncResume(patchPayload);
        }
      } catch (err) {
        // TODO: Handle error
        // throw new Error("Error syncing resume content: " + err);
      } finally {
        setPendingSync(undefined);
      }
    }

    const timeoutId = setTimeout(syncResumeContent, interval);
    setPendingSync({ timeoutId, patchPayload });

    return () => {
      clearTimeout(timeoutId);
    };
  }, [resumeContent]);

  useEffect(() => {
    // hande emergency sync when the page is closed or visibility changes (tab switch)
    // send with fetch keep-alive instantly if there is an ongoing sync

    const handleEmergencySync = () => {
      if (document.visibilityState !== "hidden") return;

      if (pendingSync) {
        clearTimeout(pendingSync.timeoutId);
        // sending emergency sync
        try {
          console.log("Emergency sync triggered");
          resumeAPI.syncResume(pendingSync.patchPayload, true);
        } catch (error) {
          console.error("Failed to sync resume during page close:", error);
        } finally {
          setPendingSync(undefined);
        }
      }
    };

    document.addEventListener("visibilitychange", handleEmergencySync);

    return () => {
      document.removeEventListener("visibilitychange", handleEmergencySync);
    };
  }, [pendingSync]);

  useEffect(() => {
    // fetch initial resume content
    // create a blank resume if no resume exists
    // run once at startup
    async function fetchInitialResume() {
      try {
        const data = await resumeAPI.getOrCreateResume();
        setResumeContent(data);
      } catch (error) {
        console.error("Error fetching or creating initial resume:", error);
      }
    }

    fetchInitialResume();
  }, []);

  return (
    <div className="flex h-screen bg-gray-100">
      {pendingSync && (
        <div className="absolute top-0 right-0 p-4 bg-yellow-200 text-yellow-800">
          Pending sync...
        </div>
      )}
      <Editor
        resumeContent={resumeContent}
        setResumeContent={setResumeContent}
      />

      <LivePreview resumeContent={resumeContent} />
    </div>
  );
}
