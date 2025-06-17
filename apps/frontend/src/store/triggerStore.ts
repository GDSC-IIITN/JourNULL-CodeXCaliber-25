import { create } from "zustand";

export const useTriggerStore = create<{
    trigger: boolean;
    setTrigger: (trigger: boolean) => void;
}>((set) => ({
    trigger: false,
    setTrigger: (trigger) => set({ trigger }),
}));