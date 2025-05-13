import { useMutation } from '@tanstack/react-query';
import api from '@/lib/api';
import { useStreamResponse } from '@/hooks/ai/useStreamResponse';

interface Suggestion {
    activity: string;
    reason: string;
    suggestionReason: string;
}

export function useJournalAnalysis() {
    const { streamedText, isStreaming, processStream } = useStreamResponse();

    const mutation = useMutation({
        mutationFn: async (journalContent: string) => {
            const stream = await api.ai.analyzeJournal({ journal: journalContent });
            await processStream(stream);
        },
        onError: (error: Error) => {
            console.error('Error analyzing journal:', error)
        },
        onSuccess: () => {
            console.log('Journal analysis successful')
        }
    });

    return {
        analyzeJournal: mutation.mutate,
        isAnalyzing: isStreaming || mutation.isPending,
        streamedText,
        error: mutation.error
    };
}

export function useAiSuggestions() {
    const { streamedText, isStreaming, processStream } = useStreamResponse<Suggestion>({ isJson: true });

    const mutation = useMutation({
        mutationFn: async (journalContent: string) => {
            const stream = await api.ai.aiSuggestions({ journal: journalContent });
            await processStream(stream);
        },
        onError: (error: Error) => {
            console.error('Error generating suggestions:', error);
        },
        onSuccess: () => {
            console.log('Suggestions generated successfully')
        }
    });

    return {
        aiSuggestions: mutation.mutate,
        isAiSuggestions: isStreaming || mutation.isPending,
        streamedText,
        error: mutation.error
    };
}
