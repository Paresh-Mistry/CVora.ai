import React, { useEffect, useMemo, useState } from "react";
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
  CircleX,
  FileText,
  Gauge,
  ListChecks,
  Sparkles,
  Tag,
  TrendingUp,
  X,
  Zap,
} from "lucide-react";

import DashboardLayout from "../Layout/DashboardLayout";
import { useResumes } from "../hooks/useResume";
import { useCredits } from "../hooks/useAI";
import { useUser } from "../hooks/useAuth";

import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { Separator } from "../components/ui/separator";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";

const CREDIT_USAGE = [
  { day: "Jul 12", used: 14 },
  { day: "Jul 13", used: 22 },
  { day: "Jul 14", used: 9 },
  { day: "Jul 15", used: 31 },
  { day: "Jul 16", used: 18 },
  { day: "Jul 17", used: 27 },
  { day: "Jul 18", used: 12 },
  { day: "Jul 19", used: 35 },
  { day: "Jul 20", used: 19 },
  { day: "Jul 21", used: 24 },
  { day: "Jul 22", used: 30 },
  { day: "Jul 23", used: 16 },
  { day: "Jul 24", used: 28 },
  { day: "Jul 25", used: 21 },
];

const TYPE_META = {
  keyword: {
    icon: Tag,
    color: "text-blue-700",
    bg: "bg-blue-700/10",
    label: "Keyword",
  },
  metric: {
    icon: TrendingUp,
    color: "text-emerald-700",
    bg: "bg-emerald-700/10",
    label: "Metric",
  },
  verb: {
    icon: Zap,
    color: "text-amber-700",
    bg: "bg-amber-700/10",
    label: "Wording",
  },
  grammar: {
    icon: AlertTriangle,
    color: "text-red-700",
    bg: "bg-red-700/10",
    label: "Grammar",
  },
};

const PRIORITY_META = {
  high: {
    color: "text-red-700",
    bg: "bg-red-700/10",
  },
  medium: {
    color: "text-amber-700",
    bg: "bg-amber-700/10",
  },
  low: {
    color: "text-muted-foreground",
    bg: "bg-muted",
  },
};

function scoreColor(value: number) {
  if (value >= 80) return "text-emerald-700";
  if (value >= 60) return "text-amber-700";
  return "text-red-700";
}

function scoreBackground(value: number) {
  if (value >= 80) return "bg-emerald-700/10";
  if (value >= 60) return "bg-amber-700/10";
  return "bg-red-700/10";
}

function CreditTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: any[];
  label?: string;
}) {
  if (!active || !payload?.length) {
    return null;
  }

  return (
    <div className="rounded-lg border bg-background px-3 py-2 text-xs shadow-lg">
      <p className="mb-1 font-mono text-[11px] text-muted-foreground">
        {label}
      </p>

      <p className="font-semibold">
        {payload[0].value} credits used
      </p>
    </div>
  );
}

function ScoreRing({
  value,
  label,
  stroke = "hsl(var(--primary))",
}: {
  value: number;
  label: string;
  stroke?: string;
}) {
  const circumference = 2 * Math.PI * 54;
  const dash = (value / 100) * circumference;

  return (
    <div className="relative h-32 w-32 shrink-0">
      <svg
        width="128"
        height="128"
        viewBox="0 0 128 128"
        className="-rotate-90"
      >
        <circle
          cx="64"
          cy="64"
          r="54"
          fill="none"
          stroke="currentColor"
          strokeWidth="7"
          className="text-white/15"
        />

        <circle
          cx="64"
          cy="64"
          r="54"
          fill="none"
          stroke={stroke}
          strokeWidth="7"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={circumference - dash}
          strokeLinecap="round"
          className="transition-all duration-500"
        />
      </svg>

      <div className="absolute inset-2.5 flex flex-col items-center justify-center rounded-full border border-dashed border-white/30">
        <span className="font-serif text-3xl font-bold leading-none text-white">
          {value}
        </span>

        <span className="mt-1 px-2 text-center font-mono text-[9px] uppercase tracking-wider text-white/70">
          {label}
        </span>
      </div>
    </div>
  );
}

