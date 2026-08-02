import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from "recharts";
import {
  AlertTriangle,
  ArrowRight,
  Check,
  CircleCheck,
  Gauge,
  Sparkles,
  X,
} from "lucide-react";

import DashboardLayout from "../Layout/DashboardLayout";
import { useResumes } from "../hooks/useResume";
import { useCredits } from "../hooks/useAI";
import { useUser } from "../hooks/useAuth";

import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { Separator } from "../components/ui/separator";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { TooltipContent, TooltipTrigger } from "../components/ui/tooltip";

const CREDIT_USAGE = [
  { day: "Jul 19", used: 35 },
  { day: "Jul 20", used: 19 },
  { day: "Jul 21", used: 24 },
  { day: "Jul 22", used: 30 },
  { day: "Jul 23", used: 16 },
  { day: "Jul 24", used: 28 },
  { day: "Jul 25", used: 21 },
];

export const ResumeAnalytics = () => {
  const { data: credits } = useCredits();
  const { data: resumes } = useResumes();
  const { data: user } = useUser();

  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    if (!selected && resumes?.length) {
      setSelected(resumes[0].id);
    }
  }, [resumes, selected]);

  const aiTotal = credits?.ai?.total ?? 0;
  const atsTotal = credits?.ats?.total ?? 0;

  const aiUsed = credits?.ai?.used ?? 0;
  const atsUsed = credits?.ats?.used ?? 0;

  const totalCredits = aiTotal + atsTotal;
  const creditsUsed = aiUsed + atsUsed;

  const activeResume =
    resumes?.find((resume) => resume.id === selected) ??
    resumes?.[0] ??
    null;

  const activeSuggestions = (
    activeResume?.insight?.suggestions || []
  )

  console.log("activeSuggestions", activeSuggestions);

  const matchedKeywords =
    activeResume?.insight?.matched_keywords || [];

  const missingKeywords =
    activeResume?.insight?.missing_keywords || [];

  const isLoading = !resumes || !credits;

  const circumference = 2 * Math.PI * 28;

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {/* HEADER */}
          <header className="mb-7">
            <div className="mb-2 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
              <Sparkles className="h-3.5 w-3.5" />
              AI Resume Builder
            </div>

            <h1 className="font-serif text-4xl font-semibold tracking-tight">
              Analytics
            </h1>
          </header>

          {isLoading ? (
            <Card>
              <CardContent className="flex min-h-40 items-center justify-center text-sm text-muted-foreground">
                Loading your analytics…
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {/* CREDIT USAGE + PLAN */}
              <div className="grid gap-4 lg:grid-cols-[1.6fr_1fr]">
                {/* CHART */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="font-serif text-lg">
                      AI credit usage
                    </CardTitle>

                    <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                      Last 14 days
                    </span>
                  </CardHeader>

                  <CardContent className="h-64">
                    <ResponsiveContainer
                      width="100%"
                      height="100%"
                    >
                      <BarChart
                        data={CREDIT_USAGE}
                        margin={{
                          top: 10,
                          right: 8,
                          left: -18,
                          bottom: 0,
                        }}
                      >
                        <CartesianGrid
                          stroke="hsl(var(--border))"
                          vertical={false}
                        />

                        <XAxis
                          dataKey="day"
                          tick={{
                            fontSize: 11,
                          }}
                          axisLine={false}
                          tickLine={false}
                          interval={1}
                        />

                        <YAxis
                          tick={{
                            fontSize: 11,
                          }}
                          axisLine={false}
                          tickLine={false}
                          width={26}
                        />

                        <Tooltip
                          content={
                            <Tooltip>
                              <TooltipTrigger>Hover</TooltipTrigger>
                              <TooltipContent>
                                <p>Add to library</p>
                              </TooltipContent>
                            </Tooltip>
                          }
                          cursor={{
                            fill: "hsl(var(--muted))",
                            opacity: 0.3,
                          }}
                        />

                        <Bar
                          dataKey="used"
                          radius={[5, 5, 0, 0]}
                        >
                          {CREDIT_USAGE.map((_, index) => (
                            <Cell
                              key={index}
                              fill={
                                index ===
                                  CREDIT_USAGE.length - 1
                                  ? "hsl(var(--amber))"
                                  : "hsl(var(--primary))"
                              }
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* PLAN */}
                <Card>
                  <CardHeader>
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-700/10">
                      <Gauge className="h-4 w-4 text-amber-700" />
                    </div>

                    <CardTitle className="mt-3 font-serif text-lg">
                      {user?.plan} plan
                    </CardTitle>

                    <p className="text-xs text-muted-foreground">
                      Resets Aug 1
                    </p>
                  </CardHeader>

                  <CardContent className="flex h-full flex-col">
                    <div className="mb-2 flex justify-between text-xs">
                      <span>Used</span>

                      <span className="font-mono font-semibold">
                        {creditsUsed} / {totalCredits}
                      </span>
                    </div>

                    <p className="mt-5 text-xs leading-relaxed text-muted-foreground">
                      Optimizing a section costs 1 credit.
                      Applying a suggestion costs 2. Generating
                      a new resume from scratch costs 15.
                    </p>

                    <Button className="mt-6 w-full">
                      Upgrade for more credits
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* RESUMES */}
              <Card>
                <CardHeader>
                  <CardTitle className="font-serif text-lg">
                    Your resumes
                  </CardTitle>

                  <p className="text-xs text-muted-foreground">
                    Select one to see its suggestions and keyword
                    gaps below.
                  </p>
                </CardHeader>

                <CardContent>
                  {!resumes?.length ? (
                    <div className="flex min-h-32 items-center justify-center text-sm text-muted-foreground">
                      No resumes yet — create one to see
                      analytics here.
                    </div>
                  ) : (
                    <div>
                      {/* TABLE HEADER */}
                      <div className="hidden grid-cols-[1.6fr_0.8fr_0.9fr_0.7fr] gap-4 px-2 pb-3 md:grid">
                        <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                          Resume
                        </span>

                        <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                          ATS Score
                        </span>

                        <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                          Completeness
                        </span>

                        <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                          Updated
                        </span>
                      </div>

                      <Separator />

                      {resumes.map((resume, index) => {
                        const score =
                          Number(resume?.insight?.score) || 0;

                        const completeness =
                          Number(
                            resume?.insight?.completeness
                          ) || 0;

                        return (
                          <React.Fragment key={resume.id}>
                            <button
                              type="button"
                              onClick={() =>
                                setSelected(resume.id)
                              }
                              className={`grid w-full grid-cols-1 gap-3 rounded-lg px-2 py-4 text-left transition-colors hover:bg-muted/50 md:grid-cols-[1.6fr_0.8fr_0.9fr_0.7fr] md:items-center ${selected === resume.id
                                ? "bg-blue-700/5"
                                : ""
                                }`}
                            >
                              <div>
                                <p className="text-sm font-semibold">
                                  {resume.title}
                                </p>

                                <p className="text-xs text-muted-foreground">
                                  {resume.data?.domain}
                                </p>
                              </div>

                              <svg width="72" height="72" viewBox="0 0 72 72" className="shrink-0">
                                <circle cx="36" cy="36" r="28" fill="none" stroke="#e5e7eb" strokeWidth="6" />
                                <circle
                                  cx="36" cy="36" r="28" fill="none"
                                  stroke={score >= 70 ? "#16a34a" : score >= 40 ? "#d97706" : "#dc2626"}
                                  strokeWidth="6"
                                  strokeDasharray={circumference}
                                  strokeDashoffset={circumference - (resume.insight?.score / 100) * circumference}
                                  strokeLinecap="round"
                                  transform="rotate(-90 36 36)"
                                  style={{ transition: "stroke-dashoffset 0.6s ease" }}
                                />
                                <text x="36" y="41" textAnchor="middle" fontSize="14" fontWeight="600" fill="#111827">
                                  {resume.insight?.score || 0}
                                </text>
                              </svg>

                              <div>

                                <span className="mt-1 block font-mono text-[11px] text-muted-foreground">
                                  {completeness}%
                                </span>
                              </div>

                              <span className="font-mono text-xs text-muted-foreground">
                                {resume.updated_at}
                              </span>
                            </button>

                            {index < resumes.length - 1 && (
                              <Separator />
                            )}
                          </React.Fragment>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* RESUME TABS */}
              {resumes?.length > 0 && (
                <Tabs
                  value={selected ?? undefined}
                  onValueChange={setSelected}
                >
                  <TabsList className="h-auto flex-wrap justify-start">
                    {resumes.map((resume) => (
                      <TabsTrigger
                        key={resume.id}
                        value={resume.id}
                        className="text-xs"
                      >
                        {resume.title}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </Tabs>
              )}

              {/* SUGGESTIONS + KEYWORDS */}
              <div className="grid items-start gap-4 lg:grid-cols-[1.3fr_1fr]">
                {/* SUGGESTIONS */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="font-serif text-lg">
                        AI suggestions
                      </CardTitle>

                      <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                        {activeSuggestions.length} open
                      </span>
                    </div>

                    <p className="text-xs text-muted-foreground">
                      For {activeResume?.title || "—"}
                    </p>
                  </CardHeader>

                  <CardContent>
                    {activeSuggestions.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-10 text-center">
                        <CircleCheck className="mb-3 h-7 w-7 text-emerald-700" />

                        <p className="text-sm text-muted-foreground">
                          All suggestions cleared for this
                          resume.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {activeSuggestions.map((suggestion) => {
                          return (
                            <div
                              key={suggestion.id}
                              className="flex items-start gap-3 rounded-xl border px-4 py-3"
                            >
                              <AlertTriangle className="h-4 w-4 mt-0.5 text-red-700" />
                              <div className="min-w-0 flex-1">
                                <p className="text-sm leading-relaxed">
                                  {suggestion}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* RIGHT COLUMN */}
                <div className="space-y-4">
                  {/* KEYWORDS */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="font-serif text-lg">
                        Keyword match
                      </CardTitle>

                      <p className="text-xs text-muted-foreground">
                        For {activeResume?.title || "—"}
                      </p>
                    </CardHeader>

                    <CardContent className="space-y-5">
                      <div>
                        <p className="mb-2 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                          Matched — {matchedKeywords.length}
                        </p>

                        <div className="flex flex-wrap gap-2">
                          {matchedKeywords.length === 0 ? (
                            <span className="text-xs text-muted-foreground">
                              No matched keywords yet.
                            </span>
                          ) : (
                            matchedKeywords.map((keyword) => (
                              <Badge
                                key={keyword}
                                variant="outline"
                                className="gap-1 border-emerald-700/30 bg-emerald-700/10 font-mono text-emerald-700"
                              >
                                <Check className="h-3 w-3" />
                                {keyword}
                              </Badge>
                            ))
                          )}
                        </div>
                      </div>

                      <div>
                        <p className="mb-2 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                          Missing — {missingKeywords.length}
                        </p>

                        <div className="flex flex-wrap gap-2">
                          {missingKeywords.length === 0 ? (
                            <span className="text-xs text-muted-foreground">
                              No gaps found 🎉
                            </span>
                          ) : (
                            missingKeywords.map((keyword) => (
                              <Badge
                                key={keyword}
                                variant="outline"
                                className="gap-1 border-red-700/30 bg-red-700/5 font-mono text-red-700"
                              >
                                <X className="h-3 w-3" />
                                {keyword}
                              </Badge>
                            ))
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};