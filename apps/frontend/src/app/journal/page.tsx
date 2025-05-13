'use client';

import { useAiSuggestions, useJournalAnalysis } from "@/hooks/ai";
import { useState } from "react";

export interface Suggestion {
    activity: string;
    reason: string;
    suggestionReason: string;
}

export default function JournalPage() {
    const [journalContent, setJournalContent] = useState("");
    const { analyzeJournal, isAnalyzing, streamedText } = useJournalAnalysis();
    const { aiSuggestions, isAiSuggestions, streamedText: aiSuggestionsText } = useAiSuggestions();

    return (
        <div className="max-w-4xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Journal</h1>
            <div className="mb-4">
                <textarea
                    name="journal"
                    id="journal"
                    rows={10}
                    value={journalContent}
                    onChange={(e) => setJournalContent(e.target.value)}
                    className="w-full p-2 border rounded"
                    placeholder="Write your journal entry here..."
                ></textarea>
            </div>
            <button
                onClick={() => analyzeJournal(journalContent)}
                disabled={isAnalyzing || !journalContent.trim()}
                className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-400 hover:bg-blue-600 transition-colors"
            >
                {isAnalyzing ? 'Analyzing...' : 'Analyze'}
            </button>
            <div className="mt-4">
                <h2 className="text-xl font-semibold mb-2">Analysis:</h2>
                <pre className="whitespace-pre-wrap p-4 bg-gray-50 rounded text-black min-h-[200px]">
                    {streamedText}
                    {isAnalyzing && <span className="animate-pulse">▋</span>}
                </pre>
            </div>
            <button
                onClick={() => aiSuggestions(journalContent)}
                disabled={isAiSuggestions || !journalContent.trim()}
                className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-400 hover:bg-blue-600 transition-colors"
            >
                {isAiSuggestions ? 'Generating suggestions...' : 'Generate suggestions'}
            </button>
            <div className="mt-4">
                <h2 className="text-xl font-semibold mb-2">Suggestions:</h2>
                {aiSuggestionsText && typeof aiSuggestionsText === 'object' && (
                    <div className="p-4 bg-gray-50 rounded">
                        <h3 className="font-medium text-lg mb-2">{aiSuggestionsText.activity}</h3>
                        <p className="text-gray-600 mb-2">{aiSuggestionsText.reason}</p>
                        <p className="text-sm text-gray-500">{aiSuggestionsText.suggestionReason}</p>
                    </div>
                )}
            </div>
        </div>
    );
}

