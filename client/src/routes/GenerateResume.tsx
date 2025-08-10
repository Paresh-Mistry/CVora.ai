import React from 'react';
import TemplateCard from '../components/ResumeTemplateCard';
import TemplateThree from '../templates/TemplateSoftwareEng';
import Layout from '../Layout/PageLayout';
import TemplateFinanceManager from '../templates/TemplateFinanceManager';


const templates = [
    { id: '1', name: 'Software Engineers', component: TemplateThree },
    { id: '2', name: 'Financial Management', component: TemplateFinanceManager },
];

const Generate: React.FC = () => {
    return (

        <Layout>
            <section className="container max-w-7xl mx-auto py-10 px-4">
                <div>
                    <h1 className='lg:text-3xl text-[#212834] md:text-2xl text-xl mb-6 font-medium'>Find Your
                        <span className='text-[#11a8e4] mozilla-headline-hero'>{' '}Resume's</span>
                    </h1>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 place-items-center">
                    {templates.map((template) => (
                        <TemplateCard key={template.id} {...template} />
                    ))}
                </div>
            </section>
        </Layout>

    );
};

export default Generate;
