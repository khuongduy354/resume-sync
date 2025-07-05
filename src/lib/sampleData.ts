import { IResume } from "@/lib/schemas/resume.schema";

/**
 * Sample resume data for development and testing purposes
 * Note: This data should not be used in production
 */
export const getSampleResumeData = (): IResume => ({
  id: "mock-resume-id",
  owner_id: "mock-user-id",
  template_url: "https://example.com/modern-template",
  user_updated_at: new Date().toISOString(),
  created_at: new Date().toISOString(),
  last_updated_at: new Date().toISOString(),
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
});

/**
 * Get an empty resume structure for new resumes
 */
export const getEmptyResumeData = (): IResume => ({
  id: "",
  owner_id: "",
  template_url: "",
  user_updated_at: new Date().toISOString(),
  created_at: new Date().toISOString(),
  last_updated_at: new Date().toISOString(),
  content: {
    sections: {
      info: [
        {
          name: "",
          email: "",
          phone: "",
          address: "",
          website: "",
          summary: "",
        },
      ],
      education: [],
      skills: [],
      experience: [],
    },
  },
});
