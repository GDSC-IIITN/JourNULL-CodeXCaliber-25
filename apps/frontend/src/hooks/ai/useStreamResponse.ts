import { useState, useCallback } from 'react';
import { handleStreamResponse, handleJsonStreamResponse } from '@/lib/utils';

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

            if (options.isJson) {
                await handleJsonStreamResponse<T>(stream, (data: T) => {
                    setStreamedText(data);
                });
            } else {
                await handleStreamResponse(stream, (data: Record<string, unknown>) => {
                    // If data has a text property, use that, otherwise use the data itself
                    const text = typeof data === 'object' && data !== null && 'text' in data
                        ? data.text
                        : data;
                    setStreamedText(text as T);
                });
            }
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