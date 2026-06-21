  import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../ui/button";
import MiniResumeThumbnail from "./MiniResumeThumbnail";
import ResumeToolbar from "./ResumeToolBar";
import { AI_QUICK_PROMPTS, SCORE_CHECKS, TABS } from "../../constants";
import { Badge } from "../ui/badge";
import { Download, Link } from "lucide-react";
import { useTemplates, useAIGenerate, useATSScore, useCredits } from "../../hooks/useAI";
import { useUser } from "../../hooks/useAuth";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ResumeRightPanelProps {
  form: any;
  DefaultData: any;
  activeTmpl: any;
  ActiveLayout: React.ComponentType<{ d: any; tk: any }>;
}

type TabId = (typeof TABS)[number]["id"];

// ─── PDF helpers ──────────────────────────────────────────────────────────────

const A4_HEIGHT_PX = 1122;
const A4_WIDTH_PX  = 794;

function PagedResumeWrapper({ children }: { children: React.ReactNode }) {
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

async function exportToPDF(
  previewRef: React.RefObject<HTMLDivElement>,
  filename = "resume.pdf"
) {
  const [{ toPng }, { jsPDF }] = await Promise.all([
    import("html-to-image"),
    import("jspdf"),
  ]);
  if (!previewRef.current) return;
  const el       = previewRef.current;
  const elWidth  = el.scrollWidth;
  const elHeight = el.scrollHeight;
  const imgData  = await toPng(el, { pixelRatio: 2, width: elWidth, height: elHeight });
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

function PDFExportButton({
  previewRef,
  resumeName,
}: {
  previewRef: React.RefObject<HTMLDivElement>;
  resumeName?: string;
}) {
  const [loading, setLoading] = useState(false);

  const handleExport = async () => {
    setLoading(true);
    try {
      const filename = resumeName
        ? `${resumeName.replace(/\s+/g, "_")}_resume.pdf`
        : "resume.pdf";
      await exportToPDF(previewRef, filename);
    } catch (err) {
      console.error("PDF export failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleExport}
      disabled={loading}
      className="text-xs h-7 px-2.5 border-gray-200 gap-1"
    >
      {loading ? (
        <>
          <span className="animate-spin inline-block w-3 h-3 border border-gray-400 border-t-transparent rounded-full" />
          Generating…
        </>
      ) : (
        <>
          <Download size={10} /> Download PDF
        </>
      )}
    </Button>
  );
}

function SubmitFirstNotice({ feature }: { feature: string }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-3 p-8 text-center">
      <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-2xl">
        🔒
      </div>
      <p className="text-sm font-medium text-gray-700">Submit your resume first</p>
      <p className="text-xs text-gray-400 max-w-[200px]">
        Complete and submit the form to unlock {feature}.
      </p>
    </div>
  );
}


// ── Preview ────────────────────────────────────────────────────────────────

function PreviewTab({
  form,
  DefaultData,
  activeTmpl,
  ActiveLayout,
  previewRef,
}: {
  form: any;
  DefaultData: any;
  activeTmpl: any;
  ActiveLayout: React.ComponentType<{ d: any; tk: any }>;
  previewRef: React.RefObject<HTMLDivElement>;
}) {
  const data = form.name !== "" ? form : DefaultData;
  console.log("Preview actL : ",activeTmpl)

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-auto bg-[#f7f4f0] flex items-start justify-center p-2.5">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="bg-white shadow-lg border border-gray-200 overflow-auto w-full"
          style={{ scrollbarColor: "transparent transparent" }}
        >
          <div ref={previewRef} style={{ background: "#fff" }}>
            <PagedResumeWrapper>
              <ActiveLayout d={data} tk={activeTmpl?.tokens} />
            </PagedResumeWrapper>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// ── Templates ──────────────────────────────────────────────────────────────
// CHANGE 2: Removed resumeId prop and useUpdateResume call entirely.
// Template switch is now local-only — no backend call until Submit.

function TemplatesTab({
  selectedTmpl,
  onSelect,
}: {
  selectedTmpl: string;
  onSelect: (id: string) => void;
}) {
  const { data: templates, isLoading } = useTemplates();
  const { data: user }                 = useUser();

  const handleSelect = (id: string, isPremium: boolean) => {
    if (isPremium && user?.plan !== "premium") return;
    onSelect(id);
  };

  if (isLoading) {
    return (
      <div className="p-4 flex items-center justify-center h-32 text-xs text-gray-400">
        Loading templates…
      </div>
    );
  }

  return (
    <div className="p-4 overflow-y-auto flex flex-col gap-4">
      <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
        Choose a template
      </p>
      <div className="grid grid-cols-3 gap-3">
        {templates?.map((tmpl) => {
          const locked = tmpl.is_premium && user?.plan !== "premium";
          return (
            <button
              key={tmpl.id}
              onClick={() => handleSelect(tmpl.id, tmpl.is_premium)}
              disabled={locked}
              title={locked ? "Upgrade to Premium to use this template" : tmpl.name}
              className={`text-left relative rounded-xl border transition-all overflow-hidden
                          group focus:outline-none
                          ${selectedTmpl === tmpl.id
                            ? "border-blue-500 border-2 shadow-sm"
                            : locked
                            ? "border-gray-100 opacity-50 cursor-not-allowed"
                            : "border-gray-200 hover:border-blue-300 hover:shadow-sm"
                          }`}
            >
              <div className="flex items-center justify-center bg-gray-50">
                <MiniResumeThumbnail tmpl={tmpl} scale={0.285} />
              </div>

              {/* Name badge */}
              <div
                className="px-2.5 py-1 absolute z-20 flex items-center rounded-full bottom-2 right-2"
                style={{
                  backgroundColor:
                    tmpl.preview_bg === "#ffffff"
                      ? "#111"
                      : (tmpl.tokens?.accent ?? "#111"),
                }}
              >
                <span className="text-[10px] font-medium text-white">{tmpl.name}</span>
              </div>

              {/* Active check */}
              {selectedTmpl === tmpl.id && (
                <div className="absolute top-2 left-2 w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center z-30">
                  <span className="text-white text-[10px] font-bold">✓</span>
                </div>
              )}

              {/* Premium lock */}
              {locked && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/60 rounded-xl z-20">
                  <span className="text-[10px] font-semibold text-yellow-600 bg-yellow-50 border border-yellow-200 px-2 py-0.5 rounded-full">
                    ⭐ Premium
                  </span>
                </div>
              )}
            </button>
          );
        })}
      </div>

      <div className="flex items-start gap-2 bg-blue-50 border border-blue-100 rounded-lg p-3 text-xs text-blue-700">
        <span className="text-sm mt-px">ℹ</span>
        <span>Switching templates preserves all your data. Nothing is lost.</span>
      </div>
    </div>
  );
}

// ── AI Generate ────────────────────────────────────────────────────────────
// CHANGE 3: Takes resumeId prop. Shows SubmitFirstNotice when null.
// All API calls are gated on resumeId existing.

function AiTab({ resumeId }: { resumeId: string | null }) {
  const [prompt, setPrompt]   = useState("");
  const generate              = useAIGenerate();
  const { data: credits }     = useCredits();
  const aiCredits             = credits?.ai;
  const noCredits             = (aiCredits?.remaining ?? 1) === 0;

  // Show locked state until resume is submitted
  if (!resumeId) return <SubmitFirstNotice feature="AI suggestions" />;

  const handleGenerate = (customPrompt?: string) => {
    generate.mutate(
      { resume_id: resumeId, prompt: customPrompt ?? (prompt.trim() || undefined) },
      { onSuccess: () => setPrompt("") }
    );
  };

  return (
    <div className="p-4 overflow-y-auto flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
          AI suggestions
        </p>
        {aiCredits && (
          <span className="text-[10px] text-gray-400">
            {aiCredits.remaining}/{aiCredits.total} credits
          </span>
        )}
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 flex flex-col gap-2">
        <textarea
          rows={3}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g. Make my experience section sound more impactful for a senior role…"
          className="w-full text-sm bg-transparent resize-none text-gray-800 placeholder-gray-400 focus:outline-none"
          disabled={noCredits}
        />
        <div className="flex justify-end">
          <Button
            size="sm"
            onClick={() => handleGenerate()}
            disabled={!prompt.trim() || generate.isPending || noCredits}
            className="text-xs h-7 px-3 bg-blue-600 hover:bg-blue-700 text-white"
          >
            {generate.isPending ? "Generating…" : "✦ Generate"}
          </Button>
        </div>
      </div>

      {generate.isSuccess && (
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 text-xs text-blue-800 whitespace-pre-wrap leading-relaxed">
          {generate.data.insight}
        </div>
      )}
      {generate.isError && (
        <p className="text-xs text-red-500">
          {(generate.error as any)?.response?.data?.detail ?? "Generation failed. Try again."}
        </p>
      )}

      <p className="text-xs font-medium uppercase tracking-wide text-gray-400">Quick prompts</p>
      <div className="flex flex-wrap gap-2">
        {AI_QUICK_PROMPTS.map(({ emoji, label, prompt: p }: any) => (
          <button
            key={label}
            onClick={() => handleGenerate(p)}
            disabled={generate.isPending || noCredits}
            className="text-xs px-3 py-1.5 border border-gray-200 rounded-full text-gray-600
                       hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 transition-all
                       disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {emoji} {label}
          </button>
        ))}
      </div>

      {noCredits && (
        <div className="flex items-start gap-2 bg-amber-50 border border-amber-100 rounded-lg p-3 text-xs text-amber-700">
          <span>💡</span>
          <span>You've used all free AI credits. Upgrade to premium for 150 credits.</span>
        </div>
      )}
    </div>
  );
}

// ── Score (ATS) ────────────────────────────────────────────────────────────
// CHANGE 4: Shows SubmitFirstNotice when resumeId is null.

function ScoreTab({ resumeId }: { resumeId: string | null }) {
  const ats               = useATSScore();
  const { data: credits } = useCredits();
  const [jd, setJd]       = useState("");
  const score             = ats.data?.score ?? 0;
  const circumference     = 2 * Math.PI * 28;
  const offset            = circumference - (score / 100) * circumference;
  const noCredits         = (credits?.ats.remaining ?? 1) === 0;

  if (!resumeId) return <SubmitFirstNotice feature="ATS scoring" />;

  return (
    <div className="p-4 overflow-y-auto flex flex-col gap-4">
      <p className="text-xs font-medium uppercase tracking-wide text-gray-400">ATS Score</p>

      {!ats.isSuccess ? (
        <>
          <textarea
            rows={3}
            value={jd}
            onChange={(e) => setJd(e.target.value)}
            placeholder="Paste job description to get a tailored ATS score (optional)"
            className="w-full text-sm border border-gray-200 rounded-xl p-3 resize-none focus:outline-none focus:border-blue-400"
          />
          <Button
            size="sm"
            onClick={() =>
              ats.mutate({ resume_id: resumeId, job_description: jd || undefined })
            }
            disabled={ats.isPending || noCredits}
            className="text-xs"
          >
            {ats.isPending ? "Analysing…" : "Check ATS Score"}
          </Button>
          <p className="text-[10px] text-gray-400">
            {credits?.ats.remaining ?? 0}/{credits?.ats.total ?? 1} credits remaining
          </p>
        </>
      ) : (
        <>
          {/* Score ring */}
          <div className="flex items-center gap-4 bg-gray-50 border border-gray-200 rounded-xl p-4">
            <svg width="72" height="72" viewBox="0 0 72 72">
              <circle cx="36" cy="36" r="28" fill="none" stroke="#e5e7eb" strokeWidth="6" />
              <circle
                cx="36" cy="36" r="28" fill="none"
                stroke={score >= 70 ? "#16a34a" : score >= 40 ? "#d97706" : "#dc2626"}
                strokeWidth="6"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                strokeLinecap="round"
                transform="rotate(-90 36 36)"
                style={{ transition: "stroke-dashoffset 0.6s ease" }}
              />
              <text x="36" y="41" textAnchor="middle" fontSize="14" fontWeight="600" fill="#111827">
                {score}
              </text>
            </svg>
            <div>
              <div className="text-base font-semibold text-gray-900">
                {score >= 70 ? "Good" : score >= 40 ? "Needs work" : "Poor"}
              </div>
              <div className="text-xs text-gray-500 mt-0.5">
                {ats.data?.suggestions?.[0] ?? "Add more keywords from the job description."}
              </div>
              <Button
                variant="outline" size="sm"
                className="mt-2 text-xs h-7 px-2.5 border-gray-200"
                onClick={() => ats.reset()}
              >
                Re-check
              </Button>
            </div>
          </div>

          {/* Missing keywords */}
          {(ats.data?.missing_keywords?.length ?? 0) > 0 && (
            <div>
              <p className="text-xs font-medium text-gray-600 mb-2">Missing keywords</p>
              <div className="flex flex-wrap gap-1.5">
                {ats.data!.missing_keywords.map((kw) => (
                  <span key={kw}
                    className="text-[10px] bg-red-50 text-red-600 border border-red-100 px-2 py-0.5 rounded-full">
                    {kw}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Suggestions list */}
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            {(ats.data?.suggestions ?? SCORE_CHECKS.map((s: any) => s.label)).map(
              (s: string, i: number, arr: string[]) => (
                <div
                  key={i}
                  className={`flex items-center gap-2.5 px-3 py-2.5 text-xs text-gray-700 ${
                    i < arr.length - 1 ? "border-b border-gray-100" : ""
                  }`}
                >
                  <span className="text-blue-400">→</span> {s}
                </div>
              )
            )}
          </div>
        </>
      )}
    </div>
  );
}


// ─── Main component ───────────────────────────────────────────────────────────

export default function ResumeRightPanel({
  form,
  DefaultData,
  activeTmpl,
  ActiveLayout,
}: ResumeRightPanelProps) {
  const [activeTab,      setActiveTab]      = useState<TabId>("preview");
  const [selectedTmpl,   setSelectedTmpl]   = useState(activeTmpl?.id ?? "");
  const [localActiveTmpl, setLocalActiveTmpl] = useState(activeTmpl);
  const [resumeId] = useState<string | null>(null);

  const { data: templates } = useTemplates();
  const previewRef          = useRef<HTMLDivElement>(null);
  const resumeName          = (form.name !== "" ? form.name : DefaultData?.name) ?? "resume";

  // CHANGE 6: Template switch only updates local state — no backend call.
  const handleTemplateSelect = useCallback(
    (id: string) => {
      setSelectedTmpl(id);
      const found = templates?.find((t) => t.id === id);
      if (found) setLocalActiveTmpl(found);
      setActiveTab("preview");
    },
    [templates]
  );

  const displayTmpl = localActiveTmpl ?? activeTmpl;

  return (
    <div className="md:w-7/12 flex flex-col border-l border-gray-200 bg-white">
      <ResumeToolbar />

      {/* ── Tab bar + quick actions ── */}
      <div className="flex justify-between items-end border-b border-gray-200">
        <div className="flex items-end gap-0.5 px-3 pt-2 bg-gray-50 overflow-x-auto scrollbar-none flex-shrink-0">
          {TABS.map((tab: any) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs rounded-t-lg whitespace-nowrap
                          transition-all border border-b-0 focus:outline-none
                          ${activeTab === tab.id
                            ? "bg-white text-gray-900 border-gray-200 font-medium shadow-sm"
                            : "bg-transparent text-gray-500 border-transparent hover:bg-white/60 hover:text-gray-700"
                          }`}
            >
              <span className="text-sm leading-none">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex-shrink-0 flex items-center gap-2 px-3 pb-1.5">
          <Badge variant="secondary" className="text-[10px]">
            {displayTmpl?.name ?? "—"}
          </Badge>
          <PDFExportButton previewRef={previewRef} resumeName={resumeName} />
          <Button variant="outline" size="sm" className="text-xs h-7 gap-1">
            <Link size={10} /> Share
          </Button>
        </div>
      </div>

      {/* ── Tab content ── */}
      <div className="flex-1 overflow-hidden relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18 }}
            className="absolute inset-0 flex flex-col"
          >
            {activeTab === "preview" && (
              <PreviewTab
                form={form}
                DefaultData={DefaultData}
                activeTmpl={displayTmpl}
                ActiveLayout={ActiveLayout}
                previewRef={previewRef}
              />
            )}
            {activeTab === "templates" && (
              <TemplatesTab
                selectedTmpl={selectedTmpl}
                onSelect={handleTemplateSelect}
              />
            )}
            {activeTab === "ai"    && <AiTab    resumeId={resumeId} />}
            {activeTab === "score" && <ScoreTab resumeId={resumeId} />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}