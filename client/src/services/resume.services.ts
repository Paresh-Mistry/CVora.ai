// src/api/resume.api.ts
import { api } from "./axios";

export interface ResumeData {
  name: string;
  email: string;
  domain: string;
  phone: string;
  github: string;
  linkedin: string;
  summary: string;
  skill: string[];
  experience: { role: string; company: string; duration: string; description: string }[];
  projects: { project_title: string; tech_stack: string; link: string; description: string }[];
  education: { degree: string; institute: string; year: string; grade: string }[];
  achievements: { title: string; description: string }[];
  languages: { language: string; proficiency: string }[];
  certifications: { title: string; issuer: string; date: string; url: string }[];
  insight: string;
}

export interface ResumeOut {
  id: string;
  user_id: string;
  title: string;
  template_id: string;
  data: ResumeData;
  insight: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateResumePayload {
  title?: string;
  template_id?: string;
  data: Partial<ResumeData>;
}

export interface UpdateResumePayload {
  title?: string;
  template_id?: string;
  data?: Partial<ResumeData>;
}

export const resumeApi = {
  list: async (): Promise<ResumeOut[]> => {
    const { data } = await api.get("/resumes/");
    return data;
  },

  get: async (id: string): Promise<ResumeOut> => {
    const { data } = await api.get(`/resumes/${id}`);
    return data;
  },

  create: async (payload: CreateResumePayload): Promise<ResumeOut> => {
    const { data } = await api.post("/resumes/", payload);
    return data;
  },

  update: async (id: string, payload: UpdateResumePayload): Promise<ResumeOut> => {
    const { data } = await api.patch(`/resumes/${id}`, payload);
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/resumes/${id}`);
  },
};