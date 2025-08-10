import { createContext, useState, ReactNode, useContext } from 'react';
import type { FormData, FormContextType, RequiredField } from './FormTypes';
import { defaultFormData } from './FormTypes';
import { useNavigate } from 'react-router-dom';

const FormContext = createContext<FormContextType | undefined>(undefined);

export const FormProvider = ({ children }: { children: ReactNode }) => {

    const navigate = useNavigate()
    const [form, setForm] = useState<FormData>(defaultFormData);
    const [primaryColor, setPrimaryColor] = useState('#111827'); // default blue
    const [textColor, setTextColor] = useState('#ffffff');

    const handleChange  = (e: any, field: string, index?: number, subField?: string) => {
        const { value } = e.target;
        if (index !== undefined && subField) {
            setForm((prev: any) => {
                const updated = [...prev[field]];
                updated[index][subField] = value;
                return { ...prev, [field]: updated };
            });
        } else if (index !== undefined) {
            setForm((prev: any) => {
                const updated = [...prev[field]];
                updated[index] = value;
                return { ...prev, [field]: updated };
            });
        } else {
            setForm((prev) => ({ ...prev, [field]: value }));
        }
    };



    const addField = (field: string, template: any) => {
        setForm((prev: any) => ({
            ...prev,
            [field]: [...prev[field], template],
        }));
    };



    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const formData = {
            name: form.name,
            role: form.experience[0]?.role,  
            skill: form.skill,
            project_title: form.projects[0]?.project_title,  
            degree: form.education[0]?.degree  
        };

        // Check if all required fields are present
        const requiredFields: (keyof RequiredField)[] = ['name', 'role', 'project_title', 'degree'];
        const missingFields = requiredFields.filter(field => !formData[field]);

        if (missingFields.length > 0) {
            console.log("Missing fields:", missingFields);
            return;
        }
        try {
            const response = await fetch('http://localhost:5000/resume/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData), 
            });

            const result = await response.json();
            console.log('Server response:', result);

            navigate('/resume/result', { state: { form, insight: result.insight, textcolor: textColor, bgcolor: primaryColor } });
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    return (
        <FormContext.Provider
            value={{
                form,
                setForm,
                addField,
                handleChange,
                handleSubmit,
                textColor,
                setTextColor,
                primaryColor,
                setPrimaryColor
            }}
        >
            {children}
        </FormContext.Provider>
    );
};

export const useFormContext = () => {
    const context = useContext(FormContext);
    if (!context) throw new Error('useFormContext must be used within FormProvider');
    return context;
};
