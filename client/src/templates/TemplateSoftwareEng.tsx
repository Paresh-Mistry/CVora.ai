import React from 'react';
import { motion } from 'framer-motion';
import { FormData } from '../context/FormTypes';
import { Github, Linkedin, Mail, Phone } from 'lucide-react';

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const TemplateThree: React.FC<FormData> = ({ form, insight, textcolor, bgcolor }: { form: any; insight: any, textcolor: string, bgcolor: string }) => {
  return (
    <div className="relative w-full rounded-md p-6 md:p-12 font-sans" style={{ color: textcolor, backgroundColor: bgcolor }}>


      <div className="max-w-5xl mx-auto space-y-12">

        <motion.header
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          transition={{ duration: 0.6 }}
          className="border-b border-gray-700 pb-8 flex flex-col md:flex-row justify-between gap-6"
        >
          <div>
            <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-cyan-600">
              {form.name || 'Full Name'}
            </h1>
            <p className="text-xl text-gray-300 mt-2">{form.domain || "Domain"}</p>
            <p className="text-gray-400 mt-4 max-w-2xl">{insight?.overview || 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Laudantium hic quos quam reiciendis aperiam sapiente ea praesentium, earum illo cumque?'}</p>
          </div>

          <div className="flex flex-col gap-2 text-sm space-y-1.5 justify-center bg-gray-800/50 p-4 rounded-lg border border-gray-700">
            <div className="flex items-center gap-2">
              <span><Mail size={18} /></span>
              <span>{form.email || "your.email@example.com"}</span>
            </div>

            <div className="flex items-center gap-2">
              <span><Phone size={18} /></span>
              <span>{form.phone || "+91 99999 99999"}</span>
            </div>

            <div className="flex items-center gap-2">
              <span><Github size={18} /></span>

              <a
                href={`https://${form.github || "github.com/yourusername"}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-teal-400 transition-colors"
              >
                {form.github || "github.com/yourusername"}
              </a>
            </div>

            <div className="flex items-center gap-2">
              <span><Linkedin size={18} /></span>

              <a
                href={`https://${form.linkedin || "linkedin.com/in/yourprofile"}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-teal-400 transition-colors"
              >
                {form.linkedin || "linkedin.com/in/yourprofile"}
              </a>
            </div>
          </div>
        </motion.header>



        <div className="w-full flex gap-8">
          <div className="w-4/12 space-y-8">
            {/* Experience */}
            <motion.section
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h2 className="text-xl font-bold mb-6 relative">
                <span className="bg-gradient-to-r from-teal-400 to-cyan-600 bg-clip-text text-transparent">
                  Experience
                </span>
                <span className="absolute left-0 bottom-0 w-16 h-0.5 bg-gradient-to-r from-teal-400 to-cyan-600"></span>
              </h2>

              <div className="space-y-8">
                {form.experience.map((exp: any, idx: any) => (
                  <div key={idx} className="group relative pl-6">
                    <div className="absolute left-0 top-1 w-3 h-3 rounded-full bg-teal-400 group-hover:animate-pulse"></div>
                    <div className="absolute left-1.5 top-4 bottom-0 w-0.5 bg-gray-700"></div>
                    <div className="space-y-2">
                      <h3 className="font-semibold text-gray-100">{exp.role || "Web Developement"}</h3>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-gray-400">
                        <span className="flex items-center gap-2 text-xs">
                          {/* <BuildingOfficeIcon className="w-4 h-4" /> */}
                          {exp.company || "Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatum consequatur aperiam quisquam molestias optio nemo quia ipsa ducimus, debitis laborum est consectetur fugiat qui modi, eligendi repellendus eum, dolore accusantium."}
                        </span>
                        <span className="flex items-center gap-2">
                          {/* <CalendarIcon className="w-4 h-4" /> */}
                          {exp.duration}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.section>

            {/* Projects */}
            <motion.section
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <h2 className="text-xl font-bold mb-6 relative">
                <span className="bg-gradient-to-r from-teal-400 to-cyan-600 bg-clip-text text-transparent">
                  Education
                </span>
                <span className="absolute left-0 bottom-0 w-16 h-0.5 bg-gradient-to-r from-teal-400 to-cyan-600"></span>
              </h2>

              <div className="space-y-4">
                {form.education.map((edu: any, i: any) => (
                  <div key={i} className="group relative pl-6">
                    <div className="absolute left-0 top-1 w-3 h-3 rounded-full bg-cyan-400 group-hover:animate-pulse"></div>
                    <div className="absolute left-1.5 top-4 bottom-0 w-0.5 bg-gray-700"></div>
                    <div>
                      <h3 className="font-semibold text-gray-100">{edu.degree || "Bachelor OF Technology"}</h3>
                      <p className="text-sm text-gray-400">{edu.institute || "Indian Institute Of Bombay"}</p>
                      <p className="text-xs text-gray-500 mt-1">{edu.year || "2022-2026"}</p>
                    </div>
                  </div>
                ))}
              </div>

            </motion.section>
          </div>



          <div className="w-8/12 space-y-3 col-span-">
            {/* Skills */}
            <motion.section
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-gray-800/50 border border-gray-700 rounded-xl p-6"
            >
              <h2 className="text-2xl font-bold mb-6 relative">
                <span className="bg-gradient-to-r from-teal-400 to-cyan-600 bg-clip-text text-transparent">
                  Skills
                </span>
                <span className="absolute left-0 bottom-0 w-16 h-0.5 bg-gradient-to-r from-teal-400 to-cyan-600"></span>
              </h2>

              <div className="space-y-6">
                {Array.isArray(form.skill) && form.skill.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {console.log(form.skill)}
                    {form.skill.map((skill: any, i: any) => (
                      <span
                        key={i}
                        className="text-xs px-3 py-1.5 rounded-full bg-gray-700/80 border border-gray-600 text-gray-200 hover:bg-teal-400/10 hover:border-teal-400/50 hover:text-teal-300 transition-all"
                      >
                        {skill || "HTML"}
                      </span>
                    ))}
                  </div>
                )}

              </div>
            </motion.section>

            {/* Education */}
            <motion.section
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="bg-gray-800/50 border border-gray-700 rounded-xl p-6"
            >
              <h2 className="text-2xl font-bold mb-6 relative">
                <span className="bg-gradient-to-r from-teal-400 to-cyan-600 bg-clip-text text-transparent">
                  Education
                </span>
                <span className="absolute left-0 bottom-0 w-16 h-0.5 bg-gradient-to-r from-teal-400 to-cyan-600"></span>
              </h2>
              <div className="flex flex-col gap-2">
                {form.projects.map((proj: any, i: any) => (
                  <div
                    key={i}
                    className="bg-gray-800/50 border border-gray-700 rounded-+lg p-4 hover:border-teal-400/30 transition-all duration-300 hover:shadow-lg hover:shadow-teal-400/10"
                  >
                    <h3 className="font-semibold text-gray-100 mb-2">{proj.project_title || "AI Resume Generator"}</h3>
                    <p className="text-gray-400 text-sm mb-3">{proj.description
                      || "Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatum consequatur aperiam quisquam molestias optio nemo quia ipsa ducimus, debitis laborum est consectetur fugiat qui modi, eligendi repellendus eum, dolore accusantium."}</p>
                    {proj.technologies && (
                      <div className="flex flex-wrap gap-2 mt-3 w-4/12">
                        {proj.technologies.map((tech: any, j: any) => (
                          <span
                            key={j}
                            className="text-xs px-2 py-1 rounded-full bg-gray-700 text-teal-300"
                          >
                            {tech || "HTML CSS JAVA"}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </motion.section>

            {/* Languages */}
            <motion.section
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="bg-gray-800/50 border border-gray-700 rounded-xl p-6"
            >
              <h2 className="text-2xl font-bold mb-4 relative">
                <span className="bg-gradient-to-r from-teal-400 to-cyan-600 bg-clip-text text-transparent">
                  Languages
                </span>
                <span className="absolute left-0 bottom-0 w-16 h-0.5 bg-gradient-to-r from-teal-400 to-cyan-600"></span>
              </h2>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">English</span>
                  <span className="text-xs text-gray-400">Professional</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-1.5">
                  <div className="bg-teal-400 h-1.5 rounded-full w-full"></div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Hindi</span>
                  <span className="text-xs text-gray-400">Native</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-1.5">
                  <div className="bg-cyan-400 h-1.5 rounded-full w-full"></div>
                </div>
              </div>
            </motion.section>
          </div>

          
        </div>
      </div>
    </div>
  );
};


export default TemplateThree;
