import { useEffect, useRef, useState } from "react";
import { A4_HEIGHT_PX, A4_WIDTH_PX } from "../../constants";

export function PagedResumeWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ width: A4_WIDTH_PX, position: "relative" }}>
      <div
        style={{
          width: A4_WIDTH_PX,
          backgroundImage: `repeating-linear-gradient(
            to bottom,
            transparent 0px,
            transparent ${A4_HEIGHT_PX - 2}px,
            #cbd5e1 ${A4_HEIGHT_PX - 2}px,
            #cbd5e1 ${A4_HEIGHT_PX}px
          )`,
        }}
      >
        {children}
      </div>
    </div>
  );
}

// Scales the true-A4-px page down to fit the available width on small screens,
// without changing the underlying DOM size — previewRef stays attached to the
// unscaled node so exportToPDF's scrollWidth/scrollHeight capture is unaffected.
export function ResponsivePageScaler({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [contentHeight, setContentHeight] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const inner = container.firstElementChild as HTMLElement | null;

    const recompute = () => {
      const containerWidth = container.clientWidth;
      const naturalWidth = inner?.scrollWidth || A4_WIDTH_PX;
      const naturalHeight = inner?.scrollHeight || A4_HEIGHT_PX;
      const nextScale = Math.min(1, containerWidth / naturalWidth);
      setScale(nextScale);
      setContentHeight(naturalHeight * nextScale);
    };

    recompute();

    const resizeObserver = new ResizeObserver(recompute);
    resizeObserver.observe(container);
    if (inner) resizeObserver.observe(inner);

    return () => resizeObserver.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="w-full" style={{ height: contentHeight || undefined }}>
      <div
        style={{
          transform: `scale(${scale})`,
          transformOrigin: "top left",
          width: A4_WIDTH_PX,
        }}
      >
        {children}
      </div>
    </div>
  );
}
