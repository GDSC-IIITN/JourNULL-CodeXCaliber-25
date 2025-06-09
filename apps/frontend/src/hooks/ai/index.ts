import { useMutation } from '@tanstack/react-query';
import api from '@/lib/api';
import { useStreamResponse } from '@/hooks/ai/useStreamResponse';
import { AiEndpoint, AiSuggestionsResponse } from '@/types/ai';

export function useAi<T = string>(endpoint: AiEndpoint, options: { isJson?: boolean } = {}) {
    const { streamedText, isStreaming, processStream } = useStreamResponse<T>({ isJson: options.isJson });

    const mutation = useMutation({
        mutationFn: async (input: string) => {
            if (endpoint === AiEndpoint.OCTACAT) {
                const stream = await api.ai[endpoint]({ context: input });
                return processStream(stream);
            }
            const stream = await api.ai[endpoint]({ journal: input });
            await processStream(stream);
        },
        onError: (error: Error) => {
            console.error(`Error in ${endpoint}:`, error);
        }
    });

    return {
        data: streamedText as T,
        isLoading: isStreaming || mutation.isPending,
        error: mutation.error,
        trigger: mutation.mutate
    };
}


export function useJournalAnalysis() {
    return useAi(AiEndpoint.ANALYZE_JOURNAL);
}

export function useAiSuggestions() {
    return useAi<AiSuggestionsResponse>(AiEndpoint.AI_SUGGESTIONS, { isJson: true });
}

export function useOctacat() {
    return useAi(AiEndpoint.OCTACAT);
}