export const ResumeAnalytics = () => {
  const { data: credits } = useCredits();
  const { data: resumes } = useResumes();
  const { data: user } = useUser();

  const [selected, setSelected] = useState<string | null>(null);

  const [resolvedIds, setResolvedIds] = useState<
    Record<string, string[]>
  >({});

  const [applied, setApplied] = useState(0);

  useEffect(() => {
    if (!selected && resumes?.length) {
      setSelected(resumes[0].id);
    }
  }, [resumes, selected]);

  const aiTotal = credits?.ai?.total ?? 0;
  const atsTotal = credits?.ats?.total ?? 0;

  const aiUsed = credits?.ai?.used ?? 0;
  const atsUsed = credits?.ats?.used ?? 0;

  const aiRemaining = credits?.ai?.remaining ?? 0;
  const atsRemaining = credits?.ats?.remaining ?? 0;

  const totalCredits = aiTotal + atsTotal;
  const creditsUsed = aiUsed + atsUsed;
  const remaining = aiRemaining + atsRemaining;

  const remainingPct =
    totalCredits > 0
      ? Math.round((remaining / totalCredits) * 100)
      : 0;

  const usedPct =
    totalCredits > 0
      ? Math.round((creditsUsed / totalCredits) * 100)
      : 0;

  const avgAts = useMemo(() => {
    if (!resumes?.length) return 0;

    const sum = resumes.reduce(
      (total, resume) =>
        total + (Number(resume?.insight?.score) || 0),
      0
    );

    return Math.round(sum / resumes.length);
  }, [resumes]);

  const activeResume =
    resumes?.find((resume) => resume.id === selected) ??
    resumes?.[0] ??
    null;

  const activeResumeId = activeResume?.id ?? "";

  const dismissedForActive =
    resolvedIds[activeResumeId] || [];

  const activeSuggestions = (
    activeResume?.insight?.suggestions || []
  ).filter(
    (suggestion) =>
      !dismissedForActive.includes(suggestion.id)
  );

  const matchedKeywords =
    activeResume?.insight?.matched_keywords || [];

  const missingKeywords =
    activeResume?.insight?.missing_keywords || [];

  const checklist =
    activeResume?.insight?.checklist || [];

  const missingKeywordsTotal = useMemo(() => {
    if (!resumes) return 0;

    return resumes.reduce(
      (total, resume) =>
        total +
        (resume?.insight?.missing_keywords?.length || 0),
      0
    );
  }, [resumes]);

  function resolveSuggestion(
    id: string,
    applying: boolean
  ) {
    if (!activeResumeId) return;

    setResolvedIds((previous) => ({
      ...previous,
      [activeResumeId]: [
        ...(previous[activeResumeId] || []),
        id,
      ],
    }));

    if (applying) {
      setApplied((value) => value + 1);
    }
  }

  const isLoading = !resumes || !credits;

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
              {/* HERO */}
              <Card className="overflow-hidden border-0 bg-gradient-to-br from-slate-900 to-blue-900 text-white">
                <CardContent className="flex flex-col gap-8 p-6 md:flex-row md:items-center md:p-8">
                  <div className="flex items-center gap-6">
                    <ScoreRing
                      value={remaining}
                      label="Credits Left"
                      stroke="hsl(var(--amber))"
                    />

                    <ScoreRing
                      value={avgAts}
                      label="Avg ATS Score"
                      stroke="#ffffff"
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <h2 className="font-serif text-xl font-medium">
                      {user?.plan} plan · {creditsUsed} of{" "}
                      {totalCredits} credits used
                    </h2>

                    <p className="mt-2 text-sm text-white/70">
                      Resets Aug 1. Applying an AI suggestion
                      uses 2 credits.
                    </p>

                    <div className="mt-4 max-w-md">
                      {/* <Progress
                        value={100 - remainingPct}
                        className="h-2 bg-white/15"
                      /> */}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* STAT CARDS */}
              <div className="grid gap-4 md:grid-cols-3">
                {[
                  {
                    label: "Resumes Created",
                    value: resumes?.length ?? 0,
                    icon: FileText,
                    color: "text-blue-700",
                    bg: "bg-blue-700/10",
                  },
                  {
                    label: "Suggestions Applied",
                    value: applied,
                    icon: Sparkles,
                    color: "text-emerald-700",
                    bg: "bg-emerald-700/10",
                  },
                  {
                    label: "Missing Keywords Left",
                    value: missingKeywordsTotal,
                    icon: Tag,
                    color: "text-amber-700",
                    bg: "bg-amber-700/10",
                  },
                ].map((stat) => {
                  const Icon = stat.icon;

                  return (
                    <Card key={stat.label}>
                      <CardContent className="flex flex-col gap-4 p-5">
                        <div
                          className={`flex h-9 w-9 items-center justify-center rounded-lg ${stat.bg}`}
                        >
                          <Icon
                            className={`h-4 w-4 ${stat.color}`}
                          />
                        </div>

                        <div>
                          <p className="font-serif text-3xl font-semibold">
                            {stat.value}
                          </p>

                          <p className="text-xs text-muted-foreground">
                            {stat.label}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

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
                          content={<CreditTooltip />}
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

                    {/* <Progress
                      value={usedPct}
                      className="h-2"
                    /> */}

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
                              className={`grid w-full grid-cols-1 gap-3 rounded-lg px-2 py-4 text-left transition-colors hover:bg-muted/50 md:grid-cols-[1.6fr_0.8fr_0.9fr_0.7fr] md:items-center ${
                                selected === resume.id
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

                              <Badge
                                variant="secondary"
                                className={`w-fit font-mono ${scoreColor(
                                  score
                                )} ${scoreBackground(score)}`}
                              >
                                {resume.insight?.score ?? "—"}%
                              </Badge>

                              <div>
                                {/* <Progress
                                  value={completeness}
                                  className="h-2 w-24"
                                /> */}

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
                          const meta =
                            TYPE_META[suggestion.type] ||
                            TYPE_META.keyword;

                          const priority =
                            PRIORITY_META[
                              suggestion.priority
                            ] || PRIORITY_META.low;

                          const Icon = meta.icon;

                          return (
                            <div
                              key={suggestion.id}
                              className="flex gap-3 rounded-xl border p-3"
                            >
                              <div
                                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${meta.bg}`}
                              >
                                <Icon
                                  className={`h-4 w-4 ${meta.color}`}
                                />
                              </div>

                              <div className="min-w-0 flex-1">
                                <div className="mb-1 flex flex-wrap items-center gap-2">
                                  <Badge
                                    variant="secondary"
                                    className={`font-mono text-[10px] uppercase ${priority.color} ${priority.bg}`}
                                  >
                                    {suggestion.priority}
                                  </Badge>

                                  <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                                    {meta.label}
                                  </span>
                                </div>

                                <p className="text-sm leading-relaxed">
                                  {suggestion.text}
                                </p>
                              </div>

                              <div className="flex shrink-0 gap-1">
                                <Button
                                  size="icon"
                                  variant="outline"
                                  title="Apply"
                                  onClick={() =>
                                    resolveSuggestion(
                                      suggestion.id,
                                      true
                                    )
                                  }
                                  className="h-8 w-8 hover:border-emerald-700 hover:bg-emerald-700/10"
                                >
                                  <Check className="h-4 w-4 text-emerald-700" />
                                </Button>

                                <Button
                                  size="icon"
                                  variant="outline"
                                  title="Dismiss"
                                  onClick={() =>
                                    resolveSuggestion(
                                      suggestion.id,
                                      false
                                    )
                                  }
                                  className="h-8 w-8 hover:border-red-700 hover:bg-red-700/10"
                                >
                                  <X className="h-4 w-4 text-red-700" />
                                </Button>
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

                  {/* CHECKLIST */}
                  <Card>
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <ListChecks className="h-4 w-4 text-blue-700" />

                        <CardTitle className="font-serif text-lg">
                          Health checklist
                        </CardTitle>
                      </div>

                      <p className="text-xs text-muted-foreground">
                        For {activeResume?.title || "—"}
                      </p>
                    </CardHeader>

                    <CardContent>
                      {checklist.length === 0 ? (
                        <p className="py-4 text-xs text-muted-foreground">
                          No checklist data available for this
                          resume.
                        </p>
                      ) : (
                        <div>
                          {checklist.map(
                            (item, index) => (
                              <React.Fragment key={item.label}>
                                <div className="flex items-center gap-3 py-3">
                                  {item.pass ? (
                                    <CircleCheck className="h-4 w-4 shrink-0 text-emerald-700" />
                                  ) : (
                                    <CircleX className="h-4 w-4 shrink-0 text-red-700" />
                                  )}

                                  <p className="flex-1 text-sm font-medium">
                                    {item.label}
                                  </p>

                                  <span className="text-xs text-muted-foreground">
                                    {item.detail}
                                  </span>
                                </div>

                                {index <
                                  checklist.length - 1 && (
                                  <Separator />
                                )}
                              </React.Fragment>
                            )
                          )}
                        </div>
                      )}
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