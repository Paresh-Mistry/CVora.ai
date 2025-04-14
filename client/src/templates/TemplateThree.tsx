import React from 'react';

interface ResumeData {
  name: string;
  experience: { role: string; company: string; duration: string }[];
  skills: string[];
  projects: { title: string; description: string }[];
  education: { degree: string; institution: string; year: string }[];
}

const defaultData: ResumeData = {
  name: "Ankit Mistry",
  experience: [
    { role: "Frontend Dev", company: "Innovatech", duration: "2023 - Present" },
    { role: "Intern", company: "CodeWave", duration: "2022" }
  ],
  skills: ["JavaScript", "React", "Tailwind", "Git", "APIs"],
  projects: [
    { title: "Design System", description: "Built a reusable component library using Storybook + Tailwind." },
    { title: "Finance Tracker", description: "React app to track personal expenses and savings." },
  ],
  education: [
    { degree: "B.E. Computer Engineering", institution: "Somaiya Institute", year: "2024" },
  ]
};

const TemplateThree: React.FC<{ form?: ResumeData }> = ({ form = defaultData }) => {
  return (
    <div className="min-h-screen w-full bg-gray-900 text-gray-100 p-10 font-mono">
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="border-b border-gray-700 pb-4">
          <h1 className="text-4xl font-bold text-teal-400">{form.name}</h1>
          <p className="text-sm text-gray-400">Frontend Developer</p>
        </header>

        <section>
          <h2 className="text-xl text-teal-300 mb-2">Experience</h2>
          {form.experience.map((exp, idx) => (
            <div key={idx} className="mb-2">
              <p className="font-semibold">{exp.role}</p>
              <p className="text-sm text-gray-400">{exp.company} – {exp.duration}</p>
            </div>
          ))}
        </section>

        <section>
          <h2 className="text-xl text-teal-300 mb-2">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {form.skills.map((skill, i) => (
              <span key={i} className="bg-gray-800 border border-teal-500 text-xs px-3 py-1 rounded-full">
                {skill}
              </span>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-xl text-teal-300 mb-2">Projects</h2>
          {form.projects.map((proj, i) => (
            <div key={i} className="mb-2">
              <p className="font-semibold">{proj.title}</p>
              <p className="text-sm text-gray-400">{proj.description}</p>
            </div>
          ))}
        </section>

        <section>
          <h2 className="text-xl text-teal-300 mb-2">Education</h2>
          {form.education.map((edu, i) => (
            <div key={i}>
              <p className="font-semibold">{edu.degree}</p>
              <p className="text-sm text-gray-400">{edu.institution} – {edu.year}</p>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
};

export default TemplateThree;
