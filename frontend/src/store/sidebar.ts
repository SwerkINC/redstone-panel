import { create } from 'zustand';

/** Sidebar store */
export interface SidebarStore {
    open: boolean;
    setOpen: (open: boolean) => void;
}

/** Sidebar store */
export const useSidebarStore = create<SidebarStore>((set) => ({
    open: false,
    setOpen: (open: boolean) => set({ open }),
}));
