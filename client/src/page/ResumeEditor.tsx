import React, { useEffect, useState } from "react";
import Layout from "../Layout/PageLayout";
import { ArchiveRestoreIcon, ArrowLeftIcon, ArrowRightIcon, Brain, FileType, Languages, Milestone, UserIcon, Wallet } from "lucide-react";
import { useParams, useLocation } from "react-router-dom";
import FormFillStep from "../components/common/FormFillStep";
import { ButtonGroup } from "../components/ui/button-group";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader } from "../components/ui/card";
import LayoutStack from "../templates/LayoutStack";
import { DefaultData } from '../data.json'
import { cn, LAYOUT_MAP } from "../lib/utils";
import ResumeRightPanel from "../components/common/ResumeRightPanel";
import { useTemplates } from "../hooks/useAI";
import { useCreateResume, useResume, useUpdateResume } from "../hooks/useResume";
import { toast } from "sonner";
import DashboardLayout from "../Layout/DashboardLayout";
import { useFormStore } from "../store/form.store";


const steps: Record<string, React.ElementType> = {
  personal: UserIcon,
  summary: UserIcon,
  experience: Wallet,
  education: UserIcon,
  skills: Brain,
  projects: FileType,
  achievements: ArchiveRestoreIcon,
  languages: Languages,
  certifications: Milestone,
};

const stepKeys = Object.keys(steps);

const Editing: React.FC = () => {
  const { id: templateId } = useParams<{ id: string }>();
  const location = useLocation();

  const resumeId = location.state?.resumeId;
  const isEdit = location.state?.isEdit;

  const { data: templates, isLoading: templatesLoading } = useTemplates();

  const {
    data: existingResume,
    isLoading: resumeLoading,
  } = useResume(resumeId);

  const createResume = useCreateResume();
  const updateResume = useUpdateResume(resumeId);

  const activeTmpl = templates?.find((t) => t.id === templateId);

  useEffect(() => {
    if (!activeTmpl) return;
  }, [activeTmpl]);


  const ActiveLayout = activeTmpl?.layout
    ? (LAYOUT_MAP[activeTmpl.layout] ?? LayoutStack)
    : LayoutStack;


  const [step, setStep] = useState(0);
  const { form, setForm } = useFormStore();

  useEffect(() => {
    if (!existingResume || !isEdit) return;
    setForm(existingResume.data);
  }, [existingResume, isEdit, setForm]);


  const handleFinalSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    const payload = {
      title: form.name,
      template_id: templateId,
      data: form,
    };

    try {
      if (isEdit && resumeId) {
        await updateResume.mutateAsync(payload);
        toast.success("Resume Updated Successfully!", { position: "bottom-left" })
      } else {
        await createResume.mutateAsync(payload);
        toast.success("Resume Created Successfully!", { position: "bottom-left" })
      }
    } catch (err) {
      console.error("ERROR", err);
      toast.warning("Failed to save resume", { position: "bottom-left" })
    }
  };


  useEffect(() => {
    document.title = "Create Resume";
  }, []);

  if (
    templatesLoading ||
    resumeLoading ||
    !activeTmpl
  ) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-screen">
          <p className="text-sm text-gray-400">Loading template…</p>
        </div>
      </Layout>
    );
  }

  const capitalize = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);

  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row min-h-screen">

        {/* Main Content */}
        <main className="flex-1 flex flex-col md:flex-row">
          {/* Left - Form */}
          <div className="md:w-5/12 p-3 space-y-6 min-w-0">
            <Card className="border-none shadow-none">
              <CardHeader>
                <h1 className="text-xl sm:text-2xl font-semibold text-[#212834] orbitron-head">
                  <div className="flex items-center orbitron-head gap-2 mb-2">
                    {(() => {
                      const Icon = steps[stepKeys[step]];
                      return <Icon className="w-5 h-5 sm:w-6 sm:h-6 shrink-0" />;
                    })()}
                    <span className="truncate">{capitalize(stepKeys[step])}</span>
                  </div>
                </h1>
                <h4 className="text-sm">
                  Detail your professional journey. AI will help refine your bullet points.
                </h4>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleFinalSubmit}>
                  <FormFillStep steps={stepKeys} step={step} />

                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mt-6">
                    <ButtonGroup className="flex-wrap gap-1.5">
                      {stepKeys.map((_, i) => (
                        <Button
                          type="button"
                          key={i}
                          className={cn("shrink-0", i === step && "bg-gray-200")}
                          variant="outline"
                          size="sm"
                          onClick={() => setStep(i)}
                        >
                          {i + 1}
                        </Button>
                      ))}
                    </ButtonGroup>
                    <ButtonGroup className="self-stretch sm:self-auto">
                      {step > 0 && (
                        <Button
                          type="button"
                          onClick={() => setStep((prev) => prev - 1)}
                          variant="outline"
                          size="default"
                          aria-label="Previous"
                          className="shrink-0"
                        >
                          <ArrowLeftIcon />
                        </Button>
                      )}
                      {step < stepKeys.length - 1 ? (
                        <Button
                          type="button"
                          onClick={() => setStep((prev) => prev + 1)}
                          variant="outline"
                          size="default"
                          className="bg-[#11a8e4] text-white flex-1 sm:flex-initial min-w-0"
                          aria-label="Next"
                        >
                          <span className="truncate">Next : {capitalize(stepKeys[step + 1])}</span>
                          <ArrowRightIcon className="shrink-0" />
                        </Button>
                      ) : (
                        <Button
                          type="submit"
                          size="default"
                          className="text-xs flex-1 sm:flex-initial"
                          variant="default"
                          disabled={updateResume.isPending}
                        >
                          {isEdit
                            ? updateResume.isPending
                              ? "Updating..."
                              : "Update Resume"
                            : "Submit"}
                        </Button>
                      )}
                    </ButtonGroup>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
          <ResumeRightPanel
            form={form}
            DefaultData={DefaultData}
            ActiveLayout={ActiveLayout}
            activeTmpl={activeTmpl}
            layoutMap={LAYOUT_MAP}
            resumeId={resumeId}
          />
        </main>
      </div>
    </DashboardLayout>
  );
};

export default Editing;
