import { useEffect, useState } from "react";
import { ResponsiveContainer, RadialBarChart, PolarAngleAxis, RadialBar } from "recharts";
import { AlertTriangle, ArrowRight, Check, CircleCheck, Gauge, Sparkles, X } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import DashboardLayout from "../Layout/DashboardLayout";
import { useResumes } from "../hooks/useResume";
import { useCredits } from "../hooks/useAI";
import { useUser } from "../hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";

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

  const CREDIT_USAGE = [
    {
      feature: "AI",
      used: aiUsed,
      total: aiTotal,
      remaining: aiTotal - aiUsed,
      percentage: (aiUsed / aiTotal) * 100,
      fill: "#11a8e4",
    },
    {
      feature: "ATS",
      used: atsUsed,
      total: atsTotal,
      remaining: atsTotal - atsUsed,
      percentage: (atsUsed / atsTotal) * 100,
      fill: "#f97316",
    },
  ];

  const activeResume = resumes?.find((resume) => resume.id === selected) ?? resumes?.[0] ?? null;

  const activeSuggestions = activeResume?.insight?.suggestions || []
  const matchedKeywords = activeResume?.insight?.matched_keywords || [];
  const missingKeywords = activeResume?.insight?.missing_keywords || [];
  const isLoading = !resumes || !credits;
  const circumference = 2 * Math.PI * 28;

  return (
    <DashboardLayout>
      <section className="container max-w-7xl mx-auto  md:p-10 py-3 px-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-medium text-[#212834] leading-tight">
              Analyse Your
              <span className="ml-2 bg-gradient-to-r from-[#5F3DEE] to-[#63c5ea] bg-clip-text text-transparent mozilla-headline-hero">
                Resume&apos;s
              </span>
            </h1>
            <p className="text-gray-500 mt-2 text-sm md:text-base font-serif">
              Get insights into your resume&apos;s performance and discover areas for improvement.
            </p>
          </div>
        </div>

        {isLoading ? (
          <Card>
            <CardContent className="flex min-h-40 items-center justify-center text-sm text-muted-foreground">
              Loading your analytics…
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            <div className="grid gap-4 lg:grid-cols-2">
              <div className="grid grid-cols-2 gap-4 items-center">
                {CREDIT_USAGE.map((credit) => (
                  <div key={credit.feature} className="flex flex-col relative items-center">                    
                    <div className="absolute top-[50%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center">
                      <span className="text-3xl font-bold">{credit.remaining}</span>
                      <span className="text-xs text-muted-foreground">Remaining</span>
                    </div>

                    <ResponsiveContainer width="100%" height={180}>
                      <RadialBarChart data={[credit]} innerRadius="70%" outerRadius="100%" startAngle={90} endAngle={-270}>                      >
                        <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
                        <RadialBar background dataKey="percentage" cornerRadius={10} fill={credit.fill} />
                      </RadialBarChart>
                    </ResponsiveContainer>
                  </div>
                ))}
              </div>

              {/* PLAN */}
              <Card className="bg-[url('https://images.unsplash.com/photo-1776926092753-90b92875fdbc?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTk4fHx3aGl0ZSUyMGJhY2tncm91bmQlMjBmb3IlMjB3ZWJzaXRlfGVufDB8fDB8fHww')] bg-cover bg-center bg-accent/10">
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
                    No resumes yet — create one to see analytics here.
                  </div>
                ) : (
                  <Table>
                    <TableHeader className="bg-muted">
                      <TableRow>
                        <TableHead>Id</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>Domain</TableHead>
                        <TableHead>ATS Score</TableHead>
                        <TableHead>Updated At</TableHead>
                        <TableHead>Created At</TableHead>
                      </TableRow>
                    </TableHeader>

                    <TableBody>
                      {resumes.map((resume) => {
                        const score = Number(resume?.insight?.score) || 0;

                        return (
                          <TableRow
                            key={resume.id}
                            onClick={() => setSelected(resume.id)}
                            className={`cursor-pointer transition-colors ${selected === resume.id && "bg-primary/2"}`}
                          >
                            <TableCell className="font-mono text-muted-foreground">{resume.id.slice(0, 12)}</TableCell>
                            <TableCell>{resume.title}</TableCell>
                            <TableCell>{resume.data?.domain || "Not specified"}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <svg
                                  width="52"
                                  height="52"
                                  viewBox="0 0 72 72"
                                  className="shrink-0"
                                >
                                  <circle
                                    cx="36"
                                    cy="36"
                                    r="28"
                                    fill="none"
                                    stroke="#e5e7eb"
                                    strokeWidth="6"
                                  />

                                  <circle
                                    cx="36"
                                    cy="36"
                                    r="28"
                                    fill="none"
                                    stroke={
                                      score >= 70
                                        ? "#16a34a"
                                        : score >= 40
                                          ? "#d97706"
                                          : "#dc2626"
                                    }
                                    strokeWidth="6"
                                    strokeDasharray={circumference}
                                    strokeDashoffset={
                                      circumference -
                                      (score / 100) * circumference
                                    }
                                    strokeLinecap="round"
                                    transform="rotate(-90 36 36)"
                                    style={{
                                      transition:
                                        "stroke-dashoffset .5s ease",
                                    }}
                                  />

                                  <text
                                    x="36"
                                    y="44"
                                    textAnchor="middle"
                                    fontSize="22"
                                    fontWeight="600"
                                    fill="currentColor"
                                  >
                                    {score}
                                  </text>
                                </svg>
                              </div>
                            </TableCell>

                            <TableCell className="text-muted-foreground">
                              {resume.updated_at}
                            </TableCell>
                            <TableCell className="text-muted-foreground">
                              {resume.created_at}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
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
      </section>
    </DashboardLayout>
  );
};