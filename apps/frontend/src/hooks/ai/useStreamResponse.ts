import { useState, useCallback } from 'react';
import { handleStreamResponse } from '@/lib/utils';

interface UseStreamResponseOptions {
    onError?: (error: Error) => void;
    initialText?: string;
    isJson?: boolean;
}

export function useStreamResponse<T = string>(options: UseStreamResponseOptions = {}) {
    const [streamedText, setStreamedText] = useState<T | string>(options.initialText || '');
    const [isStreaming, setIsStreaming] = useState(false);

    const processStream = useCallback(async (stream: ReadableStream<Uint8Array>) => {
        try {
            setIsStreaming(true);
            setStreamedText('');

            await handleStreamResponse(stream, (data: Record<string, unknown>) => {
                const text = data.toString();
                if (options.isJson) {
                    try {
                        const jsonData = JSON.parse(text) as T;
                        setStreamedText(jsonData);
                    } catch (e) {
                        setStreamedText(text as T);
                        console.error('Error parsing JSON:', (e as Error).message);
                    }
                } else {
                    setStreamedText(text as T);
                }
            });
        } catch (error) {
            console.error('Error processing stream:', error);
            options.onError?.(error as Error);
        } finally {
            setIsStreaming(false);
        }
    }, [options.onError, options.isJson]);

    return {
        streamedText,
        isStreaming,
        processStream
    };
} 