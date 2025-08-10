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
    { role: "Frontend Developer", company: "Tech Innovations", duration: "Jan 2023 - Present" },
    { role: "Intern", company: "CodeWave", duration: "Jun 2022 - Dec 2022" }
  ],
  skills: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Framer Motion"],
  projects: [
    { title: "Task Manager", description: "An interactive To-Do app with animations and API." },
    { title: "E-Commerce UI", description: "Frontend for online store with cart, search, and product filtering." },
  ],
  education: [
    { degree: "Bachelor of Engineering", institution: "KJSIT", year: "2024" },
    { degree: "HSC", institution: "Somaiya College", year: "2020" }
  ]
};

const TemplateFour: React.FC<{ form?: ResumeData }> = ({ form = defaultData }) => {
  return (
    <div className=" w-full mx-auto bg-white p-8 shadow-lg rounded-xl space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-indigo-700">{form.name}</h1>
        <p className="text-md text-gray-600">Frontend Developer</p>
      </header>

      <section>
        <h2 className="bg-indigo-100 text-indigo-700 inline-block px-4 py-1 text-sm font-bold rounded">EXPERIENCE</h2>
        <div className="mt-3 space-y-2">
          {form.experience.map((exp, i) => (
            <div key={i}>
              <p className="font-semibold">{exp.role}</p>
              <p className="text-sm text-gray-500">{exp.company} – {exp.duration}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="bg-green-100 text-green-700 inline-block px-4 py-1 text-sm font-bold rounded">SKILLS</h2>
        <div className="flex flex-wrap gap-2 mt-3">
          {form.skills.map((skill, i) => (
            <span key={i} className="bg-green-200 text-green-900 px-3 py-1 rounded-full text-xs font-medium">
              {skill}
            </span>
          ))}
        </div>
      </section>

      <section>
        <h2 className="bg-blue-100 text-blue-700 inline-block px-4 py-1 text-sm font-bold rounded">PROJECTS</h2>
        {form.projects.map((proj, i) => (
          <div key={i} className="mt-2">
            <p className="font-semibold">{proj.title}</p>
            <p className="text-sm text-gray-600">{proj.description}</p>
          </div>
        ))}
      </section>

      <section>
        <h2 className="bg-pink-100 text-pink-700 inline-block px-4 py-1 text-sm font-bold rounded">EDUCATION</h2>
        {form.education.map((edu, i) => (
          <div key={i} className="mt-2">
            <p className="font-semibold">{edu.degree}</p>
            <p className="text-sm text-gray-600">{edu.institution} – {edu.year}</p>
          </div>
        ))}
      </section>
    </div>
  );
};

export default TemplateFour;
