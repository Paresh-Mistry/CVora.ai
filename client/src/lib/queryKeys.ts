// src/api/queryKeys.ts
// Single source of truth for all TanStack Query cache keys.
// Keeps invalidation consistent across the whole app.

export const queryKeys = {
  // Auth
  user: () => ["user"] as const,

  // Resumes
  resumes: () => ["resumes"] as const,
  resume:  (id: string) => ["resumes", id] as const,

  // Templates
  templates: () => ["templates"] as const,

  // Credits
  credits: () => ["credits"] as const,

  // AI (mutations don't need keys, but these let you cache results)
  ats:         (resumeId: string) => ["ats", resumeId] as const,
  coverLetter: (resumeId: string) => ["cover-letter", resumeId] as const,

  // Jobs
  jobs: (resumeId: string) => ["jobs", resumeId] as const,
};