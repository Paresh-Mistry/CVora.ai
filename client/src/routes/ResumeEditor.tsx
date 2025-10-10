// import React, { useEffect, useState } from 'react';
// import Layout from '../Layout/PageLayout';
// import { ArrowLeft, ArrowLeftIcon, ArrowRight, ArrowRightIcon } from 'lucide-react';
// import { useFormContext } from '../context/FormContext';
// // import TemplateFinanceManager from '../templates/TemplateFinanceManager';
// import { useParams } from 'react-router-dom';
// // import TemplateSoftwareEng from '../templates/TemplateSoftwareEng';
// import { getTemplateById } from '../templates/TemplateManager';
// import FormFillStep from '../components/FormFillStep';
// import { ButtonGroup } from '../components/ui/button-group';
// import { Button } from '../components/ui/button';
// import clsx from 'clsx';


// const steps = ['profile', 'experience', 'skills', 'projects', 'education'];

// const Editing: React.FC = () => {


//     useEffect(() => {
//         document.title = "Create Resume"
//     }, [])


//     const { id }: any = useParams()
//     const template = getTemplateById(id)
//     console.log(template, id)
//     const TemplateComponent: any = template?.component


//     const [step, setStep] = useState(0);

//     const {
//         form,
//         handleSubmit,
//         textColor,
//         setTextColor,
//         primaryColor,
//         setPrimaryColor
//     } = useFormContext();



//     const handleColorChange = (e: any) => {
//         const selectedColor = e.target.value;
//         setPrimaryColor(selectedColor);
//         setTextColor(getContrastColor(selectedColor));
//     };



//     const getContrastColor = (hexColor: any) => {
//         const color = hexColor.replace('#', '');
//         const r = parseInt(color.substr(0, 2), 16);
//         const g = parseInt(color.substr(2, 2), 16);
//         const b = parseInt(color.substr(4, 2), 16);

//         const brightness = (r * 299 + g * 587 + b * 114) / 1000;

//         return brightness > 128 ? '#000000' : '#ffffff';
//     };


//     const capitalize = (text: string) => {
//         let _str = text.charAt(0).toUpperCase() + text.slice(1, text.length).toLowerCase()
//         return _str
//     }


//     return (
//         <Layout>
//             <div className="flex flex-col bg-[#e7f4f6] md:flex-row w-full">

//                 <aside className="space-y-4 md:space-y-8 sm:block hidden md:bg-[#c8e7fa]  overflow-x-auto md:w-[14%] md:py-6 py-3 px-4">

//                     <div className='flex justify-between text-[#213963] items-center'>
//                         <h3 className='text-sm md:text-xl sm:font-medium md:font-semibold'>Tracker</h3>
//                     </div>

//                     <ol className="md:space-y-6 flex md:flex-col gap-5 md:gap-0">
//                         {steps.map((label, i) => (
//                             <li key={i} className="sm:flex flex-1 items-center gap-2">
//                                 <div
//                                     className={`w-7 h-7 rounded-full flex items-center justify-center mx-auto sm:mx-0 font-bold border-r-2 text-sm ${i === step ? 'bg-[#c1f5f5] text-[#213963] border-[#213963]' : 'border-black'
//                                         }`}
//                                 >
//                                     {i + 1}
//                                 </div>
//                                 <div className={`hidden sm:block font-semibold ${i === step && 'text-[#213963]' || 'text-xs'} `}>{capitalize(label)}</div>
//                                 {i === step && (<div className='md:block hidden'>
//                                     <svg className="w-4 h-4 text-green-400 ms-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
//                                         <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
//                                     </svg>
//                                 </div>)}
//                             </li>
//                         ))}
//                     </ol>

//                 </aside>

//                 <main className="flex-1">

//                     <div className="flex flex-col w-full md:flex-row">

//                         <div className="md:w-5/12 space-y-7 p-6 md:p-8 items-center">
//                             <h1 className="md:text-2xl text-xl text-[#212834] orbitron-head">Personal Details</h1>

