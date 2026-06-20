import {
  Search,
  ZoomIn,
  Maximize2,
} from "lucide-react";

export default function ResumeToolbar() {
  return (
    <div className="fixed bottom-4 right-10 z-20 inline-flex items-center bg-[#f3f4f8] rounded-full shadow-lg px-4 py-2 gap-4">
      {/* Zoom Out */}
      <button className="flex items-center justify-center text-gray-500 hover:text-gray-700">
        <Search className="w-4 h-4" />
      </button>

      {/* Zoom Percentage */}
      <span className="text-xs font-semibold text-gray-600 min-w-[40px]">
        85%
      </span>

      <div className="h-6 w-px bg-gray-300" />

      {/* Zoom In */}
      <button className="flex items-center justify-center text-gray-500 hover:text-gray-700">
        <ZoomIn className="w-4 h-4" />
      </button>

      <div className="h-6 w-px bg-gray-300" />

      {/* Template Label */}
      <span className="text-xs font-bold tracking-wide text-gray-600">
        TEMPLATE
      </span>

      {/* Theme Colors */}
      <div className="flex items-center gap-2">
        <button className="w-5 h-5 rounded-full bg-[#123f91] border-2 border-white shadow-md" />
        <button className="w-5 h-5 rounded-full bg-[#3569ff] border-2 border-white shadow-md" />
        <button className="w-5 h-5 rounded-full bg-[#10a66e] border-2 border-white shadow-md" />
      </div>

      <div className="h-6 w-px bg-gray-300" />

      {/* Fullscreen */}
      <button className="flex items-center justify-center text-[#3569ff] hover:scale-110 transition">
        <Maximize2 className="w-4 h-4" />
      </button>
    </div>
  );
}