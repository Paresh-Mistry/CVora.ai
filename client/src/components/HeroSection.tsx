import { ArrowRight } from 'lucide-react';
import React from 'react';

const Hero: React.FC = () => {
  return (
    <section className="container max-w-7xl mx-auto py-16 px-4">
      <div className="flex flex-col md:flex-row items-center justify-between gap-10">
        
        {/* Left: Text Section */}
        <div className="space-y-8 text-center md:text-left">
          <span className="bg-blue-100 md:hidden text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">Get Hired</span>
          <h1 className="text-4xl md:text-5xl xl:text-6xl font-medium leading-tight tracking-tight md:mt-0 mt-3 text-[#11a8e4]">
            Build Your <br/><span className="text-[#212834] orbitron-head">AI-Powered Resume</span><br/> in Minutes
          </h1>
          <p className="text-gray-400 max-w-xl md:text-lg mozilla-headline-hero">
            Design, customize, and download a professional CV with our smart editor. Save time. Impress recruiters. Land the job.
          </p>

          <div className="flex justify-center md:justify-start">
            <a
              href="/dashboard"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#212834] text-white text-sm font-medium rounded-xl shadow-md transition-all duration-200"
            >
              Start Explore <ArrowRight size={18} />
            </a>
          </div>
        </div>

        {/* Right: Image Section */}
        <div className="w-full md:w-auto">
          <img
            src="https://resumegenius.com/wp-content/uploads/picture-photo-resume-template-black-Hub.png"
            alt="Resume Preview"
            className="w-96 h-100 rounded-3xl border-r-4 border-blue-300/40 shadow-blue-300/40 shadow-lg"
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