//                             <form
//                                 onSubmit={handleSubmit}
//                                 className="flex-1 h-fit bg-white p-6 rounded-lg shadow-md"
//                             >
//                                 <h2 className="text-sm font-medium capitalize mb-4 ">{steps[step]}</h2>
//                                 <FormFillStep steps={steps} step={step} />
//                                 <div className="flex justify-between mt-6">
//                                     <ButtonGroup>
//                                         {steps.map((_, i) => (
//                                             <Button
//                                                 className={clsx(i === step && "bg-gray-200")}
//                                                 variant="outline" size="sm">
//                                                 {i + 1}
//                                             </Button>
//                                         ))}
//                                     </ButtonGroup>
//                                     <ButtonGroup>
//                                         {step > 0 && (
//                                             <Button
//                                                 onClick={() => setStep((prev) => prev - 1)}
//                                                 variant="outline" size="icon-sm" aria-label="Previous">
//                                                 <ArrowLeftIcon />
//                                             </Button>
//                                         )}
//                                         {step < steps.length - 1 ? (
//                                             <Button
//                                                 onClick={() => setStep((prev) => prev + 1)}
//                                                 variant="outline" size="icon-sm" aria-label="Next">
//                                                 <ArrowRightIcon />
//                                             </Button>
//                                         ) : (
//                                             <Button
//                                                 type="submit"
//                                                 size="sm"
//                                                 className='text-xs'
//                                                 variant="outline">
//                                                 Submit
//                                             </Button>
//                                         )}
//                                     </ButtonGroup>
//                                 </div>
//                             </form>
//                         </div>



//                         <div className="md:w-7/12 space-y-2 p-4">

//                             <div className='flex justify-between items-center'>
//                                 <span className="bg-gray-100 text-gray-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-sm border border-gray-300">Preview</span>
//                                 <input
//                                     type="color"
//                                     name=""
//                                     value={primaryColor}
//                                     className='rounded'
//                                     onChange={handleColorChange} id=""
//                                     style={{ borderColor: primaryColor }}
//                                 />
//                             </div>

//                             <TemplateComponent form={form} textcolor={textColor} bgcolor={primaryColor} />


//                         </div>
//                     </div>

//                 </main>
//             </div>
//         </Layout>
//     );
// };

// export default Editing;



import React, { useEffect, useState } from "react";
import Layout from "../Layout/PageLayout";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
import { useFormContext } from "../context/FormContext";
import { useParams } from "react-router-dom";
import { getTemplateById } from "../templates/TemplateManager";
import FormFillStep from "../components/common/FormFillStep";
import { ButtonGroup } from "../components/ui/button-group";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader } from "../components/ui/card";
import { ScrollArea } from "../components/ui/scroll-area";
import { Separator } from "../components/ui/separator";
import { Badge } from "../components/ui/badge";
import { Popover, PopoverTrigger, PopoverContent } from "../components/ui/popover";
import clsx from "clsx";
import { motion } from "framer-motion";

const steps = ["profile", "experience", "skills", "projects", "education"];

