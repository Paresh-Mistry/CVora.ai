import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import TemplateOne from '../templates/TemplateOne';
// import TemplateTwo from '../templates/TemplateTwo';
// import TemplateThree from '../templates/TemplateThree';
// import TemplateFour from '../templates/TemplateFour';
import { Eye, X } from 'lucide-react';

const steps = ['name', 'experience', 'skills', 'projects', 'education'];

const Editing: React.FC = () => {

    const { id } = useParams();
    const [step, setStep] = useState(0);
    const [resumeData, setResumeData] = useState<any>(null);
    const [showSheet, setShowSheet] = useState(false);



    const [form, setForm] = useState({
        name: '',
        experience: [{ role: '' }],
        skill: [''],
        projects: [{ project_title: '' }],
        education: [{ degree: '' }],
        insight: ''
    });

    const handleChange = (e: any, field: string, index?: number, subField?: string) => {
        const { value } = e.target;
        if (index !== undefined && subField) {
            setForm((prev: any) => {
                const updated = [...prev[field]];
                updated[index][subField] = value;
                return { ...prev, [field]: updated };
            });
        } else if (index !== undefined) {
            setForm((prev: any) => {
                const updated = [...prev[field]];
                updated[index] = value;
                return { ...prev, [field]: updated };
            });
        } else {
            setForm((prev) => ({ ...prev, [field]: value }));
        }
    };

    const addField = (field: string, template: any) => {
        setForm((prev: any) => ({
            ...prev,
            [field]: [...prev[field], template],
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Ensure that all required fields are present in the form state
        const formData = {
            name: form.name,
            role: form.experience[0]?.role,  // Extract the role from experience
            skill: form.skill,
            project_title: form.projects[0]?.project_title,  // Extract project_title from projects
            degree: form.education[0]?.degree  // Extract degree from education
        };

        // Check if all required fields are present
        const requiredFields = ['name', 'role', 'project_title', 'degree'];
        const missingFields = requiredFields.filter(field => !formData[field]);

        if (missingFields.length > 0) {
            console.log("Missing fields:", missingFields);
            // Show some error or alert
            return;
        }

        // Send the request if all fields are present
        try {
            const response = await fetch('http://localhost:5000/resume/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData), // Send the correct form data
            });

            const result = await response.json();
            console.log('Server response:', result);

            setResumeData(result.insight); // Use the returned analysis data
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };



    const renderStep = () => {
        switch (steps[step]) {
            case 'name':
                return (
                    <input
                        type="text"
                        value={form.name}
                        onChange={e => handleChange(e, 'name')}
                        name="name"
                        placeholder="Full Name"
                        className="w-full px-4 py-2 border-b border-gray-300 focus:outline-none focus:border-blue-500"
                    />
                );
            case 'experience':
                return (
                    <>
                        {form.experience.map((exp, index) => (
                            <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                <input
                                    type="text"
                                    placeholder="Role"
                                    value={exp.role}
                                    onChange={(e) => handleChange(e, 'experience', index, 'role')}
                                    name={`experience-${index}-role`}
                                    className="px-3 py-2 border-b text-sm border-gray-300 focus:outline-none focus:border-blue-500"
                                />
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={() => addField('experience', { role: '' })}
                            className="text-blue-600 text-sm hover:underline"
                        >
                            + Add Experience
                        </button>
                    </>
                );
            case 'skills':
                return (
                    <>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {form.skill.map((skill, index) => (
                                <input
                                    key={index}
                                    type="text"
                                    value={skill}
                                    onChange={(e) => handleChange(e, 'skill', index)}
                                    name={`skill-${index}`}
                                    placeholder={`Skill ${index + 1}`}
                                    className="w-full px-3 py-2 rounded-md border border-gray-300 text-sm focus:outline-none focus:border-blue-500"
                                />
                            ))}
                        </div>
                        <button
                            type="button"
                            onClick={() => addField('skill', '')}
                            className="text-blue-600 text-sm hover:underline mt-2"
                        >
                            + Add Skill
                        </button>
                    </>
                );
            case 'projects':
                return (
                    <>
                        {form.projects.map((proj, index) => (
                            <input
                                key={index}
                                type="text"
                                value={proj.project_title}
                                onChange={(e) => handleChange(e, 'projects', index, 'project_title')}
                                name={`projects-${index}-project_title`}
                                placeholder="Project Title"
                                className="w-full mb-3 px-3 py-2 border-b text-sm border-gray-300 focus:outline-none focus:border-blue-500"
                            />
                        ))}
                        <button
                            type="button"
                            onClick={() => addField('projects', { project_title: '' })}
                            className="text-blue-600 text-sm hover:underline"
                        >
                            + Add Project
                        </button>
                    </>
                );
            case 'education':
                return (
                    <>
                        {form.education.map((edu, index) => (
                            <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                <input
                                    type="text"
                                    placeholder="Degree"
                                    value={edu.degree}
                                    onChange={(e) => handleChange(e, 'education', index, 'degree')}
                                    name={`education-${index}-degree`}
                                    className="px-3 py-2 border-b text-sm border-gray-300 focus:outline-none focus:border-blue-500"
                                />
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={() => addField('education', { degree: '' })}
                            className="text-blue-600 text-sm hover:underline"
                        >
                            + Add Education
                        </button>
                    </>
                );
            default:
                return null;
        }
    };

    return (
        <div className="flex flex-col md:flex-row w-full min-h-screen">
            <aside className="bg-gradient-to-r from-red-900 to-red-500 text-white overflow-x-auto md:w-2/12 md:py-10 py-3 px-5">
                <ol className="md:space-y-6 flex md:flex-col gap-5 md:gap-0">
                    {steps.map((label, i) => (
                        <li key={i} className="sm:flex flex-1 items-center gap-2">
                            <div
                                className={`w-7 h-7 rounded-full flex items-center justify-center mx-auto sm:mx-0 font-bold text-sm ${i === step ? 'bg-red-300' : 'bg-red-500'
                                    }`}
                            >
                                {i + 1}
                            </div>
                            <div className="hidden sm:block font-semibold">{label}</div>
                        </li>
                    ))}
                </ol>
            </aside>

            <main className="flex-1 bg-gray-100 p-4 md:p-8">
                <div className="flex justify-between mb-6 gap-3 items-center">
                    <h1 className="md:text-3xl text-2xl font-bold">Create Your Resume</h1>
                    <div>
                        <button
                            onClick={() => setShowSheet(true)}
                            className="border border-red-600 text-red-500 px-2 py-1 md:px-4 md:py-2 mr-2 rounded hover:bg-blue-700"
                        >
                            <Eye />
                        </button>
                    </div>
                </div>
                <div className="flex flex-col w-full lg:flex-row gap-8">
                    <form
                        onSubmit={handleSubmit}
                        className="flex-1 md:max-w-5/12  h-fit bg-white p-6 rounded-lg shadow-md"
                    >
                        <h2 className="text-xl font-semibold capitalize mb-4">{steps[step]}</h2>
                        {renderStep()}
                        <div className="flex justify-between mt-6">
                            {step > 0 && (
                                <button
                                    type="button"
                                    onClick={() => setStep((prev) => prev - 1)}
                                    className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                                >
                                    Previous
                                </button>
                            )}
                            {step < steps.length - 1 ? (
                                <button
                                    type="button"
                                    onClick={() => setStep((prev) => prev + 1)}
                                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                >
                                    Next
                                </button>
                            ) : (
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                                >
                                    Submit
                                </button>
                            )}
                        </div>
                    </form>
                    <div className="md:max-w-7/12">
                        <div className='mb-4'>
                            <h1 className='text-3xl font-bold'>AI Generated Details</h1>
                        </div>
                        {resumeData ? (
                            <div className='space-y-6'>
                                <div>
                                    <h3 className='text-2xl'>Overview</h3>
                                    <p>{resumeData.overview}</p>
                                </div>
                                <div>
                                    <h3 className='text-2xl'>Job Similarities</h3>
                                    <p>{resumeData.job_matches}</p>
                                </div>
                                <div>
                                    <h3 className='text-2xl'>Activities</h3>
                                    <p>{resumeData.activities}</p>
                                </div>
                                <div>
                                    <h3 className='text-2xl'>Future Learning Advices</h3>
                                    <p>{resumeData.learning_advice}</p>
                                </div>
                            </div>
                        ) : (
                            /* From Uiverse.io by Javierrocadev */
                            <div className="flex flex-row gap-2">
                                <div className="w-2 h-2 rounded-full bg-red-700 animate-bounce [animation-delay:.7s]"></div>
                                <div className="w-2 h-2 rounded-full bg-red-700 animate-bounce [animation-delay:.3s]"></div>
                                <div className="w-2 h-2 rounded-full bg-red-700 animate-bounce [animation-delay:.7s]"></div>
                            </div>
                        )}
                    </div>

                </div>
                <div
                    className={`fixed top-0 right-0 h-full w-full md:w-6/12 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${showSheet ? 'translate-x-0' : 'translate-x-full'
                        }`}
                >
                    <div className="flex justify-between items-center p-4">
                        <button className="cursor-pointer">
                            <X onClick={() => setShowSheet(false)} />
                        </button>
                        <button className="bg-red-500 rounded px-3 py-2 text-white">Export PDF</button>
                    </div>
                    <div className="p-4 overflow-y-auto h-[calc(100%-60px)]">
                        {id === 'template1' ? (
                            <TemplateOne form={form} insight={resumeData} />
                            // ) : id === 'template2' ? (
                            //     <TemplateTwo form={form} />
                            // ) : id === 'template3' ? (
                            //     <TemplateThree form={form} />
                            // ) : id === 'template4' ? (
                            //     <TemplateFour form={form} />
                        ) : null}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Editing;
