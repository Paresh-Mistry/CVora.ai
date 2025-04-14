import React from 'react'
import { useNavigate } from 'react-router-dom'


const TemplateCard = ({ id, name, component: Component }: { id: string, name: string, component: React.FC }) => {
    const navigate = useNavigate()
    return (
        <>
            <div
                onClick={() => navigate(`/template/${id}/resume`)}
                className="w-60 relative rounded-lg overflow-hidden shadow-md border border-gray-200 bg-white hover:shadow-lg transition"
            >
                <div className='h-70'>
                    <img
                        className="w-full"
                        src="https://images.unsplash.com/photo-1531913223931-b0d3198229ee?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fHJlc3VtZXxlbnwwfHwwfHx8MA%3D%3D"
                        alt="Resume Template"
                    />
                </div>
                <div className="absolute bottom-3 w-full flex items-center justify-center z-20">
                    <span className="text-sm shadow shadow-gray-400 px-2 py-1 rounded-full font-semibold text-white backdrop-blur-md bg-transparent">{name}</span>
                </div>
            </div>
        </>
    )
}

export default TemplateCard