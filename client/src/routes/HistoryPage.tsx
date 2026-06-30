import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../Layout/PageLayout";
import { useResumes, useDeleteResume } from "../hooks/useResume";
import { useTemplates } from "../hooks/useAI";
import HistoryCard from "../components/common/HistoryCard";
import { ResumeOut } from "../services/resume.services";
import { TemplateOut } from "../services/ai.services";

function ResumeCardSkeleton() {
    return (
        <div className="border border-slate-100 rounded-2xl p-4 animate-pulse">
            <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-slate-100" />
                <div className="flex-1 space-y-2">
                    <div className="h-3 bg-slate-100 rounded w-2/3" />
                    <div className="h-2.5 bg-slate-100 rounded w-1/3" />
                </div>
            </div>
            <div className="h-2.5 bg-slate-100 rounded w-full mb-2" />
            <div className="h-2.5 bg-slate-100 rounded w-4/5" />
        </div>
    );
}

const HistoryPage: React.FC = () => {
    const navigate = useNavigate();
    const { data: resumes, isLoading: resumesLoading, isError: resumesError } = useResumes();
    const { data: templates } = useTemplates();
    const deleteResume = useDeleteResume();
    const [pendingDelete, setPendingDelete] = useState<{ id: string; title: string } | null>(null);

    const handleEdit = (resume: ResumeOut) => {
        navigate(`/template/${resume.template_id}/resume`, {
            state: {
                resumeId: resume.id,
                resumeData: resume,
                isEdit: true,
            },
        });
    };

    const handleDeleteConfirm = () => {
        if (!pendingDelete) return;
        deleteResume.mutate(pendingDelete.id, {
            onSuccess: () => setPendingDelete(null),
            onError: () => setPendingDelete(null), // could show a toast here instead
        });
    };

    return (
        <Layout>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14">

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10">
                    <div>
                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#212834] leading-tight">
                            Find Your
                            <span className="ml-2 bg-gradient-to-r from-[#11a8e4] to-[#63c5ea] bg-clip-text text-transparent mozilla-headline-hero">
                                Resume&apos;s
                            </span>
                        </h1>
                        <p className="text-gray-500 mt-2 text-sm md:text-base font-serif">
                            Choose from a variety of elegant, modern, and professional templates.
                        </p>
                    </div>
                </div>

                {resumesError && (
                    <div className="bg-red-50 border border-red-100 rounded-xl p-4 text-sm text-red-600 mb-6">
                        Failed to load your resumes. Please refresh the page.
                    </div>
                )}

                {resumesLoading && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <ResumeCardSkeleton key={i} />
                        ))}
                    </div>
                )}

                {!resumesLoading && !resumesError && resumes && resumes.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                        {resumes.map((resume: ResumeOut) => {
                            const tmpl: TemplateOut | undefined = templates?.find(
                                (t: TemplateOut) => t.id === resume.template_id
                            );
                            return (
                                <>
                                <HistoryCard
                                    key={resume.id}
                                    resume={resume}
                                    tmpl={tmpl}
                                    isDeleting={deleteResume.isPending && pendingDelete?.id === resume.id}
                                    onEdit={handleEdit}
                                    onRequestDelete={setPendingDelete}
                                    onConfirmDelete={handleDeleteConfirm}
                                    onCancelDelete={() => setPendingDelete(null)}
                                />
                                </>
                            );
                        })}
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default HistoryPage;