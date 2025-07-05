// using fetch library
import { IResume } from "./schemas/resume.schema";

// Base API configuration
const API_BASE_URL = "/api";

// Resume API functions
export const resumeAPI = {
  // Get the current resume
  getResume: async (): Promise<IResume> => {
    const res = await fetch(`${API_BASE_URL}/resume/`);
    if (!res.ok) {
      throw new Error(`Failed to fetch resume: ${res.status}`);
    }
    return (await res.json()).data;
  },

  // Create a new blank resume
  createResume: async (): Promise<IResume> => {
    const res = await fetch(`${API_BASE_URL}/resume/`, {
      method: "POST",
    });
    if (!res.ok) {
      throw new Error(`Failed to create resume: ${res.status}`);
    }
    return (await res.json()).data;
  },

  // Sync resume content (with keepalive for emergency sync)
  syncResume: async (
    resumeContent: {
      id: string;
      content: IResume["content"];
      user_updated_at: IResume["user_updated_at"];
    },
    useKeepalive = false
  ): Promise<void> => {
    const res = await fetch(`${API_BASE_URL}/resume/`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(resumeContent),
      ...(useKeepalive && { keepalive: true }),
    });
    if (!res.ok) {
      throw new Error(`Failed to sync resume: ${res.status}`);
    }
  },

  // Get initial resume or create one if it doesn't exist
  getOrCreateResume: async (): Promise<IResume> => {
    try {
      return await resumeAPI.getResume();
    } catch (error) {
      // If resume doesn't exist (404), create a new one
      if (error instanceof Error && error.message.includes("404")) {
        return await resumeAPI.createResume();
      } else {
        throw error;
      }
    }
  },
};

// Templates API functions
export const templatesAPI = {
  // Get all templates
  getTemplates: async (): Promise<Array<{ name: string; url: string }>> => {
    const res = await fetch(`${API_BASE_URL}/templates/`);
    if (!res.ok) {
      throw new Error(`Failed to fetch templates: ${res.status}`);
    }
    return await res.json();
  },

  // Get template content from URL
  getTemplateContent: async (url: string): Promise<string> => {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Failed to fetch template content: ${res.status}`);
    }
    return await res.text();
  },
};
