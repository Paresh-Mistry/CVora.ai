import { create } from "zustand";

interface SidebarStore {
  collapsed: boolean;
  mobileOpen: boolean;

  toggleCollapsed: () => void;
  setCollapsed: (collapsed: boolean) => void;

  setMobileOpen: (open: boolean) => void;
  toggleMobileOpen: () => void;
}

export const useSidebarStore = create<SidebarStore>((set) => ({
  collapsed: true,
  mobileOpen: false,

  toggleCollapsed: () =>
    set((state) => ({
      collapsed: !state.collapsed,
    })),

  setCollapsed: (collapsed) =>
    set({
      collapsed,
    }),

  setMobileOpen: (mobileOpen) =>
    set({
      mobileOpen,
    }),

  toggleMobileOpen: () =>
    set((state) => ({
      mobileOpen: !state.mobileOpen,
    })),
}));