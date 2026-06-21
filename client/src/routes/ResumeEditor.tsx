
import React, { useEffect, useState } from "react";
import Layout from "../Layout/PageLayout";
import { ArchiveRestoreIcon, ArrowLeftIcon, ArrowRightIcon, Brain, FileType, Languages, Milestone, UserIcon, Wallet } from "lucide-react";
import { useFormContext } from "../context/FormContext";
import { useParams, useLocation } from "react-router-dom";
import FormFillStep from "../components/common/FormFillStep";
import { ButtonGroup } from "../components/ui/button-group";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader } from "../components/ui/card";
import { ScrollArea } from "../components/ui/scroll-area";
import LayoutStack from "../templates/LayoutStack";
import LayoutSidebar from "../templates/LayoutSidebar";
import LayoutBanner from "../templates/LayoutBanner";
import { DefaultData } from '../data.json'
import { cn } from "../lib/utils";
import ResumeRightPanel from "../components/common/ResumeRightPanel";
import { useTemplates } from "../hooks/useAI";
import { useCreateResume, useResume, useUpdateResume } from "../hooks/useResume";


const steps: Record<string, React.ElementType> = {
  personal: UserIcon,
  experience: Wallet,
  education: UserIcon,
  skills: Brain,
  projects: FileType,
  achievements: ArchiveRestoreIcon,
  languages: Languages,
  certifications: Milestone,
};

const stepKeys = Object.keys(steps);


const LAYOUT_MAP: Record<string, React.ComponentType<{ d: any; tk: any }>> = {
  A: LayoutStack,
  B: LayoutSidebar,
  C: LayoutBanner,
};

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

  const activeTmpl =
    templates?.find((t) => t.id === templateId);

  useEffect(() => {
    if (!activeTmpl) return;
  }, [activeTmpl]);


  const ActiveLayout = activeTmpl?.layout
    ? (LAYOUT_MAP[activeTmpl.layout] ?? LayoutStack)
    : LayoutStack;


  const [step, setStep] = useState(0);
  const { form, setForm } = useFormContext();

  useEffect(() => {
    if (!existingResume || !isEdit) return;
    setForm(existingResume?.data);
  }, [existingResume, isEdit, setForm]);


  const handleFinalSubmit = async (
    e: React.FormEvent
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

        alert("Resume Updated Successfully!");
      } else {
        await createResume.mutateAsync(payload);

        alert("Resume Created Successfully!");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to save resume");
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
    <Layout>
      <div className="flex flex-col md:flex-row w-full ">  {/* //bg-[#f1f8fc] */}
        {/* Tracker Sidebar */}
        <aside className="hidden md:flex flex-col w-[14%] p-4  border-r">
          <div className="flex justify-between text-[#213963] mb-4">
            <h3 className={"font-semibold mozilla-headline-hero text-2xl"}>Tracker</h3>
          </div>

          <ScrollArea className="h-[80vh] pr-2">
            <ol className="space-y-6">
              {stepKeys.map((label, i) => {
                const Icon = steps[label];
                return (
                  <div
                    key={i}
                    className={cn("flex items-center bg-[#f7f4f0] rounded-full gap-3 cursor-pointer", i === step ? "text-[#213963] bg-[#e6f4fd]" : "text-gray-500")}
                    onClick={() => setStep(i)}
                  >
                    <>
                      <div
                        className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center font-semibold border",
                          i === step
                            ? "bg-[#11a8e4] text-white border-[#11a8e4]"
                            : "border-gray-300 text-gray-500"
                        )}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <span
                        className={cn(
                          "font-medium text-sm",
                          i === step ? "text-[#213963]" : "text-gray-600"
                        )}
                      >
                        {capitalize(label)}
                      </span>
                    </>
                  </div>
                )
              })}
            </ol>
          </ScrollArea>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col md:flex-row">
          {/* Left - Form */}
          <div className="md:w-5/12 p-3 space-y-6">
            <Card className="border-none shadow-none">
              <CardHeader>
                <h1 className="text-2xl font-semibold text-[#212834] orbitron-head">
                  <div className="flex items-center orbitron-head gap-2 mb-2">
                    {(() => {
                      const Icon = steps[stepKeys[step]];
                      return <Icon className="w-6 h-6" />;
                    })()}
                    {capitalize(stepKeys[step])}
                  </div>
                </h1>
                <h4 className="text-sm">
                  Detail your professional journey. AI will help refine your bullet points.
                </h4>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleFinalSubmit}>
                  <FormFillStep steps={stepKeys} step={step} />

                  <div className="flex justify-between mt-6">
                    <ButtonGroup>
                      {stepKeys.map((_, i) => (
                        <Button
                          type="button"
                          key={i}
                          className={cn(i === step && "bg-gray-200")}
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
                          type="button"
                          onClick={() => setStep((prev) => prev - 1)}
                          variant="outline"
                          size="icon-sm"
                          aria-label="Previous"
                        >
                          <ArrowLeftIcon />
                        </Button>
                      )}
                      {step < stepKeys.length - 1 ? (
                        <Button
                          type="button"
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
          />
        </main>
      </div>
    </Layout>
  );
};

export default Editing;