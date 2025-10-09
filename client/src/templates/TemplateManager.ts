import TemplateFinanceManager from "./TemplateFinanceManager";
import TemplateSoftwareEng from "./TemplateSoftwareEng";

export interface ResumeTemplate {
    id: number;
    name: string;
    component: React.ComponentType<any>;
}

const templateMap: Record<string, ResumeTemplate> = {
    "1": { id: 1, name: "Software Engineers", component: TemplateSoftwareEng },
    "2": { id: 2, name: "Finance Engineers", component: TemplateFinanceManager }
}


export const getTemplateById = (id:string): ResumeTemplate | undefined => templateMap[id]
export const getAllTemplate = (): ResumeTemplate[] | undefined => Object.values(templateMap)
