import React from "react";
import { Clock, Edit, Trash } from "lucide-react";
import MiniResumeThumbnail from "./MiniResumeThumbnail";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Button } from "../ui/button";
import { ResumeOut } from "../../services/resume.services";
import { TemplateOut } from "../../services/ai.services";
import { formatRelativeTime } from "../../lib/utils";

interface HistoryCardProps {
    resume: ResumeOut;
    tmpl: TemplateOut | undefined;
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

    return (
        <div
            onClick={() => onEdit(resume)}
            className="relative p-2 rounded-[10px] text-left cursor-pointer outline-none transition-all"
            style={{
                border: `2px solid ${accent}`,
                background: "#fafafa",
                boxShadow: `0 0 0 3px ${accent}18`,
            }}
        >
            <div className="absolute right-2 z-20 flex gap-2">

                <Dialog>
                    <DialogTrigger
                        onClick={() => onRequestDelete({ id: resume.id, title: deleteTitle })}
                    >
                        <Trash className="bg-gray-300 p-1 rounded-full text-red-600" size={24} />
                    </DialogTrigger>
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
            </div>

            <div className="relative rounded overflow-hidden border border-[#e5e7eb] bg-white mb-[7px]">
                <MiniResumeThumbnail tmpl={tmpl} scale={0.265} />
            </div>

            <div className="flex items-center">
                <div className="text-[11px] font-bold">{resume.title}</div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                <span className="flex items-center gap-1">
                    <Clock size={11} /> Updated {formatRelativeTime(resume.updated_at)}
                </span>
            </div>

            <div className="text-[10px] text-[#9ca3af]">{tmpl?.description}</div>
        </div>
    );
};

export default HistoryCard;