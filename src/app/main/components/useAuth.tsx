"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabaseClient";
import { resumeAPI } from "@/lib/apiClient";
import { IResume, ResumeSchema } from "@/lib/schemas/resume.schema";

export function useAuth() {
  const [userEmail, setUserEmail] = useState<string>("");
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [resumeContent, setResumeContent] = useState<IResume>();
  const supabaseRef = useRef(createSupabaseBrowserClient());

  // Fetch initial resume content
  useEffect(() => {
    async function fetchInitialResume() {
      try {
        // Check authentication first
        const { data: authData } = await supabaseRef.current.auth.getUser();
        if (!authData.user) {
          window.location.href = "/login";
          return;
        }
        setUserEmail(authData.user.email || "");

        const data = await resumeAPI.getOrCreateResume();

        const parsedRes = await ResumeSchema.safeParseAsync(data);
        if (parsedRes.success) {
          setResumeContent(parsedRes.data);
        } else {
          console.error("Failed to parse resume data:", parsedRes.error);
        }
      } catch (error) {
        console.error("Error fetching or creating initial resume:", error);
      }
    }

    fetchInitialResume();
  }, []);

  const signOut = useCallback(async function signOut(
    handlePendingSync?: () => Promise<void>
  ) {
    setIsSigningOut(true);
    try {
      // Handle pending sync before signing out
      if (handlePendingSync) {
        await handlePendingSync();
      }

      const { error } = await supabaseRef.current.auth.signOut();
      if (error) {
        console.error("Error signing out:", error);
        alert("Error signing out: " + error.message);
      } else {
        window.location.href = "/login";
      }
    } catch (error) {
      console.error("Unexpected error during sign out:", error);
      alert("An unexpected error occurred during sign out.");
    } finally {
      setIsSigningOut(false);
    }
  },
  []);

  return {
    userEmail,
    isSigningOut,
    resumeContent,
    setResumeContent,
    signOut,
  };
}
