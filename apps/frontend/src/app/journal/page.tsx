'use client';

import { useState } from 'react';
import { JournalEntry } from '@/components/JournalEntry';

export default function JournalPage() {
    const [savedEntry, setSavedEntry] = useState<string | null>(null);

    const handleSaveEntry = (text: string) => {
        // In a real application, you would save this to your backend
        console.log('Saving journal entry:', text);
        setSavedEntry(text);

        // You could also trigger a notification or redirect
        alert('Journal entry saved successfully!');
    };

    return (
        <div className="container mx-auto py-8 px-4 max-w-3xl">
            <h1 className="text-3xl font-bold mb-6">Journal</h1>

            <div className="mb-8">
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Write your thoughts below. After typing at least 50 characters,
                    you&apos;ll start to see AI-powered suggestions and insights based on your entry.
                </p>

                <JournalEntry
                    onSave={handleSaveEntry}
                    minSuggestionChars={50}
                    debounceTime={800} // Reduced debounce time for demo purposes
                />
            </div>

            {savedEntry && (
                <div className="mt-8 p-4 border rounded-lg bg-gray-50 dark:bg-gray-800">
                    <h2 className="text-xl font-semibold mb-2">Last Saved Entry</h2>
                    <p className="whitespace-pre-wrap">{savedEntry}</p>
                </div>
            )}
        </div>
    );
}