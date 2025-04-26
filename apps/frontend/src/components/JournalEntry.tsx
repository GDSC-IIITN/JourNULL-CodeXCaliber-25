import React, { useRef, useState } from 'react';
import { useAISuggestions } from '../hooks/useAISuggestions';

interface JournalEntryProps {
    onSave?: (text: string) => void;
    className?: string;
    minSuggestionChars?: number;
    debounceTime?: number;
}

export const JournalEntry: React.FC<JournalEntryProps> = ({
    onSave,
    className = '',
    minSuggestionChars = 50,
    debounceTime = 1000,
}) => {
    const {
        text,
        setText,
        suggestions,
        loading,
        error,
        resetSuggestions
    } = useAISuggestions(minSuggestionChars, debounceTime);

    const [isSaving, setIsSaving] = useState(false);
    const textAreaRef = useRef<HTMLTextAreaElement>(null);

    // Handler for text input with auto-growing textarea
    const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setText(e.target.value);

        // Auto-grow textarea
        if (textAreaRef.current) {
            textAreaRef.current.style.height = 'auto';
            textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
        }
    };

    // Handler for saving the journal entry
    const handleSave = async () => {
        if (!text.trim()) return;

        try {
            setIsSaving(true);
            onSave?.(text);
            // Clear form after successful save if needed
            // setText('');
            // resetSuggestions();
        } catch (err) {
            console.error('Failed to save journal entry:', err);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className={`flex flex-col space-y-4 ${className}`}>
            {/* Journal entry textarea */}
            <div className="relative">
                <textarea
                    ref={textAreaRef}
                    value={text}
                    onChange={handleTextChange}
                    placeholder="Write your thoughts here..."
                    className="w-full p-4 border rounded-lg resize-none min-h-[200px] bg-background text-foreground"
                    disabled={isSaving}
                    rows={8}
                />

                {/* Character count */}
                <div className="text-xs text-gray-500 mt-1">
                    {text.length} characters
                    {text.length < minSuggestionChars && (
                        <span> ({minSuggestionChars - text.length} more for suggestions)</span>
                    )}
                </div>
            </div>

            {/* AI Suggestions section */}
            {text.length >= minSuggestionChars && (
                <div className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
                    <h3 className="text-sm font-medium mb-2 flex items-center">
                        <span>AI Suggestions</span>
                        {loading && (
                            <span className="ml-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-gray-500 border-t-transparent" />
                        )}
                    </h3>

                    {error ? (
                        <p className="text-red-500 text-sm">{error}</p>
                    ) : suggestions ? (
                        <div className="text-sm prose dark:prose-invert max-w-none">
                            {suggestions}
                        </div>
                    ) : loading ? (
                        <p className="text-sm text-gray-500">Analyzing your entry...</p>
                    ) : (
                        <p className="text-sm text-gray-500">Continue writing to get AI insights</p>
                    )}
                </div>
            )}

            {/* Action buttons */}
            <div className="flex justify-end">
                <button
                    onClick={handleSave}
                    disabled={isSaving || !text.trim()}
                    className={`px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors
            ${(isSaving || !text.trim()) ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    {isSaving ? 'Saving...' : 'Save Entry'}
                </button>
            </div>
        </div>
    );
};