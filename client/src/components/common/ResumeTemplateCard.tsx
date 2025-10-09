import { useNavigate } from 'react-router-dom'


const TemplateCard = ({ id, name }: { id: number, name: string, component:React.ComponentType<any>}) => {
    const navigate = useNavigate()
    return (
        <>
            <div
                onClick={() => navigate(`/template/${id}/resume`)}
                className="relative rounded-lg overflow-hidden w-full cursor-pointer grid place-items-center bg-amber-100 shadow-md border border-gray-200 hover:shadow-lg h-64 transition"
            >
                <div className="w-full flex flex-col items-center justify-center z-20">
                    <span className="text-sm px-2 py-1 font-semibold text-amber-900">{name}</span>
                    <span className="absolute bottom-2 border rounded-2xl border-amber-600 text-amber-600 right-2 text-xs px-1 font-semibold">{id}</span>
                </div>
            </div>

        </>
    )
}

export default TemplateCard
