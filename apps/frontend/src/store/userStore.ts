import { User } from "better-auth/types";
import { create } from "zustand";

export const useUserStore = create<{
    user: User | null;
    setUser: (user: User | null) => void;
    isLoggedIn: boolean;
    setIsLoggedIn: (isLoggedIn: boolean) => void;
}>((set) => ({
    user: null,
    setUser: (user: User | null) => set({ user }),
    isLoggedIn: false,
    setIsLoggedIn: (isLoggedIn: boolean) => set({ isLoggedIn: isLoggedIn }),
}));