import { motion } from "framer-motion";
import { ResponsivePageScaler, PagedResumeWrapper } from "./PageScaler";

interface ResumePreviewProps {
  data: any;
  activeTmpl: any;
  ActiveLayout: React.ComponentType<{ d: any; tk: any }>;
  previewRef?: React.RefObject<HTMLDivElement | null>;
  enableScaling?: boolean;
}

export default function ResumePreview({
  data,
  activeTmpl,
  ActiveLayout,
  previewRef,
  enableScaling = true,
}: ResumePreviewProps) {

  const resume = (
    <div ref={previewRef} style={{ background: "#fff" }}>
      <PagedResumeWrapper>
        <ActiveLayout
          d={data}
          tk={activeTmpl?.tokens}
        />
      </PagedResumeWrapper>
    </div>
  );

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-auto flex items-start justify-center">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="bg-white shadow-lg border border-gray-200 overflow-hidden w-full max-w-full"
        >
          
          {enableScaling ? (
            <ResponsivePageScaler>
              {resume}
            </ResponsivePageScaler>
          ) : (
            resume
          )}
        </motion.div>
      </div>
    </div>
  );
}