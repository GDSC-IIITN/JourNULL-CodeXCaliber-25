import { GlobalSearchResponse } from "@/lib/validation/journal.schema";
import { create } from "zustand";

export const useRecentSearchStore = create<{
    recentSearch: GlobalSearchResponse[];
    setRecentSearch: (journal: GlobalSearchResponse) => void;
}>((set) => ({
    recentSearch: [],
    setRecentSearch: (journal) => set((state) => ({ recentSearch: [journal, ...state.recentSearch.slice(0, 9)] })),
}));