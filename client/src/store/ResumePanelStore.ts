import { create } from "zustand";

export type TabId = "preview" | "templates" | "ai" | "score";

type Template = {
  id: string;
  name: string;
  is_premium?: boolean;
  preview_bg?: string;
  tokens?: {
    accent?: string;
  };
};

type ResumeRightPanelState = {
  activeTab: TabId;
  selectedTmpl: string;
  localActiveTmpl: Template | undefined;
  mobileSheetOpen: boolean;

  setActiveTab: (tab: TabId) => void;
  setSelectedTmpl: (id: string) => void;
  setLocalActiveTmpl: (template: Template | undefined) => void;
  setMobileSheetOpen: (open: boolean) => void;

  selectTemplate: (
    id: string,
    templates?: Template[]
  ) => void;

  openTab: (
    id: TabId,
    isMobile: boolean
  ) => void;
};

export const useResumeRightPanelStore =
  create<ResumeRightPanelState>((set) => ({
    activeTab: "preview",
    selectedTmpl: "",
    localActiveTmpl: undefined,
    mobileSheetOpen: false,

    setActiveTab: (tab) =>
      set({
        activeTab: tab,
      }),

    setSelectedTmpl: (id) =>
      set({
        selectedTmpl: id,
      }),

    setLocalActiveTmpl: (template) =>
      set({
        localActiveTmpl: template,
      }),

    setMobileSheetOpen: (open) =>
      set({
        mobileSheetOpen: open,
      }),

    selectTemplate: (id, templates) => {
      const found = templates?.find(
        (template) => template.id === id
      );

      set({
        selectedTmpl: id,
        localActiveTmpl: found,
        activeTab: "preview",
        mobileSheetOpen: false,
      });
    },

    openTab: (id, isMobile) =>
      set({
        activeTab: id,
        mobileSheetOpen: isMobile,
      }),
  }));