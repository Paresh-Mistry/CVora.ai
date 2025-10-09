import React from "react";
import { motion } from "framer-motion";
import { FormData } from "../context/FormTypes";

const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
};


const TemplateFinanceManager: React.FC<FormData> = ({ form, insight, textcolor, bgcolor }: { form: any; insight: any, textcolor: string, bgcolor: string }) => {
    return (
        <div
            className="relative w-full min-h-screen p-6 md:p-12 font-sans"
            style={{
                color: textcolor,
                backgroundColor: bgcolor,
                backgroundImage: `radial-gradient(circle at top left, rgba(255,255,255,0.05), transparent 40%)`
            }}
        >
            <div className="max-w-6xl mx-auto space-y-10">
                {/* HEADER */}
                <motion.header
                    initial="hidden"
                    animate="visible"
                    variants={fadeIn}
                    transition={{ duration: 0.6 }}
                    className="border-b border-gray-700 pb-6 flex flex-col md:flex-row justify-between gap-6"
                >
                    <div className="w-3/4">
                        <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-cyan-500">
                            {form.name || "Full Name"}
                        </h1>
                        <p className="text-xl opacity-80 mt-1">
                            {form.domain || "Your Domain"}
                        </p>
                        <p className="opacity-70 text-white mt-3">
                            {insight?.overview || "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ab quam, magni facilis recusandae vitae repellendus impedit officia iste necessitatibus est similique delectus laborum numquam quos. Voluptates cum nesciunt quidem omnis."}
                        </p>
                    </div>

                    <div className="w-1/4">
                        <img
                            className="w-40 h-40 rounded-2xl invert-25"
                            src="https://cdn-icons-png.flaticon.com/128/6020/6020006.png"
                            alt="" />
                    </div>



                </motion.header>

                {/* CONTENT */}
                <div className="flex flex-col md:flex-row gap-10">
                    {/* LEFT COLUMN */}
                    <div className="md:w-1/3 space-y-8">
                        {/* EXPERIENCE */}
                        {form.education?.length > 0 && (
                            <div className="flex flex-col gap-2 text-sm bg-gray-800/50 p-4 rounded-lg border border-gray-700 shadow-md">
                                {form.email && <span>{form.email}</span>}
                                {form.phone && <span>{form.phone}</span>}
                                {form.github && (
                                    <a
                                        href={`https://${form.github}`}
                                        className="hover:text-teal-400 transition"
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        {form.github}
                                    </a>
                                )}
                                {form.linkedin && (
                                    <a
                                        href={`https://${form.linkedin}`}
                                        className="hover:text-teal-400 transition"
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        {form.linkedin}
                                    </a>
                                )}
                            </div>

                        )}

                    {/* EDUCATION */}
                    {form.education?.length > 0 && (
                        <motion.section
                            initial="hidden"
                            animate="visible"
                            variants={fadeIn}
                            transition={{ duration: 0.6, delay: 0.2 }}
                        >
                            <h2 className="text-xl font-bold mb-4 text-gradient">
                                Education
                            </h2>
                            <div className="space-y-4">
                                {form.education.map((edu: any, i: number) => (
                                    <div key={i} className="pl-4 border-l-2 border-cyan-400">
                                        <h3 className="font-semibold">{edu.degree}</h3>
                                        <p className="text-sm opacity-80">{edu.institute}</p>
                                        <p className="text-xs opacity-60">{edu.year}</p>
                                    </div>
                                ))}
                            </div>
                        </motion.section>
                    )}
                </div>



                {/* RIGHT COLUMN */}
                <div className="md:w-2/3 space-y-8">

                    {form.experience?.length > 0 && (
                        <motion.section
                            initial="hidden"
                            animate="visible"
                            variants={fadeIn}
                            transition={{ duration: 0.6, delay: 0.1 }}
                        >
                            <h2 className="text-xl font-bold mb-4 text-gradient">
                                Experience
                            </h2>
                            <div className="space-y-6">
                                {form.experience.map((exp: any, idx: number) => (
                                    <div key={idx} className="pl-4 border-l-2 border-teal-400">
                                        <h3 className="font-semibold">{exp.role}</h3>
                                        <p className="text-sm opacity-80">{exp.company}</p>
                                        <p className="text-xs opacity-60">{exp.duration}</p>
                                    </div>
                                ))}
                            </div>
                        </motion.section>
                    )}

                    {/* SKILLS */}
                    {Array.isArray(form.skill) && form.skill.length > 0 && (
                        <motion.section
                            initial="hidden"
                            animate="visible"
                            variants={fadeIn}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 shadow-lg"
                        >
                            <h2 className="text-2xl font-bold mb-4 text-gradient">
                                Skills
                            </h2>
                            <div className="flex flex-wrap gap-2">
                                {form.skill.map((skill: string, i: number) => (
                                    <span
                                        key={i}
                                        className="text-xs px-3 py-1.5 rounded-full bg-gray-700/80 border border-gray-600 hover:bg-teal-400/10 hover:text-teal-300 transition"
                                    >
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </motion.section>
                    )}

                    {/* PROJECTS */}
                    {form.projects?.length > 0 && (
                        <motion.section
                            initial="hidden"
                            animate="visible"
                            variants={fadeIn}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 shadow-lg"
                        >
                            <h2 className="text-2xl font-bold mb-4 text-gradient">
                                Projects
                            </h2>
                            <div className="space-y-6">
                                {form.projects.map((proj: any, i: number) => (
                                    <div key={i}>
                                        <h3 className="font-semibold">{proj.project_title}</h3>
                                        <p className="text-sm opacity-80">{proj.description}</p>
                                        {proj.technologies && (
                                            <div className="flex flex-wrap gap-2 mt-2">
                                                {proj.technologies.map((tech: string, j: number) => (
                                                    <span
                                                        key={j}
                                                        className="text-xs px-2 py-1 rounded-full bg-gray-700 text-teal-300"
                                                    >
                                                        {tech}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </motion.section>
                    )}
                </div>
            </div>
        </div >
        </div >
    );
};

export default TemplateFinanceManager;
