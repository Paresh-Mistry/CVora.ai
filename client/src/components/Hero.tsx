import { ArrowRight } from 'lucide-react'
import React from 'react'

const Hero: React.FC = () => {
    return (
        <section className="container max-w-10/12 mx-auto py-8 dark:bg-gray-900 px-4">
            <div className="flex justify-between flex-col md:flex-row gap-5">
                <div className="space-y-8">
                    <h1 className="max-w-2xl text-4xl font-extrabold tracking-tight leading-none md:text-5xl xl:text-6xl dark:text-white">
                        Create Your <span className='text-red-500'>Professional CV</span> Effortlessly
                    </h1>
                    <p className="max-w-2xl font-light text-gray-500 lg:mb-8 md:text-lg lg:text-xl dark:text-gray-400">
                        Build a standout CV in minutes with our easy-to-use templates and AI-powered suggestions. Perfect for job seekers looking to make a great first impression.
                    </p>
                    <a href="#" className="inline-flex gap-2 items-center justify-center px-5 py-3 mr-3 text-base font-medium text-red-500 rounded-lg border border-red-500">
                        Get Started <ArrowRight size={16}/>
                    </a>
                    {/* <a href="#" className="inline-flex items-center justify-center px-5 py-3 text-base font-medium text-center text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 dark:text-white dark:border-gray-700 dark:hover:bg-gray-700 dark:focus:ring-gray-800">
                        Create My CV
                    </a> */}
                </div>
                <div>
                    <img src="https://resumegenius.com/wp-content/uploads/picture-photo-resume-template-black-Hub.png" className='h-[30em] shadow-lg shadow-red-100 border-2 rounded-l-3xl border-r-white border-red-500 w-2xl' alt="" />
                </div>
            </div>
        </section>
    )
}

export default Hero