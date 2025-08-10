// FormTypes.ts

export interface ExperienceItem {
  role: string;
  company: string;
  duration: string;
  description: string;
}

export interface ProjectItem {
  project_title: string;
  description: string;
}

export interface EducationItem {
  degree: string;
  institute: string;
  year: string;
}

export type RequiredField = {
  name: string;
  role: string;
  skill: string[];
  project_title: string;
  degree: string;
};

export interface FormData {
  name: string;
  email: string;
  domain: string;
  phone: string;
  github: string;
  linkedin: string;
  role: string;
  skill: string[];
  experience: ExperienceItem[];
  projects: ProjectItem[];
  education: EducationItem[];
  insight: string;
}


export interface FormContextType {
  form: FormData;
  setForm: React.Dispatch<React.SetStateAction<FormData>>;
  primaryColor: string;
  setPrimaryColor: React.Dispatch<React.SetStateAction<string>>;
  textColor: string;
  setTextColor: React.Dispatch<React.SetStateAction<string>>;
  addField: (field: keyof FormData, template: any) => void;
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: keyof FormData,
    index?: number,
    subField?: string
  ) => void;
  handleSubmit: (e: React.FormEvent) => void
}


// Default values for initialization
export const defaultFormData: FormData = {
  name: '',
  email: '',
  domain: '',
  phone: '',
  github: '',
  linkedin: '',
  role: '',
  skill: [''],
  experience: [
    { role: '', company: '', duration: '', description: '' }
  ],
  projects: [
    { project_title: '', description: '' }
  ],
  education: [
    { degree: '', institute: '', year: '' }
  ],
  insight: ''
};
