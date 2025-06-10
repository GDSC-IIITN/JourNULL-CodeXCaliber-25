export type AiResponse<T = string> = {
    data: T;
    isLoading: boolean;
    error: Error | null;
    trigger: (input: string) => Promise<void>;
};

export enum AiEndpoint {
    ANALYZE_JOURNAL = 'analyzeJournal',
    AI_SUGGESTIONS = 'aiSuggestions',
    OCTACAT = 'octacat',
}

export type AiSuggestionsResponse = {
    activity: string;
    reason: string;
    suggestionReason: string;
}