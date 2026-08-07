import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../ui/button";
import MiniResumeThumbnail from "./MiniResumeThumbnail";
import { AI_QUICK_PROMPTS, SCORE_CHECKS, TABS } from "../../constants";
import { Badge } from "../ui/badge";
import { useTemplates, useAIGenerate, useATSScore, useCredits } from "../../hooks/useAI";
import { useUser } from "../../hooks/useAuth";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import { PDFExportButton } from "./PdfExportButton";
import { ResumeRightPanelProps } from "../../services/resume.services"
import { PreviewTab } from "./PreviewTab";
import { useResumeRightPanelStore } from "../../store/resumePanel.store";
import ReactMarkdown from "react-markdown"

function useIsMobile(breakpointPx = 768) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${breakpointPx - 1}px)`);
    const update = () => setIsMobile(mql.matches);
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, [breakpointPx]);

  return isMobile;
}

type TabId = (typeof TABS)[number]["id"];

function TemplatesTab({
  selectedTmpl,
  onSelect,
}: {
  selectedTmpl: string;
  onSelect: (id: string) => void;
}) {
  const { data: templates, isLoading } = useTemplates();
  const { data: user } = useUser();

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
    <div className="p-3 sm:p-4 overflow-y-auto flex flex-col gap-4">
      <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
        Choose a template
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3">
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
                className="px-2 sm:px-2.5 py-1 absolute z-20 flex items-center rounded-full bottom-2 right-2 max-w-[calc(100%-1rem)]"
                style={{
                  backgroundColor:
                    tmpl.preview_bg === "#ffffff"
                      ? "#111"
                      : (tmpl.tokens?.accent ?? "#111"),
                }}
              >
                <span className="text-[9px] sm:text-[10px] font-medium text-white truncate">{tmpl.name}</span>
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

function AiTab({ resumeId }: { resumeId: string | null }) {
  const [prompt, setPrompt] = useState("");
  const generate = useAIGenerate();
  const { data: credits } = useCredits();
  const aiCredits = credits?.ai;
  const noCredits = (aiCredits?.remaining ?? 1) === 0;

  // Show locked state until resume is submitted
  if (!resumeId) return "AI Suggestions";

  const handleGenerate = (customPrompt?: string) => {
    generate.mutate(
      { resume_id: resumeId, prompt: customPrompt ?? (prompt.trim() || undefined) },
      { onSuccess: () => setPrompt("") }
    );
  };

  return (
    <div className="p-3 sm:p-4 overflow-y-auto flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-1">
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
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 text-sm text-blue-800 whitespace-pre-wrap leading-relaxed">
          <ReactMarkdown>{generate.data.insight}</ReactMarkdown>
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




function ScoreTab({ resumeId }: { resumeId: string | null }) {
  const ats = useATSScore();
  const { data: credits } = useCredits();
  const [jd, setJd] = useState("");
  const score = ats.data?.score ?? 0;
  const circumference = 2 * Math.PI * 28;
  const offset = circumference - (score / 100) * circumference;
  const noCredits = (credits?.ats.remaining ?? 1) === 0;

  if (!resumeId) return "ATS Scoring";

  return (
    <div className="p-3 sm:p-4 overflow-y-auto flex flex-col gap-4">
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
          <div className="flex flex-wrap items-center gap-4 bg-gray-50 border border-gray-200 rounded-xl p-4">
            <svg width="72" height="72" viewBox="0 0 72 72" className="shrink-0">
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
            <div className="min-w-0">
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
                  className={`flex items-center gap-2.5 px-3 py-2.5 text-xs text-gray-700 ${i < arr.length - 1 ? "border-b border-gray-100" : ""
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


const TAB_LABELS: Record<TabId, string> = TABS.reduce(
  (acc: Record<TabId, string>, t: any) => ({ ...acc, [t.id]: t.label }),
  {} as Record<TabId, string>
);

export default function ResumeRightPanel({
  form,
  DefaultData,
  activeTmpl,
  ActiveLayout,
  resumeId
}: ResumeRightPanelProps) {

  const {
    activeTab,
    selectedTmpl,
    localActiveTmpl,
    mobileSheetOpen,
    selectTemplate,
    openTab,
    setMobileSheetOpen,
  } = useResumeRightPanelStore();

  const isMobile = useIsMobile();
  const { data: templates } = useTemplates();
  const previewRef = useRef<HTMLDivElement>(null);
  const resumeName = (form.name !== "" ? form.name : DefaultData?.name) ?? "resume";

  // CHANGE 6: Template switch only updates local state — no backend call.
  const handleTemplateSelect = useCallback(
    (id: string) => {
      selectTemplate(id, templates);
    },
    [selectTemplate, templates]
  );

  const handleTabClick = (id: TabId) => {
    openTab(id, isMobile);
  };

  const displayTmpl = localActiveTmpl ?? activeTmpl;

  const renderTabContent = () => (
    <>
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
      {activeTab === "ai" && <AiTab resumeId={resumeId} />}
      {activeTab === "score" && <ScoreTab resumeId={resumeId} />}
    </>
  );

  return (
    <div className="md:w-7/12 flex flex-col border-l border-gray-200 bg-white min-w-0">
      <div className="flex md:static fixed w-full bottom-0 flex-wrap sm:flex-nowrap justify-between items-end gap-y-1 border-b border-gray-200">
        <div className="flex items-end gap-0.5 px-2 sm:px-3 pt-2 bg-gray-50 overflow-x-auto scrollbar-none flex-shrink min-w-0">
          {TABS.map((tab: any) => (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-2 text-xs rounded-t-lg whitespace-nowrap
                          transition-all border border-b-0 focus:outline-none
                          ${activeTab === tab.id
                  ? "bg-white text-gray-900 border-gray-200 font-medium shadow-sm"
                  : "bg-transparent text-gray-500 border-transparent hover:bg-white/60 hover:text-gray-700"
                }`}
            >
              <span className="lg:text-sm text-xl text leading-none">{tab.icon}</span>
              <span className="hidden xs:inline sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="flex-shrink-0 flex items-center gap-2 px-2 sm:px-3 pb-1.5">
          <Badge variant="secondary" className="text-[10px] hidden sm:inline-flex">
            {displayTmpl?.name ?? "—"}
          </Badge>
          <PDFExportButton previewRef={previewRef} resumeName={resumeName} />
        </div>
      </div>

      <div className="invisible md:visible flex-1 overflow-hidden relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18 }}
            className="absolute inset-0 flex flex-col"
          >
            {renderTabContent()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Mobile: each tab opens as a bottom sheet ── */}
      <Sheet open={mobileSheetOpen} onOpenChange={setMobileSheetOpen}>
        <SheetContent side="bottom" className="md:hidden h-[88vh] flex flex-col p-0 gap-0">
          <SheetHeader className="px-4 pt-4 pb-3 border-b border-gray-100 text-left shrink-0">
            <SheetTitle className="text-sm font-semibold">
              {TAB_LABELS[activeTab] ?? "Resume"}
            </SheetTitle>
          </SheetHeader>
          <div className="flex-1 overflow-hidden flex flex-col min-h-0">
            {renderTabContent()}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
