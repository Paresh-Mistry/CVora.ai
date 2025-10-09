import React from "react";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Card } from "../ui/card";
import clsx from "clsx";

const Hero: React.FC = () => {
  return (
    <section className="container max-w-7xl mx-auto py-16 px-4 relative overflow-hidden">
      <div className="absolute bg-gradient-to-r from-blue-50 via-transparent to-pink-50 opacity-50 -z-10" />

      <div className="flex flex-col md:flex-row items-center justify-between gap-14">
        {/* LEFT: Text Section */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="space-y-8 text-center md:text-left max-w-lg"
        >
          <Badge
            variant="secondary"
            className="md:hidden text-xs font-medium px-3 rounded-full"
          >
            Get Hired
          </Badge>

          <h1 className="text-4xl md:text-5xl xl:text-6xl font-semibold leading-tight tracking-tight text-[#11a8e4]">
            Build Your <br />
            <span className={clsx("orbitron-head" ,"text-[#212834] font-orbitron")}>
              AI-Powered Resume
            </span>
            <br /> in Minutes
          </h1>

          <p className="text-gray-500 max-w-xl md:text-lg font-light">
            Design, customize, and download a professional CV with our smart
            editor. Save time. Impress recruiters. Land the job.
          </p>

          <div className="flex justify-center md:justify-start">
            <Button
              asChild
              size="lg"
              className="bg-[#212834] hover:bg-[#11151a] rounded-xl shadow-lg transition-all duration-300 gap-2"
            >
              <a href="/dashboard">
                Start Explore <ArrowRight size={18} />
              </a>
            </Button>
          </div>
        </motion.div>

        {/* RIGHT: Image Section */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
          className="relative"
        >
          <Card className="overflow-hidden rounded-3xl border-0 shadow-2xl shadow-blue-200 hover:scale-[1.02] transition-all duration-300">
            <img
              src="https://resumegenius.com/wp-content/uploads/picture-photo-resume-template-black-Hub.png"
              alt="Resume Preview"
              className="w-[22rem] h-auto object-cover"
            />
          </Card>

          {/* Fancy Glow Effect */}
          <div className="absolute -inset-2 bg-gradient-to-r from-blue-300 to-pink-300 blur-3xl opacity-20 -z-10" />
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
