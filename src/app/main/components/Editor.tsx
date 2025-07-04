"use client";

import { useState } from "react";
import { IResume } from "@/model/ResumeModel";

interface EditorProps {
  resumeContent?: IResume;
  setResumeContent: (content: IResume) => void;
}

type StepKey = "info" | "education" | "skills" | "experience";

export default function Editor({
  resumeContent,
  setResumeContent,
}: EditorProps) {
  const [currentStep, setCurrentStep] = useState<StepKey>("info");
  const [newSkill, setNewSkill] = useState("");
  const [formData, setFormData] = useState<IResume>(() => {
    // Mock data for demonstration
    return (
      resumeContent || {
        owner_id: "mock-user-id",
        template_id: "modern-template",
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
      }
    );
  });

  const steps: { key: StepKey; title: string; icon: string }[] = [
    { key: "info", title: "Personal Info", icon: "👤" },
    { key: "education", title: "Education", icon: "🎓" },
    { key: "skills", title: "Skills", icon: "⚡" },
    { key: "experience", title: "Experience", icon: "💼" },
  ];

  const currentStepIndex = steps.findIndex((step) => step.key === currentStep);

  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStep(steps[currentStepIndex + 1].key);
    }
  };

  const handlePrevious = () => {
    if (currentStepIndex > 0) {
      setCurrentStep(steps[currentStepIndex - 1].key);
    }
  };

  const updateFormData = (section: StepKey, data: any) => {
    const updatedData = {
      ...formData,
      content: {
        ...formData.content,
        sections: {
          ...formData.content.sections,
          [section]: data,
        },
      },
    };
    setFormData(updatedData);
    setResumeContent(updatedData);
  };

  const renderPersonalInfoForm = () => {
    const info = formData.content.sections.info[0];
    return (
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Full Name
          </label>
          <input
            type="text"
            value={info?.name || ""}
            onChange={(e) =>
              updateFormData("info", [{ ...info, name: e.target.value }])
            }
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter your full name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            value={info?.email || ""}
            onChange={(e) =>
              updateFormData("info", [{ ...info, email: e.target.value }])
            }
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="your.email@example.com"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone
          </label>
          <input
            type="tel"
            value={info?.phone || ""}
            onChange={(e) =>
              updateFormData("info", [{ ...info, phone: e.target.value }])
            }
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="+1 (555) 123-4567"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Address
          </label>
          <input
            type="text"
            value={info?.address || ""}
            onChange={(e) =>
              updateFormData("info", [{ ...info, address: e.target.value }])
            }
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="123 Main St, City, State 12345"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Website
          </label>
          <input
            type="url"
            value={info?.website || ""}
            onChange={(e) =>
              updateFormData("info", [{ ...info, website: e.target.value }])
            }
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="https://yourwebsite.com"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Professional Summary
          </label>
          <textarea
            value={info?.summary || ""}
            onChange={(e) =>
              updateFormData("info", [{ ...info, summary: e.target.value }])
            }
            rows={4}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Brief summary of your professional background and key skills..."
          />
        </div>
      </div>
    );
  };

  const renderEducationForm = () => {
    const education = formData.content.sections.education;

    const addEducation = () => {
      updateFormData("education", [
        ...education,
        { institution: "", degree: "", startDate: "", endDate: "" },
      ]);
    };

    const removeEducation = (index: number) => {
      updateFormData(
        "education",
        education.filter((_, i) => i !== index)
      );
    };

    const updateEducation = (index: number, field: string, value: string) => {
      const updated = education.map((edu, i) =>
        i === index ? { ...edu, [field]: value } : edu
      );
      updateFormData("education", updated);
    };

    return (
      <div className="space-y-6">
        {education.map((edu, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-medium text-gray-800">
                Education {index + 1}
              </h4>
              {education.length > 1 && (
                <button
                  onClick={() => removeEducation(index)}
                  className="text-red-500 hover:text-red-700 text-sm"
                >
                  Remove
                </button>
              )}
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Institution
                </label>
                <input
                  type="text"
                  value={edu.institution}
                  onChange={(e) =>
                    updateEducation(index, "institution", e.target.value)
                  }
                  className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                  placeholder="University or School name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Degree
                </label>
                <input
                  type="text"
                  value={edu.degree}
                  onChange={(e) =>
                    updateEducation(index, "degree", e.target.value)
                  }
                  className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                  placeholder="Bachelor of Science in Computer Science"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date
                  </label>
                  <input
                    type="text"
                    value={edu.startDate || ""}
                    onChange={(e) =>
                      updateEducation(index, "startDate", e.target.value)
                    }
                    className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                    placeholder="2016"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Date
                  </label>
                  <input
                    type="text"
                    value={edu.endDate || ""}
                    onChange={(e) =>
                      updateEducation(index, "endDate", e.target.value)
                    }
                    className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                    placeholder="2020"
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
        <button
          onClick={addEducation}
          className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-colors"
        >
          + Add Education
        </button>
      </div>
    );
  };

  const renderSkillsForm = () => {
    const skills = formData.content.sections.skills;

    const addSkill = () => {
      if (newSkill.trim()) {
        updateFormData("skills", [...skills, newSkill.trim()]);
        setNewSkill("");
      }
    };

    const removeSkill = (index: number) => {
      updateFormData(
        "skills",
        skills.filter((_, i) => i !== index)
      );
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault();
        addSkill();
      }
    };

    return (
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Add a Skill
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., JavaScript, React, Node.js"
            />
            <button
              onClick={addSkill}
              className="px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Add
            </button>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your Skills
          </label>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
              >
                {skill}
                <button
                  onClick={() => removeSkill(index)}
                  className="ml-1 text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </span>
            ))}
            {skills.length === 0 && (
              <p className="text-gray-500 text-sm">
                No skills added yet. Add some skills above.
              </p>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderExperienceForm = () => {
    const experience = formData.content.sections.experience;

    const addExperience = () => {
      updateFormData("experience", [
        ...experience,
        { title: "", companyName: "", startDate: "", endDate: "" },
      ]);
    };

    const removeExperience = (index: number) => {
      updateFormData(
        "experience",
        experience.filter((_, i) => i !== index)
      );
    };

    const updateExperience = (index: number, field: string, value: string) => {
      const updated = experience.map((exp, i) =>
        i === index ? { ...exp, [field]: value } : exp
      );
      updateFormData("experience", updated);
    };

    return (
      <div className="space-y-6">
        {experience.map((exp, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-medium text-gray-800">
                Experience {index + 1}
              </h4>
              {experience.length > 1 && (
                <button
                  onClick={() => removeExperience(index)}
                  className="text-red-500 hover:text-red-700 text-sm"
                >
                  Remove
                </button>
              )}
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Job Title
                </label>
                <input
                  type="text"
                  value={exp.title}
                  onChange={(e) =>
                    updateExperience(index, "title", e.target.value)
                  }
                  className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                  placeholder="Senior Software Engineer"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company Name
                </label>
                <input
                  type="text"
                  value={exp.companyName || ""}
                  onChange={(e) =>
                    updateExperience(index, "companyName", e.target.value)
                  }
                  className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                  placeholder="Tech Solutions Inc."
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date
                  </label>
                  <input
                    type="text"
                    value={exp.startDate || ""}
                    onChange={(e) =>
                      updateExperience(index, "startDate", e.target.value)
                    }
                    className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                    placeholder="2022"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Date
                  </label>
                  <input
                    type="text"
                    value={exp.endDate || ""}
                    onChange={(e) =>
                      updateExperience(index, "endDate", e.target.value)
                    }
                    className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                    placeholder="Present"
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
        <button
          onClick={addExperience}
          className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-colors"
        >
          + Add Experience
        </button>
      </div>
    );
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case "info":
        return renderPersonalInfoForm();
      case "education":
        return renderEducationForm();
      case "skills":
        return renderSkillsForm();
      case "experience":
        return renderExperienceForm();
      default:
        return null;
    }
  };

  return (
    <div className="w-1/2 bg-white flex flex-col">
      {/* Progress Bar */}
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Resume Editor</h2>
        <div className="flex items-center space-x-2">
          {steps.map((step, index) => (
            <div key={step.key} className="flex items-center">
              <button
                onClick={() => setCurrentStep(step.key)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  currentStep === step.key
                    ? "bg-blue-500 text-white"
                    : index <= currentStepIndex
                    ? "bg-green-100 text-green-800"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <span>{step.icon}</span>
                <span>{step.title}</span>
              </button>
              {index < steps.length - 1 && (
                <div
                  className={`w-8 h-0.5 mx-2 ${
                    index < currentStepIndex ? "bg-green-400" : "bg-gray-300"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Form Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            {steps[currentStepIndex].icon} {steps[currentStepIndex].title}
          </h3>
          <p className="text-gray-600 text-sm">
            {currentStep === "info" &&
              "Enter your personal information and professional summary"}
            {currentStep === "education" &&
              "Add your educational background and qualifications"}
            {currentStep === "skills" &&
              "List your technical and professional skills"}
            {currentStep === "experience" &&
              "Detail your work experience and achievements"}
          </p>
        </div>

        {renderCurrentStep()}
      </div>

      {/* Navigation */}
      <div className="p-6 border-t border-gray-200 flex justify-between">
        <button
          onClick={handlePrevious}
          disabled={currentStepIndex === 0}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            currentStepIndex === 0
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Previous
        </button>
        <button
          onClick={handleNext}
          disabled={currentStepIndex === steps.length - 1}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            currentStepIndex === steps.length - 1
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-blue-500 text-white hover:bg-blue-600"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
}