const Editing: React.FC = () => {
    const { id }: any = useParams();
    const template = getTemplateById(id);
    const TemplateComponent: any = template?.component;

    const [step, setStep] = useState(0);

    const { form, handleSubmit, textColor, setTextColor, primaryColor, setPrimaryColor } =
        useFormContext();

    useEffect(() => {
        document.title = "Create Resume";
    }, []);

    const handleColorChange = (e: any) => {
        const selectedColor = e.target.value;
        setPrimaryColor(selectedColor);
        setTextColor(getContrastColor(selectedColor));
    };

    const getContrastColor = (hexColor: string) => {
        const color = hexColor.replace("#", "");
        const r = parseInt(color.substr(0, 2), 16);
        const g = parseInt(color.substr(2, 2), 16);
        const b = parseInt(color.substr(4, 2), 16);
        const brightness = (r * 299 + g * 587 + b * 114) / 1000;
        return brightness > 128 ? "#000000" : "#ffffff";
    };

    const capitalize = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);

    return (
        <Layout>
            <div className="flex flex-col md:flex-row w-full min-h-screen">  {/* //bg-[#f1f8fc] */}
                {/* Tracker Sidebar */}
                <aside className="hidden md:flex flex-col w-[14%] p-4 bg-[#e6f4fd] border-r border-gray-200">
                    <div className="flex justify-between text-[#213963] mb-4">
                        <h3 className="text-lg font-semibold">Tracker</h3>
                    </div>

                    <ScrollArea className="h-[80vh] pr-2">
                        <ol className="space-y-6">
                            {steps.map((label, i) => (
                                <div
                                    key={i}
                                    className="flex items-center gap-3 cursor-pointer"
                                    onClick={() => setStep(i)}
                                >
                                    <>
                                        <div
                                            className={clsx(
                                                "w-8 h-8 rounded-full flex items-center justify-center font-semibold border",
                                                i === step
                                                    ? "bg-[#11a8e4] text-white border-[#11a8e4]"
                                                    : "border-gray-300 text-gray-500"
                                            )}
                                        >
                                            {i + 1}
                                        </div>
                                        <span
                                            className={clsx(
                                                "font-medium text-sm",
                                                i === step ? "text-[#213963]" : "text-gray-500"
                                            )}
                                        >
                                            {capitalize(label)}
                                        </span>
                                        {i === step && (
                                            <svg
                                                className="w-4 h-4 text-green-400 ml-1"
                                                aria-hidden="true"
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="currentColor"
                                                viewBox="0 0 22 20"
                                            >
                                                <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                                            </svg>
                                        )}
                                    </>
                                </div>
                            ))}
                        </ol>
                    </ScrollArea>
                </aside>

                {/* Main Content */}
                <main className="flex-1 flex flex-col md:flex-row">
                    {/* Left - Form */}
                    <div className="md:w-5/12 p-6 md:p-8 space-y-6">
                        <h1 className="text-2xl font-semibold text-[#212834] orbitron-head">
                            Personal Details
                        </h1>
                        <Card className="shadow-lg border border-gray-100">
                            <CardHeader>
                                <h2 className="text-sm font-medium capitalize mb-2">
                                    {steps[step]}
                                </h2>
                                <Separator />
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSubmit}>
                                    <FormFillStep steps={steps} step={step} />

                                    <div className="flex justify-between mt-6">
                                        <ButtonGroup>
                                            {steps.map((_, i) => (
                                                <Button
                                                    key={i}
                                                    className={clsx(i === step && "bg-gray-200")}
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => setStep(i)}
                                                >
                                                    {i + 1}
                                                </Button>
                                            ))}
                                        </ButtonGroup>
                                        <ButtonGroup>
                                            {step > 0 && (
                                                <Button
                                                    onClick={() => setStep((prev) => prev - 1)}
                                                    variant="outline"
                                                    size="icon-sm"
                                                    aria-label="Previous"
                                                >
                                                    <ArrowLeftIcon />
                                                </Button>
                                            )}
                                            {step < steps.length - 1 ? (
                                                <Button
                                                    onClick={() => setStep((prev) => prev + 1)}
                                                    variant="outline"
                                                    size="icon-sm"
                                                    aria-label="Next"
                                                >
                                                    <ArrowRightIcon />
                                                </Button>
                                            ) : (
                                                <Button
                                                    type="submit"
                                                    size="sm"
                                                    className="text-xs"
                                                    variant="default"
                                                >
                                                    Submit
                                                </Button>
                                            )}
                                        </ButtonGroup>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right - Preview */}
                    <div className="md:w-7/12 bg-gray-50 border-l border-gray-200">
                        <div className="flex px-4 py-2 bg-blue-50 justify-between items-center">
                            <Badge
                                variant="outline"
                                className="text-xs px-3 py-1 border bg-gray-100 text-gray-700"
                            >
                                Preview
                            </Badge>

                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="border-gray-300 text-gray-700"
                                    >
                                        🎨 Customize
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-40 flex justify-center p-4">
                                    <input
                                        type="color"
                                        value={primaryColor}
                                        onChange={handleColorChange}
                                        className="w-16 h-16 cursor-pointer rounded-full border-none"
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>

                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4 }}
                            className="bg-white p-1 shadow-lg border border-gray-200 overflow-auto max-h-[80vh]"
                            style={{ "scrollbarColor": "transparent transparent" }}
                        >
                            <TemplateComponent
                                form={form}
                                textcolor={textColor}
                                bgcolor={primaryColor}
                            />
                        </motion.div>
                    </div>
                </main>
            </div>
        </Layout>
    );
};

export default Editing;
