// src/api/ai.api.ts
import { api } from "./axios";

// ── AI generate ───────────────────────────────────────────────────────────────

export interface AIGeneratePayload {
  resume_id: string;
  prompt?: string;
}
export interface AIGenerateResponse {
  insight: string;
  credits_remaining: number;
}

// ── ATS ───────────────────────────────────────────────────────────────────────

export interface ATSPayload {
  resume_id: string;
  job_description?: string;
}
export interface ATSResponse {
  score: number;
  missing_keywords: string[];
  suggestions: string[];
  credits_remaining: number;
}

// ── Cover letter ──────────────────────────────────────────────────────────────

export interface CoverLetterPayload {
  resume_id: string;
  job_title: string;
  company_name: string;
  job_description?: string;
}
export interface CoverLetterResponse {
  cover_letter: string;
  credits_remaining: number;
}

export const aiApi = {
  generate: async (payload: AIGeneratePayload): Promise<AIGenerateResponse> => {
    const { data } = await api.post("/ai/generate", payload);
    return data;
  },

  ats: async (payload: ATSPayload): Promise<ATSResponse> => {
    const { data } = await api.post("/ai/ats", payload);
    return data;
  },
};

// ── Templates ─────────────────────────────────────────────────────────────────

export interface TemplateOut {
  id: string;
  name: string;
  description: string;
  layout: string;
  preview_bg: string;
  is_premium: boolean;
  tokens: Record<string, string>;
  sections: Record<string, string>;
  preview_url: string | null;
}



export const templateApi = {
  list: async (): Promise<TemplateOut[]> => {
    const { data } = await api.get("/templates/");
    console.log("Services Data Templates : ",data)
    return data;
  },
};

// ── Credits ───────────────────────────────────────────────────────────────────

export interface CreditOut {
  feature: string;
  used: number;
  total: number;
  remaining: number;
}
export interface AllCreditsOut {
  ai: CreditOut;
  ats: CreditOut;
  cover_letter: CreditOut;
}

export const creditsApi = {
  get: async (): Promise<AllCreditsOut> => {
    const { data } = await api.get("/credits");
    return data;
  },
};

// ── Jobs ──────────────────────────────────────────────────────────────────────

export interface JobResult {
  title: string;
  company: string;
  location: string;
  url: string;
  posted_at: string | null;
  match_score: number | null;
}

export interface JobSearchResponse {
  jobs: JobResult[];
  query_used: string;
}

export const jobsApi = {
  search: async (resume_id: string): Promise<JobSearchResponse> => {
    const { data } = await api.get(`/jobs/${resume_id}`);
    return data;
  },
};
