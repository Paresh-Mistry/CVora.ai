import React from 'react';
import TemplateCard from '../components/TemplateCard';
import TemplateOne from '../templates/TemplateOne';
import TemplateTwo from '../templates/TemplateTwo';
import TemplateThree from '../templates/TemplateThree';
import TemplateFour from '../templates/TemplateFour';


const templates = [
    { id: 'template1', name: 'Toronto', component: TemplateOne },
    { id: 'template2', name: 'Red Template', component: TemplateTwo },
    { id: 'template3', name: 'Dark Template', component: TemplateThree },
    { id: 'template4', name: 'White Template', component: TemplateFour },
  ];

const Generate: React.FC = () => {
    return (
        <section className="container max-w-7xl mx-auto py-10 px-4 dark:bg-gray-900">
            <div>
                <h1 className='lg:text-4xl text-red-500 md:text-3xl text-2xl mb-6 font-extrabold'>Resume Templates</h1>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 place-items-center">
               {templates.map((template) => (
                <TemplateCard key={template.id} {...template}/>
               ))}
            </div>
        </section>
    );
};

export default Generate;
