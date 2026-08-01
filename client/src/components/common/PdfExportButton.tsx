// PdfExportButton.tsx
import { useRef, useState, useEffect, ReactNode } from "react";
import { createPortal } from "react-dom";
import { Button } from "../ui/button";
import { Download } from "lucide-react";
import { A4_HEIGHT_PX, A4_WIDTH_PX } from "../../constants";

export async function exportToPDF(el: HTMLElement, filename = "resume.pdf") {
  const [{ toPng }, { jsPDF }] = await Promise.all([
    import("html-to-image"),
    import("jspdf"),
  ]);

  const elWidth = el.scrollWidth;
  const elHeight = el.scrollHeight;
  const imgData = await toPng(el, { pixelRatio: 2, width: elWidth, height: elHeight });

  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "px",
    format: [A4_WIDTH_PX, A4_HEIGHT_PX],
    hotfixes: ["px_scaling"],
  });

  const totalPages = Math.ceil(elHeight / A4_HEIGHT_PX);
  for (let page = 0; page < totalPages; page++) {
    if (page > 0) pdf.addPage([A4_WIDTH_PX, A4_HEIGHT_PX]);
    pdf.addImage(imgData, "PNG", 0, -(page * A4_HEIGHT_PX), elWidth, elHeight);
  }
  pdf.save(filename);
}

interface PDFExportButtonProps {
  resumeName?: string;
  disabled?: boolean;
  previewRef?: React.RefObject<HTMLDivElement | null>;
  renderHidden?: () => ReactNode;
}

export function PDFExportButton({
  previewRef,
  renderHidden,
  resumeName,
  disabled,
}: PDFExportButtonProps) {
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const hiddenRef = useRef<HTMLDivElement>(null);

  const filename = resumeName
    ? `${resumeName.replace(/\s+/g, "_")}_resume.pdf`
    : "resume.pdf";

  const runExport = async (el: HTMLDivElement | null) => {
    if (!el) return;
    try {
      await exportToPDF(el, filename);
    } catch (err) {
      console.error("PDF export failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleClick = () => {
    setLoading(true);
    if (renderHidden) {
      setMounted(true); // paint the hidden copy; effect below captures it once rendered
    } else {
      runExport(previewRef?.current ?? null);
    }
  };

  // Only fires in Case B, right after the hidden node has painted.
  useEffect(() => {
    if (!mounted) return;
    const id = requestAnimationFrame(async () => {
      await runExport(hiddenRef.current);
      setMounted(false);
    });
    return () => cancelAnimationFrame(id);
  }, [mounted]);

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={handleClick}
        disabled={loading || disabled}
        className="text-xs h-7 px-2.5 border-gray-200 gap-1 whitespace-nowrap"
      >
        {loading ? (
          <>
            <span className="animate-spin inline-block w-3 h-3 border border-gray-400 border-t-transparent rounded-full" />
            <span className="hidden sm:inline">Generating…</span>
          </>
        ) : (
          <>
            <Download size={10} /> <span className="hidden sm:inline">Download PDF</span>
          </>
        )}
      </Button>

      {mounted &&
        renderHidden &&
        createPortal(
          <div
            ref={hiddenRef}
            style={{ position: "fixed", top: -99999, left: -99999, pointerEvents: "none" }}
          >
            {renderHidden()}
          </div>,
          document.body
        )}
    </>
  );
}