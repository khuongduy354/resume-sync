"use client";

import { IResume } from "@/lib/schemas/resume.schema";
import Handlebars from "handlebars";

interface LivePreviewProps {
  resumeContent?: IResume;
  setResumeContent?: (content: IResume) => void;
}

// Function to get the Handlebars template string
export const getResumeTemplate = () => `
  <div class="resume-template bg-white p-8 shadow-lg max-w-4xl mx-auto">
    <!-- Header Section -->
    <header class="border-b-2 border-gray-800 pb-4 mb-6">
      <h1 class="text-4xl font-bold text-gray-800 mb-2">
        {{info.name}}
      </h1>
      <div class="flex flex-wrap gap-4 text-sm text-gray-600">
        <span>📧 {{info.email}}</span>
        <span>📞 {{info.phone}}</span>
        <span>🏠 {{info.address}}</span>
        <span>
          🌐 <a href="{{info.website}}" class="text-blue-600 hover:underline">
            {{info.website}}
          </a>
        </span>
      </div>
    </header>

    <!-- Summary Section -->
    {{#if info.summary}}
    <section class="mb-6">
      <h2 class="text-xl font-semibold text-gray-800 mb-3 border-b border-gray-300 pb-1">
        Professional Summary
      </h2>
      <p class="text-gray-700 leading-relaxed">{{info.summary}}</p>
    </section>
    {{/if}}

    <!-- Experience Section -->
    <section class="mb-6">
      <h2 class="text-xl font-semibold text-gray-800 mb-3 border-b border-gray-300 pb-1">
        Professional Experience
      </h2>
      {{#each experience}}
      <div class="mb-4">
        <div class="flex justify-between items-start mb-1">
          <h3 class="text-lg font-medium text-gray-800">
            {{this.title}}
          </h3>
          <span class="text-sm text-gray-500">
            {{this.startDate}} - {{this.endDate}}
          </span>
        </div>
        <p class="text-gray-600 mb-2">{{this.companyName}}</p>
        <ul class="list-disc list-inside text-gray-700 ml-4">
          <li>Led development of key features and improvements</li>
          <li>Collaborated with cross-functional teams</li>
          <li>Mentored junior developers and conducted code reviews</li>
        </ul>
      </div>
      {{/each}}
    </section>

    <!-- Education Section -->
    <section class="mb-6">
      <h2 class="text-xl font-semibold text-gray-800 mb-3 border-b border-gray-300 pb-1">
        Education
      </h2>
      {{#each education}}
      <div class="mb-3">
        <div class="flex justify-between items-start">
          <div>
            <h3 class="font-medium text-gray-800">{{this.degree}}</h3>
            <p class="text-gray-600">{{this.institution}}</p>
          </div>
          <span class="text-sm text-gray-500">
            {{this.startDate}} - {{this.endDate}}
          </span>
        </div>
      </div>
      {{/each}}
    </section>

    <!-- Skills Section -->
    <section class="mb-6">
      <h2 class="text-xl font-semibold text-gray-800 mb-3 border-b border-gray-300 pb-1">
        Technical Skills
      </h2>
      <div class="grid grid-cols-2 gap-2">
        {{#each skills}}
        <div class="flex items-center">
          <span class="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
          <span class="text-gray-700">{{this}}</span>
        </div>
        {{/each}}
      </div>
    </section>
  </div>
`;

export default function LivePreview({ resumeContent }: LivePreviewProps) {
  // Use the live data from Editor, fallback to default data if none provided
  const currentDate = new Date();
  const defaultResumeContent: IResume = {
    id: "mock-resume-id",
    user_updated_at: 0,
    owner_id: "mock-user-id",
    template_url: "modern-template",
    created_at: currentDate.toISOString(),
    last_updated_at: currentDate.toISOString(),
    content: {
      sections: {
        info: [
          {
            name: "John Doe",
            email: "john.doe@email.com",
            phone: "+1 (555) 123-4567",
            address: "123 Main St, City, State 12345",
            website: "https://johndoe.dev",
            summary:
              "Experienced software developer with 5+ years in full-stack development, specializing in React, Node.js, and cloud technologies.",
          },
        ],
        education: [
          {
            institution: "University of Technology",
            degree: "Bachelor of Science in Computer Science",
            startDate: "2016",
            endDate: "2020",
          },
          {
            institution: "Tech Institute",
            degree: "Full Stack Web Development Certificate",
            startDate: "2020",
            endDate: "2021",
          },
        ],
        skills: [
          "JavaScript/TypeScript",
          "React.js",
          "Node.js",
          "Python",
          "AWS",
          "Docker",
          "MongoDB",
          "PostgreSQL",
          "Git",
          "Agile/Scrum",
        ],
        experience: [
          {
            title: "Senior Software Engineer",
            companyName: "Tech Solutions Inc.",
            startDate: "2022",
            endDate: "Present",
          },
          {
            title: "Full Stack Developer",
            companyName: "Digital Innovations LLC",
            startDate: "2020",
            endDate: "2022",
          },
          {
            title: "Junior Developer",
            companyName: "StartUp Co.",
            startDate: "2019",
            endDate: "2020",
          },
        ],
      },
    },
  };

  // Generate HTML using Handlebars template
  const generateResumeHTML = (displayData: IResume) => {
    const info = displayData.content.sections.info[0] || {};
    const education = displayData.content.sections.education;
    const skills = displayData.content.sections.skills;
    const experience = displayData.content.sections.experience;

    // Compile the template
    const template = Handlebars.compile(getResumeTemplate());

    // Generate HTML with data
    const htmlContent = template({
      info,
      education,
      skills,
      experience,
    });

    return <div dangerouslySetInnerHTML={{ __html: htmlContent }} />;
  };

  return (
    <div className="w-1/2 p-6 bg-white overflow-y-auto max-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Live Preview</h2>
        <div className="flex gap-2">
          <button className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors">
            Download PDF
          </button>
          <button className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
            Share
          </button>
        </div>
      </div>

      {/* Resume Preview */}
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        {generateResumeHTML(resumeContent || defaultResumeContent)}
      </div>
    </div>
  );
}
