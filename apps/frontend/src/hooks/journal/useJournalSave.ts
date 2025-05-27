import { useState, useCallback, useRef, useEffect } from 'react';
import { debounce } from '@/lib/utils';
import { toast } from 'sonner';
import { UpdateJournalInput } from '@/lib/validation/journal.schema';
import { UseMutateFunction } from '@tanstack/react-query';

interface UseJournalSaveProps {
    updateJournal: UseMutateFunction<string, Error, UpdateJournalInput>;
    initialContent?: string;
}

export const useJournalSave = ({ updateJournal, initialContent = '' }: UseJournalSaveProps) => {
    const [content, setContent] = useState<string>(initialContent);
    const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
    const lastSavedContent = useRef<string>(initialContent);
    const pendingSave = useRef<NodeJS.Timeout | null>(null);
    const lastSaveTime = useRef<number>(0);
    const MIN_SAVE_INTERVAL = 3000; // Minimum 5 seconds between saves

    // Update content when initialContent changes
    useEffect(() => {
        if (initialContent && initialContent !== content) {
            setContent(initialContent);
            lastSavedContent.current = initialContent;
        }
    }, [initialContent]);

    const saveContent = useCallback((content: string) => {
        if (!content || content === lastSavedContent.current) return;

        // Clear any pending save
        if (pendingSave.current) {
            clearTimeout(pendingSave.current);
            pendingSave.current = null;
        }

        setSaveStatus('saving');
        updateJournal(
            {
                title: "Recents",
                content,
                tags: []
            },
            {
                onSuccess: () => {
                    setSaveStatus('saved');
                    lastSavedContent.current = content;
                    setTimeout(() => {
                        setSaveStatus('idle');
                    }, 2000);
                },
                onError: (error: Error) => {
                    console.error("Error saving journal:", error);
                    setSaveStatus('idle');
                    toast.error("Failed to save changes. Please try again.");
                }
            }
        );
    }, [updateJournal]);

    const debouncedSaveContent = useCallback(
        debounce((content: string) => {
            if (content !== lastSavedContent.current) {
                const timeSinceLastSave = Date.now() - (lastSaveTime.current || 0);
                if (timeSinceLastSave >= MIN_SAVE_INTERVAL) {
                    saveContent(content);
                    lastSaveTime.current = Date.now();
                } else {
                    pendingSave.current = setTimeout(() => {
                        saveContent(content);
                        lastSaveTime.current = Date.now();
                    }, MIN_SAVE_INTERVAL - timeSinceLastSave);
                }
            }
        }, 3000),
        [saveContent]
    );

    useEffect(() => {
        if (content && content !== lastSavedContent.current) {
            debouncedSaveContent(content);
        }

        return () => {
            if (pendingSave.current) {
                clearTimeout(pendingSave.current);
            }
        };
    }, [content, debouncedSaveContent]);

    return {
        content,
        setContent,
        saveStatus,
    };
}; 