"use client";

import { useEffect, useState } from "react";
import { IResume } from "@/model/ResumeModel";
import Editor from "./components/Editor";
import LivePreview from "./components/LivePreview";

export default function Page() {
  const [resumeContent, setResumeContent] = useState<IResume>();
  useEffect(() => {
    let ran = false;
    if (ran) return;

    async function fetchInitialResume() {
      const res = await fetch("/api/resume/form-progress");
      if (!res.ok) {
        // TODO: Handle error
      }
      const data = await res.json();
      setResumeContent(data);
    }

    try {
      // fetchInitialResume();
    } catch (error) {
      console.error("Error fetching initial resume:", error);
    }

    return () => {
      ran = true;
    };
  }, []);

  return (
    <div className="flex h-screen bg-gray-100">
      <Editor
        resumeContent={resumeContent}
        setResumeContent={setResumeContent}
      />
      <LivePreview
        resumeContent={resumeContent}
        setResumeContent={setResumeContent}
      />
    </div>
  );
}
