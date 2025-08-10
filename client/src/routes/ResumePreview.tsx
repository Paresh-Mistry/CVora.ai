
import React from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import TemplateThree from '../templates/TemplateSoftwareEng';
import Layout from '../Layout/PageLayout';
import TemplateFinanceManager from '../templates/TemplateFinanceManager';


const ResumeResult: React.FC = () => {

    const { state } = useLocation();
    const navigate = useNavigate();
    const { id } = useParams()

    if (!state?.form || !state?.insight) {
        return <Layout>No data available. Please go back and complete the form.</Layout>;
    }
    function formatJobParagraph(paragraph: string) {
        const lines = paragraph.split('\n').map(line => line.trim()).filter(Boolean);

        const output: string[] = [];
        let introComplete = false;

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];

            if (line.includes('http')) {
                let last: string | undefined = output.pop();
                output.push(`${last}<a href="${line}" class="text-blue-600 font-medium text-sm" target="_blank">${line}</a><br/>`);
            } else if (!introComplete && line.match(/job titles|roles|based on/i)) {
                output.push(`<p class="font-semibold ">${line}</p>`);
                introComplete = true;
            } else if (!line.startsWith('http')) {
                output.push(`<strong>${line}</strong><br/>`);
            }
        }

        return output.join('\n');
    }


    console.log("Success");

    const { form, insight, textcolor, bgcolor } = state;

    return (

        <Layout>
            <div className="bg-[#f7faff] w-full md:flex gap-3 p-8">
                <div className="bg-white space-y-5 md:w-6/12 shadow p-4 rounded-md">
                    <h1 className="text-3xl font-bold mb-4 text-[#213963]">AI Resume Suggestions</h1>

                    <div>
                        <h3 className='text-2xl font-medium'>Overview</h3>
                        <p>{insight.overview}</p>
                    </div>
                    <div>
                        <h3 className='text-2xl font-medium'>Job Similarities</h3>
                        <div dangerouslySetInnerHTML={{ __html: formatJobParagraph(insight.job_matches) }} />
                    </div>
                    <div>
                        <h3 className='text-2xl font-medium'>Activities</h3>
                        <div dangerouslySetInnerHTML={{ __html: formatJobParagraph(insight.activities) }} />
                    </div>
                    <div>
                        <h3 className='text-2xl font-medium'>Future Learning Advices</h3>
                        <div dangerouslySetInnerHTML={{ __html: formatJobParagraph(insight.learning_advice) }} />

                    </div>
                </div>

                <div className='md:w-6/12 bg-white shadow p-4 space-y-3'>

                    <div className="flex gap-4">
                        <Link
                            to={TemplateThree}
                            className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                        >
                            Download Resume
                        </Link>

                        <button
                            onClick={() => navigate('/')}
                            className="px-6 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
                        >
                            Back to Editor
                        </button>
                    </div>
                    {/* <h2 className="text-xl font-semibo  ld mb-2">Your Resume Preview</h2> */}
                    <div className="bg-white rounded-lg ">
                        {/* <TemplateThree form={form} insight={insight} textcolor={textcolor} bgcolor={bgcolor} /> */}
                        {id === '1' ? (
                            <TemplateThree form={form} insight={insight} textcolor={textcolor} bgcolor={bgcolor} />
                        ) : id === '2' ? (
                            <TemplateFinanceManager form={form} insight={insight} textcolor={textcolor} bgcolor={bgcolor} />
                        ) : "No Resume template Found"}
                    </div>


                </div>
            </div>
        </Layout>
    );
};

export default ResumeResult;
