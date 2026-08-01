import React, { useRef, useState } from "react";
import { Clock, Edit2, EllipsisVertical, Eye, Trash } from "lucide-react";
import MiniResumeThumbnail from "./MiniResumeThumbnail";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Button } from "../ui/button";
import { ResumeOut } from "../../services/resume.services";
import { TemplateOut } from "../../services/ai.services";
import { formatRelativeTime, LAYOUT_MAP } from "../../lib/utils";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Separator } from "../ui/separator";
import ResumePreview from "./ResumePreview";
import { PDFExportButton } from "./PdfExportButton";

interface HistoryCardProps {
    resume: ResumeOut;
    tmpl: TemplateOut;
    isDeleting: boolean;
    onEdit: (resume: ResumeOut) => void;
    onRequestDelete: (target: { id: string; title: string }) => void;
    onConfirmDelete: () => void;
    onCancelDelete: () => void;
}

const HistoryCard: React.FC<HistoryCardProps> = ({
    resume,
    tmpl,
    isDeleting,
    onEdit,
    onRequestDelete,
    onConfirmDelete,
    onCancelDelete,
}) => {
    const accent = tmpl?.tokens?.accent;
    const deleteTitle = resume.data?.name || resume.title || "Unknown Resume";
    const size = 64;
    const stroke = 5;
    const radius = (size - stroke) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (resume?.insight?.score / 100) * circumference;
    const ActiveLayout = tmpl?.layout && LAYOUT_MAP[tmpl.layout];
    const hiddenRef = useRef<HTMLDivElement>(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [previewOpen, setPreviewOpen] = useState(false);
    return (
        <div
            className={"relative p-3 rounded-2xl text-left cursor-pointer outline-none transition-all border border-[#eef0f2]"}
        >
            {/* Thumbnail */}
            <div className="relative rounded-xl overflow-hidden border border-[#e5e7eb] bg-white mb-3">
                <MiniResumeThumbnail scale={0.285} tmpl={tmpl} />
                {resume?.insight?.score && <div
                    className="absolute -top-3 -right-3 m-3 z-30 flex flex-col items-center justify-center bg-white rounded-full shadow-[0_2px_10px_rgba(0,0,0,0.12)] border border-[#eef0f2]"
                >
                    <svg width="40" height="40" viewBox="0 0 72 72">
                        <circle cx="36" cy="36" r="28" fill="none" stroke="#e5e7eb" strokeWidth="6" />
                        <circle
                            cx="36" cy="36" r="28" fill="none"
                            stroke={resume?.insight?.score >= 70 ? "#16a34a" : resume?.insight?.score >= 40 ? "#d97706" : "#dc2626"}
                            strokeWidth="6"
                            strokeDasharray={circumference}
                            strokeDashoffset={offset}
                            strokeLinecap="round"
                            transform="rotate(-90 36 36)"
                            style={{ transition: "stroke-dashoffset 0.6s ease" }}
                        />
                        <text x="36" y="44" textAnchor="middle" fontSize="20" fontWeight="600" fill="#111827">
                            {resume?.insight?.score}
                        </text>
                    </svg>
                </div>}
            </div>

            {/* Title row */}
            <div className="flex justify-between items-center gap-1.5 mb-1">
                <div style={{ color: accent }} className="text-[11px] font-bold text-slate-900 truncate">{resume.title}</div>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <EllipsisVertical
                            size={18}
                            className="mt-0.5 cursor-pointer shrink-0 text-slate-400 hover:text-slate-600"
                        />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuLabel>{resume.title} <Separator orientation="vertical" /> <span className="text-xs">Last edited {formatRelativeTime(resume.updated_at)}</span></DropdownMenuLabel>
                        {/* <DropdownMenuLabel className="text-xs">{resume.id}</DropdownMenuLabel> */}
                        <Separator />
                        <DropdownMenuItem
                            onClick={() => {
                                onRequestDelete({ id: resume.id, title: deleteTitle });
                                setIsDeleteDialogOpen(true);
                            }}
                            variant="destructive"
                        >
                            <Trash />
                            Delete
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onEdit(resume)}>
                            <Edit2 />
                            Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setPreviewOpen(true)}>
                            <Eye />
                            Preview
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>


                <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Are you absolutely sure?</DialogTitle>
                            <DialogDescription>
                                <span className="font-medium text-slate-700">
                                    <q>{deleteTitle}</q>
                                </span>{" "}
                                will be permanently deleted. This action can't be undone.
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button variant="outline" disabled={isDeleting} onClick={onCancelDelete}>
                                    Cancel
                                </Button>
                            </DialogClose>
                            <Button type="submit" disabled={isDeleting} onClick={onConfirmDelete}>
                                {isDeleting ? "Deleting.." : "Delete Resume"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
                <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
                    <DialogContent className="w-full max-w-4xl">
                        <DialogHeader>
                            <DialogTitle>{resume.title}</DialogTitle>
                            <PDFExportButton previewRef={hiddenRef} resumeName={resume.title} />
                        </DialogHeader>
                        <div className="w-full overflow-auto">
                            <ResumePreview
                                data={resume.data}
                                activeTmpl={tmpl}
                                ActiveLayout={ActiveLayout}
                                enableScaling={true}
                                previewRef={hiddenRef}
                            />
                        </div>
                        <DialogFooter className="text-xs text-muted-foreground">
                            Updated on {resume.updated_at}
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Meta row */}
            <div className="flex items-center gap-1 text-[10px] text-slate-400">
                <Clock size={12} />
                Last edited {formatRelativeTime(resume.updated_at)}
            </div>
        </div>
    );
};

export default HistoryCard;