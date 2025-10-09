import React, { useState } from "react";
import { motion } from "framer-motion";
import Layout from "../Layout/PageLayout";
import TemplateCard from "../components/common/ResumeTemplateCard";
import { getAllTemplate } from "../templates/TemplateManager";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";

const Generate: React.FC = () => {
  const [search, setSearch] = useState("");
  const templates = getAllTemplate();

  const filteredTemplates = templates?.filter((template) =>
    template.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Layout>
      <section className="container max-w-7xl mx-auto py-14 px-4">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-[#212834] leading-tight">
              Find Your
              <span className="ml-2 bg-gradient-to-r from-[#11a8e4] to-[#63c5ea] bg-clip-text text-transparent mozilla-headline-hero">
                Resume’s
              </span>
            </h1>
            <p className="text-gray-500 mt-2 text-sm md:text-base">
              Choose from a variety of elegant, modern, and professional templates.
            </p>
          </div>

          {/* Search Input */}
          <div className="w-full sm:w-80">
            <Input
              type="text"
              placeholder="Search template..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="rounded-lg border-gray-200 focus:ring-2 focus:ring-[#11a8e4]"
            />
          </div>
        </div>

        {/* Grid Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 place-items-center"
        >
          {filteredTemplates && filteredTemplates.length > 0 ? (
            filteredTemplates.map((template) => (
              <motion.div
                key={template.id}
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="w-full"
              >
                <TemplateCard {...template} />
              </motion.div>
            ))
          ) : (
            <div className="col-span-full text-center text-gray-400 py-10">
              <Badge
                variant="secondary"
                className="bg-gray-100 text-gray-600 text-sm px-4 py-2 rounded-full"
              >
                No templates found
              </Badge>
            </div>
          )}
        </motion.div>
      </section>
    </Layout>
  );
};

export default Generate;
