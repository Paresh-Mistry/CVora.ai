import React, { useEffect, useState } from 'react';
import Layout from '../Layout/PageLayout';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useFormContext } from '../context/FormContext';
import TemplateFinanceManager from '../templates/TemplateFinanceManager';
import { useParams } from 'react-router-dom';
import TemplateThree from '../templates/TemplateSoftwareEng';


const steps = ['profile', 'experience', 'skills', 'projects', 'education'];


const Editing: React.FC = () => {


    useEffect(() => {
        document.title = "Create Resume"
    }, [])


    const { id } = useParams()


    const [step, setStep] = useState(0);

    const {
        form,
        addField,
        handleChange,
        handleSubmit,
        textColor,
        setTextColor,
        primaryColor,
        setPrimaryColor
    } = useFormContext();



    const handleColorChange = (e: any) => {
        const selectedColor = e.target.value;
        setPrimaryColor(selectedColor);
        setTextColor(getContrastColor(selectedColor));
    };



    const getContrastColor = (hexColor: any) => {
        const color = hexColor.replace('#', '');
        const r = parseInt(color.substr(0, 2), 16);
        const g = parseInt(color.substr(2, 2), 16);
        const b = parseInt(color.substr(4, 2), 16);

        const brightness = (r * 299 + g * 587 + b * 114) / 1000;

        return brightness > 128 ? '#000000' : '#ffffff';
    };


    const capitalize = (text: string) => {
        let _str = text.charAt(0).toUpperCase() + text.slice(1, text.length).toLowerCase()
        return _str
    }


    const renderStep = () => {
        switch (steps[step]) {
            case 'profile':
                return (
                    <div className='space-y-3'>
                        <input
                            type="text"
                            value={form.name}
                            onChange={e => handleChange(e, 'name')}
                            name="name"
                            placeholder="Full Name"
                            className="w-full px-4 py-2 border-b border-gray-300 focus:outline-none focus:border-blue-500"
                        />
                        <input
                            type="text"
                            value={form.domain}
                            onChange={e => handleChange(e, 'domain')}
                            name="domain"
                            placeholder="Domain"
                            className="w-full px-4 py-2 border-b border-gray-300 focus:outline-none focus:border-blue-500"
                        />
                        <input
                            type="email"
                            value={form.email}
                            onChange={e => handleChange(e, 'email')}
                            name="email"
                            placeholder="Email"
                            className="w-full px-4 py-2 border-b border-gray-300 focus:outline-none focus:border-blue-500"
                        />
                        <input
                            type="tel"
                            value={form.phone}
                            onChange={e => handleChange(e, 'phone')}
                            name="phone"
                            placeholder="Phone"
                            className="w-full px-4 py-2 border-b border-gray-300 focus:outline-none focus:border-blue-500"
                        />
                        <input
                            type="text"
                            value={form.linkedin}
                            onChange={e => handleChange(e, 'linkedin')}
                            name="linkedin"
                            placeholder="Linkedin"
                            className="w-full px-4 py-2 border-b border-gray-300 focus:outline-none focus:border-blue-500"
                        />
                        <input
                            type="text"
                            value={form.github}
                            onChange={e => handleChange(e, 'github')}
                            name="github"
                            placeholder="Github"
                            className="w-full px-4 py-2 border-b border-gray-300 focus:outline-none focus:border-blue-500"
                        />
                    </div>
                );
            case 'experience':
                return (
                    <>
                        {form.experience.map((exp, index) => (
                            <div className='bg-gray-50 p-3 rounded space-y-3 mb-2'>
                                <div key={index}>
                                    <input
                                        type="text"
                                        placeholder="Role"
                                        value={exp.role}
                                        onChange={(e) => handleChange(e, 'experience', index, 'role')}
                                        name={`experience-${index}-role`}
                                        className="px-3 py-2 border-b w-full text-sm border-gray-300 focus:outline-none focus:border-blue-500"
                                    />
                                </div>
                                <div key={index} className="grid grid-cols-1 gap-4">
                                    <textarea
                                        placeholder="Description"
                                        value={exp.company}
                                        onChange={(e) => handleChange(e, 'experience', index, 'company')}
                                        name={`experience-${index}-company`}
                                        className="px-3 py-2 border h-28 rounded text-sm border-gray-300 focus:outline-none focus:border-blue-500"
                                    >
                                    </textarea>
                                </div>
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={() => addField('experience', { role: '', company: '', duration: '', descriptiom: '' })}
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
                            <>
                                <input
                                    key={index}
                                    type="text"
                                    value={proj.project_title}
                                    onChange={(e) => handleChange(e, 'projects', index, 'project_title')}
                                    name={`projects-${index}-project_title`}
                                    placeholder="Project Title"
                                    className="w-full mb-3 px-3 py-2 border-b text-sm border-gray-300 focus:outline-none focus:border-blue-500"
                                />
                                <input
                                    key={index}
                                    type="text"
                                    value={proj.description}
                                    onChange={(e) => handleChange(e, 'projects', index, 'description')}
                                    name={`projects-${index}-description`}
                                    placeholder="Description"
                                    className="w-full mb-3 px-3 py-2 border-b text-sm border-gray-300 focus:outline-none focus:border-blue-500"
                                />
                            </>
                        ))}
                        <button
                            type="button"
                            onClick={() => addField('projects', { project_title: '', description: '' })}
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
                            <>
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
                                <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                    <input
                                        type="text"
                                        placeholder="institute"
                                        value={edu.institute}
                                        onChange={(e) => handleChange(e, 'education', index, 'institute')}
                                        name={`education-${index}-institute`}
                                        className="px-3 py-2 border-b text-sm border-gray-300 focus:outline-none focus:border-blue-500"
                                    />
                                </div>
                                <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                    <input
                                        type="text"
                                        placeholder="Year"
                                        value={edu.year}
                                        onChange={(e) => handleChange(e, 'education', index, 'year')}
                                        name={`education-${index}-year`}
                                        className="px-3 py-2 border-b text-sm border-gray-300 focus:outline-none focus:border-blue-500"
                                    />
                                </div>
                            </>
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
        <Layout>
            <div className="flex flex-col bg-[#e7f4f6] md:flex-row w-full">

                <aside className="space-y-4 md:space-y-8 sm:block hidden md:bg-[#c8e7fa]  overflow-x-auto md:w-[14%] md:py-6 py-3 px-4">

                    <div className='flex justify-between text-[#213963] items-center'>
                        <h3 className='text-sm md:text-xl sm:font-medium md:font-semibold'>Tracker</h3>
                    </div>

                    <ol className="md:space-y-6 flex md:flex-col gap-5 md:gap-0">
                        {steps.map((label, i) => (
                            <li key={i} className="sm:flex flex-1 items-center gap-2">
                                <div
                                    className={`w-7 h-7 rounded-full flex items-center justify-center mx-auto sm:mx-0 font-bold border-r-2 text-sm ${i === step ? 'bg-[#c1f5f5] text-[#213963] border-[#213963]' : 'border-black'
                                        }`}
                                >
                                    {i + 1}
                                </div>
                                <div className={`hidden sm:block font-semibold ${i === step && 'text-[#213963]' || 'text-xs'} `}>{capitalize(label)}</div>
                                {i === step && (<div className='md:block hidden'>
                                    <svg className="w-4 h-4 text-green-400 ms-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
                                        <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                                    </svg>
                                </div>)}
                            </li>
                        ))}
                    </ol>

                </aside>

                <main className="flex-1">

                    <div className="flex flex-col w-full md:flex-row">

                        <div className="md:w-5/12 space-y-7 p-6 md:p-8 items-center">
                            <h1 className="md:text-2xl text-xl text-[#212834] orbitron-head">Personal Details</h1>

                            <form
                                onSubmit={handleSubmit}
                                className="flex-1 h-fit bg-white p-6 rounded-lg shadow-md"
                            >
                                <h2 className="text-sm font-medium capitalize mb-4 ">{steps[step]}</h2>
                                {renderStep()}
                                <div className="flex justify-between mt-6">
                                    {step > 0 && (
                                        <button
                                            type="button"
                                            onClick={() => setStep((prev) => prev - 1)}
                                            className="w-10 h-10 flex items-center justify-center gap-1 border rounded-full text-gray-700"
                                        >
                                            <ArrowLeft size={18} />
                                        </button>
                                    )}
                                    {step < steps.length - 1 ? (
                                        <button
                                            type="button"
                                            onClick={() => setStep((prev) => prev + 1)}
                                            className="px-4 py-2 flex items-center gap-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                                        >
                                            Next <ArrowRight size={18} />
                                        </button>
                                    ) : (
                                        <input
                                            type="submit"
                                            value={'Submit'}
                                            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                                        />
                                    )}
                                </div>
                            </form>
                        </div>



                        <div className="md:w-7/12 space-y-2 p-4">

                            <div className='flex justify-between items-center'>
                                <span className="bg-gray-100 text-gray-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-sm border border-gray-300">Preview</span>
                                <input
                                    type="color"
                                    name=""
                                    value={primaryColor}
                                    className='rounded'
                                    onChange={handleColorChange} id=""
                                    style={{ borderColor: primaryColor }}
                                />
                            </div>


                            {id === '1' ? (
                                <TemplateThree form={form} textcolor={textColor} bgcolor={primaryColor} />
                            ) : id === '2' ? (
                                <TemplateFinanceManager form={form} textcolor={textColor} bgcolor={primaryColor} />
                            ) : "No Resume template Found"}


                        </div>
                    </div>

                </main>
            </div>
        </Layout>
    );
};

export default Editing;
