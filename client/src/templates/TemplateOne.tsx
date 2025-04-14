import React from 'react';

interface ResumeData {
  name: string;
  experience: { role: string }[];
  skill: string[];
  project: { project_title: string }[];
  education: { degree: string }[];
  insight:string
}

const TemplateOne = ({ form, insight }: { form: any; insight: any }) => {
  return (
    <div className="p-8 mx-auto h-screen bg-white shadow-lg border border-red-200 space-y-6">
      {/* Header */}
      <div className="text-center border-b pb-4">
        <h1 className="text-4xl font-bold text-red-600">{form.name || "Your Name"}</h1>
        <h2 className="text-lg text-gray-500">Frontend Developer</h2>
      </div>

      {/* Summary */}
      <div>
        <h3 className="text-lg font-semibold text-gray-700">Summary</h3>
        <p className="mt-1 text-sm text-gray-800 leading-relaxed">
          {insight?.overview}
        </p>
      </div>

      {/* Experience */}
      <div>
        <h3 className="text-lg font-semibold text-gray-700 border-b pb-1">Experience</h3>
        <ul className="mt-2 space-y-3">
          {form.experience?.length > 0 && form.experience[0].role !== '' ? (
            form.experience.map((exp, index) => (
              <li key={index} className="bg-gray-50 border-l-4 border-red-500 pl-4 py-2 rounded shadow-sm">
                <p className="text-sm font-medium text-gray-900">{exp.role}</p>
              </li>
            ))
          ) : (
            <li className="text-sm text-gray-600">No experience listed</li>
          )}
        </ul>
      </div>

      {/* Skills */}
      <div>
        <h3 className="text-lg font-semibold text-gray-700 border-b pb-1">Skills</h3>
        <div className="flex flex-wrap gap-2 mt-3">
          {form.skill?.length > 0 && form.skill[0] !== '' ? (
            form.skill.map((skill, index) => (
              <span key={index} className="bg-red-100 text-red-800 px-3 py-1 text-xs font-medium rounded-full shadow-sm">
                {skill}
              </span>
            ))
          ) : (
            <span className="text-sm text-gray-600">No skills listed</span>
          )}
        </div>
      </div>

      {/* Projects */}
      <div>
        <h3 className="text-lg font-semibold text-gray-700 border-b pb-1">Projects</h3>
        <ul className="mt-2 space-y-3">
          {form.project?.length > 0 && form.project[0].project_title !== '' ? (
            form.project.map((proj, index) => (
              <li key={index} className="bg-gray-50 pl-4 py-2 rounded shadow-sm">
                <p className="text-sm font-medium text-gray-900">{proj.project_title}</p>
              </li>
            ))
          ) : (
            <li className="text-sm text-gray-600">No projects listed</li>
          )}
        </ul>
      </div>

      {/* Education */}
      <div>
        <h3 className="text-lg font-semibold text-gray-700 border-b pb-1">Education</h3>
        <ul className="mt-2 space-y-3">
          {form.education?.length > 0 && form.education[0].degree !== '' ? (
            form.education.map((edu, index) => (
              <li key={index} className="bg-gray-50 pl-4 py-2 rounded shadow-sm">
                <p className="text-sm font-medium text-gray-900">{edu.degree}</p>
              </li>
            ))
          ) : (
            <li className="text-sm text-gray-600">No education listed</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default TemplateOne;
