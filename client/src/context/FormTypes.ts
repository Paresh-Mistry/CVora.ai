// FormTypes.ts

// ─── Array item shapes ────────────────────────────────────────────────────────

export interface ExperienceItem {
  title: string;
  company: string;
  dates: string;
  bullets: string[];
}

export interface ProjectItem {
  project_title: string;
  tech_stack: string;
  link: string;
  description: string;
}

export interface EducationItem {
  degree: string;
  school: string;
  dates: string;
  grade: string;
}

export interface AchievementItem {
  title: string;
  description: string;
}

export interface LanguageItem {
  language: string;
  proficiency: "Native" | "Fluent" | "Advanced" | "Intermediate" | "Basic" | "";
}

export interface CertificationItem {
  title: string;
  issuer: string;
  date: string;
  url: string;
}

// ─── Required fields (for validation) ────────────────────────────────────────

export type RequiredField = {
  name: string;
  domain: string;
  skill: string[];
  experience: Pick<ExperienceItem, "title" | "company">[];
  education: Pick<EducationItem, "degree">[];
};

// ─── Full form shape ──────────────────────────────────────────────────────────

export interface FormData {
  // personal
  name: string;
  email: string;
  domain: string;       // job title / headline
  phone: string;
  github: string;
  linkedin: string;

  // summary
  summary: string;

  // arrays
  skill: string[];
  experience: ExperienceItem[];
  projects: ProjectItem[];
  education: EducationItem[];
  achievements: AchievementItem[];
  languages: LanguageItem[];
  certifications: CertificationItem[];

  // misc
  insight: string;      // kept for backward compat
}

// ─── Context shape ────────────────────────────────────────────────────────────

export interface FormContextType {
  form: FormData;
  setForm: React.Dispatch<React.SetStateAction<FormData>>;

  primaryColor: string;
  setPrimaryColor: React.Dispatch<React.SetStateAction<string>>;

  textColor: string;
  setTextColor: React.Dispatch<React.SetStateAction<string>>;

  /** Add a new blank item to any array field */
  addField: (field: keyof FormData, template: any) => void;

  /** Remove an item from any array field by index */
  removeField: (field: keyof FormData, index: number) => void;

  /** Generic change handler for flat fields, flat arrays, and arrays-of-objects */
  handleChange: (
    e: React.ChangeEvent<
      HTMLInputElement |
      HTMLTextAreaElement |
      HTMLSelectElement
    >,
    field: keyof FormData,
    index?: number,
    subField?: string
  ) => void;

  /** Update entire skills array */
  updateSkills: (skills: string[]) => void;

  handleSubmit: (e: React.FormEvent) => void;
}

// ─── Default / initial values ─────────────────────────────────────────────────

export const defaultFormData: FormData = {
  // personal
  name:     "",
  email:    "",
  domain:   "",
  phone:    "",
  github:   "",
  linkedin: "",

  // summary
  summary: "",

  // skills — start with 3 blank slots
  skill: ["", "", ""],

  // experience
  experience: [
    { title: "", company: "", dates: "", bullets: [] },
  ],

  // projects
  projects: [
    { project_title: "", tech_stack: "", link: "", description: "" },
  ],

  // education
  education: [
    { degree: "", school: "", dates: "", grade: "" },
  ],

  // achievements
  achievements: [
    { title: "", description: "" },
  ],

  // languages
  languages: [
    { language: "", proficiency: "" },
  ],

  // certifications
  certifications: [
    { title: "", issuer: "", date: "", url: "" },
  ],

  // misc
  insight: "",
};

// ─── Step ordering (drives FormFillStep + stepper nav) ────────────────────────

export const FORM_STEPS = [
  "personal",
  "summary",
  "experience",
  "education",
  "skills",
  "projects",
  "achievements",
  "languages",
  "certifications",
] as const;

export type StepId = (typeof FORM_STEPS)[number];

export const STEP_META: Record<StepId, { label: string; emoji: string }> = {
  personal:       { label: "Personal",        emoji: "👤" },
  summary:        { label: "Summary",          emoji: "📝" },
  experience:     { label: "Experience",       emoji: "💼" },
  education:      { label: "Education",        emoji: "🎓" },
  skills:         { label: "Skills",           emoji: "🔧" },
  projects:       { label: "Projects",         emoji: "📁" },
  achievements:   { label: "Achievements",     emoji: "🏆" },
  languages:      { label: "Languages",        emoji: "🌐" },
  certifications: { label: "Certifications",   emoji: "🏅" },
};