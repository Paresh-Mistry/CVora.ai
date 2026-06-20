import type { ComponentType } from "react";

// ─── Domain types ───────────────────────────────────────────────────────────

export interface ExperienceItem {
  title?: string;
  company?: string;
  dates?: string;
  /** Either a pre-split array of bullet strings, or a single string that
   *  will be split on newlines / •  / ◦ / ▪ at render time. */
  bullets?: string[] | string;
}

export interface EducationItem {
  degree?: string;
  school?: string;
  dates?: string;
  grade?: string;
}

export interface ProjectItem {
  project_title?: string;
  tech_stack?: string;
  description?: string;
  link?: string;
}

export interface AchievementItem {
  title?: string;
  description?: string;
}

export interface LanguageItem {
  language?: string;
  proficiency?: string;
}

export interface CertificationItem {
  title?: string;
  issuer?: string;
  date?: string;
  url?: string;
}

export interface ResumeData {
  name?: string;
  title?: string;
  domain?: string;
  summary?: string;
  email?: string;
  phone?: string;
  linkedin?: string;
  github?: string;
  skill?: string[];
  experience?: ExperienceItem[];
  education?: EducationItem[];
  projects?: ProjectItem[];
  achievements?: AchievementItem[];
  languages?: LanguageItem[];
  certifications?: CertificationItem[];
}

export type SkillStyle = "pill" | "dot" | "bar";

export interface ThemeTokens {
  font?: string;
  displayFont?: string;
  accent?: string;
  bannerBg?: string;
  nameSize?: string;
  sideWidth?: string;
  sidebarBg?: string;
  sidebarText?: string;
  sidebarAccent?: string;
  skillStyle?: SkillStyle;
  avatar?: AvatarStyle;
}

export type AvatarStyle = "circle" | "square";

export interface LayoutProps {
  d: ResumeData;
  tk?: ThemeTokens;
}

export interface ContactItem {
  prefix: string;
  icon: ComponentType<{ size?: number; className?: string }>;
  value?: string;
}

/** A ContactItem after filtering out entries with no value. */
export interface ResolvedContactItem extends ContactItem {
  value: string;
}