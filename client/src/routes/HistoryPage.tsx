import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../Layout/PageLayout";
import { useResumes, useDeleteResume } from "../hooks/useResume";
import { useTemplates } from "../hooks/useAI";
import { Clock, Edit, Trash } from "lucide-react";
import MiniResumeThumbnail from "../components/common/MiniResumeThumbnail";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import { Button } from "../components/ui/button";


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


// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatRelativeTime(dateStr: string): string {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMin = Math.floor(diffMs / 60000);
    const diffHr = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHr / 24);

    if (diffMin < 1) return "Just now";
    if (diffMin < 60) return `${diffMin}m ago`;
    if (diffHr < 24) return `${diffHr}h ago`;
    if (diffDay < 7) return `${diffDay}d ago`;
    return date.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}



const HistoryPage: React.FC = () => {
    const navigate = useNavigate();
    const { data: resumes, isLoading: resumesLoading, isError: resumesError } = useResumes();
    const { data: templates } = useTemplates();
    const deleteResume = useDeleteResume();
    const [pendingDelete, setPendingDelete] = useState<{ id: string; title: string } | null>(null);

    const handleEdit = (resume: any) => {
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

                        {resumes.map((resume) => {
                            const tmpl = templates?.find(
                                (t) => t.id === resume.template_id
                            );
                            return (
                                <>
                                    <div
                                        className="relative p-2 rounded-[10px] text-left cursor-pointer outline-none transition-all"
                                        style={{
                                            border: `2px solid ${tmpl?.tokens.accent}`,
                                            background: "#fafafa",
                                            boxShadow: `0 0 0 3px ${tmpl?.tokens.accent}18`
                                        }}
                                    >
                                        <div className="absolute right-2 z-20 flex gap-2">
                                            <span onClick={() => handleEdit(resume)} className="flex items-center justify-center font-medium gap-1 bg-gray-300 text-xs px-1.5 rounded-full">
                                                <Edit size={14} />
                                                Edit
                                            </span>
                                            <Dialog>
                                                <DialogTrigger
                                                    onClick={() => setPendingDelete({ id: resume.id, title: resume.data?.name || resume.title })}>
                                                    <Trash className="bg-gray-300 p-1 rounded-full text-red-600" size={24} />
                                                </DialogTrigger>
                                                <DialogContent>
                                                    <DialogHeader>
                                                        <DialogTitle>Are you absolutely sure?</DialogTitle>
                                                        <DialogDescription>
                                                            <span className="font-medium text-slate-700"><q>{pendingDelete?.title || "Unknown Resume"}</q></span> will be permanently
                                                            deleted. This action can't be undone.
                                                        </DialogDescription>
                                                    </DialogHeader>
                                                    <DialogFooter>
                                                        <DialogClose asChild>
                                                            <Button variant="outline" disabled={deleteResume.isPending} onClick={() => setPendingDelete(null)}>Cancel</Button>
                                                        </DialogClose>
                                                        <Button type="submit" disabled={deleteResume.isPending} onClick={handleDeleteConfirm}>
                                                            {deleteResume.isPending ? "Deleting.." : "Delete Resume"}
                                                        </Button>
                                                    </DialogFooter>
                                                </DialogContent>
                                            </Dialog>
                                        </div>
                                        <div className="relative rounded overflow-hidden border border-[#e5e7eb] bg-white mb-[7px]">
                                            <MiniResumeThumbnail
                                                tmpl={tmpl}
                                                scale={0.265}
                                            />
                                        </div>

                                        <div className="flex items-center">
                                            <div className="text-[11px] font-bold">{resume.title}</div>
                                        </div>
                                        <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                                            <span className="flex items-center gap-1">
                                                <Clock size={11} /> Updated {formatRelativeTime(resume.updated_at)}
                                            </span>
                                        </div>

                                        <div className="text-[10px] text-[#9ca3af] ">
                                            {tmpl?.description}
                                        </div>
                                    </div>
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