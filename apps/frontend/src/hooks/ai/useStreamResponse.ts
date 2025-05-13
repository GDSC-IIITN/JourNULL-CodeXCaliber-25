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

            await handleStreamResponse(stream, (text) => {
                if (options.isJson) {
                    try {
                        const jsonData = JSON.parse(text) as T;
                        setStreamedText(jsonData);
                    } catch (e) {
                        // If parsing fails, keep the raw text
                        setStreamedText(text);
                    }
                } else {
                    setStreamedText(text);
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