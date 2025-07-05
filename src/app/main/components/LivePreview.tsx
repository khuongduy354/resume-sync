"use client";

import DOMPurify from "dompurify";
import { IResume } from "@/lib/schemas/resume.schema";
import { templatesAPI } from "@/lib/apiClient";
import jspdf from "jspdf";
import html2canvas from "html2canvas-pro";
import Handlebars from "handlebars";
import { useCallback, useEffect, useRef, useState } from "react";

interface LivePreviewProps {
  resumeContent?: IResume;
}

export default function LivePreview({ resumeContent }: LivePreviewProps) {
  const [currentTemplate, setCurrentTemplate] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [currentHtml, setCurrentHtml] = useState<string>("");

  const previewRef = useRef<HTMLDivElement>(null);

  // Fetch templates on component mount
  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        const templates = await templatesAPI.getTemplates();
        if (templates && templates.length > 0) {
          // Get the first template content
          const templateContent = await templatesAPI.getTemplateContent(
            templates[0].url
          );
          console.log(templates[0].url);
          setCurrentTemplate(templateContent);
        }
      } catch (error) {
        console.error("Failed to fetch templates, using default:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTemplate();
  }, []);

  // Watch for changes in resumeContent and generate HTML
  useEffect(() => {
    if (resumeContent && currentTemplate) {
      generateResumeHTML(resumeContent);
    }
  }, [resumeContent, currentTemplate]);

  // Generate HTML using Handlebars template
  const generateResumeHTML = (displayData: IResume) => {
    const info = displayData.content.sections.info[0] || {};
    const education = displayData.content.sections.education;
    const skills = displayData.content.sections.skills;
    const experience = displayData.content.sections.experience;

    // Compile the template
    const template = Handlebars.compile(currentTemplate);

    // Generate HTML with data
    const htmlContent = template({
      info,
      education,
      skills,
      experience,
    });

    // DOM purify
    const sanitizedHtml = DOMPurify.sanitize(htmlContent);
    setCurrentHtml(sanitizedHtml);
  };

  const downloadPdf = useCallback(async () => {
    if (!previewRef.current) return;

    try {
      // Use a higher scale for better quality
      const canvas = await html2canvas(previewRef.current, {
        scale: 2, // Increase quality
        useCORS: true,
        backgroundColor: "#FFFFFF",
      });

      // A4 dimensions in mm (more precise than points)
      const pdf = new jspdf({
        format: "a4",
        unit: "mm",
      });

      const imgWidth = 210; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(
        canvas.toDataURL("image/png", 1.0),
        "PNG",
        0,
        0,
        imgWidth,
        imgHeight
      );

      pdf.save("resume.pdf");
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  }, []);

  return (
    <div className="w-1/2 p-6 bg-white overflow-y-auto max-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Live Preview</h2>
        <div className="flex gap-2">
          <button
            onClick={downloadPdf}
            className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
          >
            Download PDF
          </button>
          <button className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
            Share
          </button>
        </div>
      </div>

      {/* Resume Preview */}
      <div className="flex justify-center">
        {loading ? (
          <div className="p-8 text-center text-gray-500">
            <p>Loading template...</p>
          </div>
        ) : resumeContent ? (
          <div
            ref={previewRef}
            className="bg-white min-h-[29.7cm] w-[21cm] print:shadow-none print:p-0"
            style={{ padding: "0.5in" }}
            dangerouslySetInnerHTML={{ __html: currentHtml }}
          ></div>
        ) : (
          <div className="p-8 text-center text-gray-500">
            <p>Start editing your resume to see the preview</p>
          </div>
        )}
      </div>
    </div>
  );
}
