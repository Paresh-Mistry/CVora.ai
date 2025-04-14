import React from 'react';

interface ResumeData {
  name: string;
  experience: { role: string; company: string; duration: string }[];
  skills: string[];
  projects: { title: string; description: string }[];
  education: { degree: string; institution: string; year: string }[];
}

const data = {
  name: "Ankit Mistry",
  title: "Frontend Developer",
  summary: "Skilled frontend developer with 2+ years of experience in building responsive and user-friendly web applications using React.js and Tailwind CSS.",
  experience: [
    {
      role: "Frontend Developer",
      company: "Tech Innovations",
      duration: "Jan 2023 - Present",
    },
    {
      role: "Web Developer Intern",
      company: "CodeWave",
      duration: "Jun 2022 - Dec 2022",
    },
  ],
  skills: ["React.js", "JavaScript", "HTML", "CSS", "Tailwind CSS"]
};

const FancyTemplateA: React.FC<{ form?: ResumeData }> = ({ form = data }) => {
  return (
    <div className="w-full mx-auto min-h-screen bg-white rounded-md shadow-xl overflow-hidden">
      <div className="grid grid-cols-3">
        {/* Sidebar */}
        <div className="bg-red-600 h-screen text-white p-6 col-span-1 space-y-6">
          <h1 className="text-3xl font-bold">{form.name || data.name}</h1>
          <div>
            <h3 className="text-lg font-semibold border-b border-white mb-2 pb-1">Skills</h3>
            <ul className="text-sm space-y-1">
              {form.skills.map((skill, idx) => <li key={idx}>• {skill}</li>)}
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold border-b border-white mb-2 pb-1">Education</h3>
            {form.education.map((edu, idx) => (
              <div key={idx} className="text-sm mb-2">
                <p className="font-medium">{edu.degree}</p>
                <p>{edu.institution}, {edu.year}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="col-span-2 p-8 space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-red-600 border-b mb-2">Experience</h2>
            {(form||data).experience.map((exp, idx) => (
              <div key={idx} className="mb-3">
                <h3 className="font-medium">{exp.role} – <span className="text-gray-600">{exp.company}</span></h3>
                <p className="text-sm text-gray-500">{exp.duration}</p>
              </div>
            ))}
          </div>

          <div>
            <h2 className="text-xl font-semibold text-red-600 border-b mb-2">Projects</h2>
            {form.projects.map((proj, idx) => (
              <div key={idx}>
                <h3 className="font-medium">{proj.title}</h3>
                <p className="text-sm text-gray-700">{proj.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FancyTemplateA;
