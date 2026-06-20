import { createContext, useState, ReactNode, useContext } from 'react';
import type { FormData, FormContextType, RequiredField } from './FormTypes';
import { defaultFormData } from './FormTypes';
import { useNavigate } from 'react-router-dom';

const FormContext = createContext<FormContextType | undefined>(undefined);

export const FormProvider = ({ children }: { children: ReactNode }) => {

    const navigate = useNavigate();
    const [form, setForm]                   = useState<FormData>(defaultFormData);
    const [primaryColor, setPrimaryColor]   = useState('#111827');
    const [textColor, setTextColor]         = useState('#ffffff');

    // ── handleChange ─────────────────────────────────────────────────────────
    // case 1 — flat scalar:          handleChange(e, 'name')
    // case 2 — flat array:           handleChange(e, 'skill', 0)
    // case 3 — array of objects:     handleChange(e, 'experience', 0, 'role')

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
        field: keyof FormData,
        index?: number,
        subField?: string
    ) => {
        const { value } = e.target;

        if (index !== undefined && subField) {
            // case 3
            setForm((prev: any) => {
                const updated = [...prev[field]];
                updated[index] = { ...updated[index], [subField]: value };
                return { ...prev, [field]: updated };
            });
        } else if (index !== undefined) {
            // case 2
            setForm((prev: any) => {
                const updated = [...prev[field]];
                updated[index] = value;
                return { ...prev, [field]: updated };
            });
        } else {
            // case 1
            setForm((prev) => ({ ...prev, [field]: value }));
        }
    };

    // ── addField ─────────────────────────────────────────────────────────────
    // Appends a blank template to any array field.

    const addField = (field: keyof FormData, template: any) => {
        setForm((prev: any) => ({
            ...prev,
            [field]: [...prev[field], template],
        }));
    };

    const updateSkills = (skills: string[]) => {
    setForm((prev) => ({
        ...prev,
        skill: skills,
    }));
};

    // ── removeField ──────────────────────────────────────────────────────────
    // Removes the item at `index` from any array field.

    const removeField = (field: keyof FormData, index: number) => {
        setForm((prev: any) => {
            const updated = [...prev[field]];
            updated.splice(index, 1);
            return { ...prev, [field]: updated };
        });
    };

    // ── handleSubmit ─────────────────────────────────────────────────────────

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Build the payload the server expects
        const payload = {
            name:          form.name,
            email:         form.email,
            domain:        form.domain,
            phone:         form.phone,
            github:        form.github,
            linkedin:      form.linkedin,
            summary:       form.summary,
            role:          form.experience[0]?.title          || '',
            skill:         form.skill.filter(Boolean),
            project_title: form.projects[0]?.project_title   || '',
            degree:        form.education[0]?.degree         || '',
            experience:    form.experience,
            projects:      form.projects,
            education:     form.education,
            achievements:  form.achievements,
            languages:     form.languages,
            certifications:form.certifications,
        };

        // Validate required fields
        const requiredFields: (keyof RequiredField)[] = ['name', 'experience', 'skill', 'education'];
        const missingFields = requiredFields.filter((f) => !payload[f as keyof typeof payload]);

        if (missingFields.length > 0) {
            console.warn('Missing required fields:', missingFields);
            // TODO: surface validation errors in the UI
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/resume/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error(`Server error: ${response.status} ${response.statusText}`);
            }

            const result = await response.json();
            console.log('Server response:', result);

            navigate('/resume/result', {
                state: {
                    form,
                    insight:    result.insight,
                    textcolor:  textColor,
                    bgcolor:    primaryColor,
                },
            });
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    // ── Provider value ───────────────────────────────────────────────────────

    return (
        <FormContext.Provider
            value={{
                form,
                setForm,
                primaryColor,
                setPrimaryColor,
                textColor,
                setTextColor,
                addField,
                removeField,
                handleChange,
                updateSkills,
                handleSubmit,
            }}
        >
            {children}
        </FormContext.Provider>
    );
};

// ── Hook ─────────────────────────────────────────────────────────────────────

export const useFormContext = () => {
    const context = useContext(FormContext);
    if (!context) throw new Error('useFormContext must be used within <FormProvider>');
    return context;
};