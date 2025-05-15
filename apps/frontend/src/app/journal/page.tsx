'use client';

import { useJournalAnalysis, useAiSuggestions } from "@/hooks/ai";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import ReactMarkdown from 'react-markdown';

function unescapeMarkdown(text: string): string {
    return text
        .replace(/\\n/g, '\n')
        .replace(/\\"/g, '"')
        .replace(/\\'/g, "'")
        .replace(/\\\\/g, '\\');
}

export default function JournalPage() {
    const [journalContent, setJournalContent] = useState("");
    const { data: analysis, isLoading: isAnalyzing, trigger: analyzeJournal } = useJournalAnalysis();
    const { data: suggestions, isLoading: isSuggesting, trigger: generateSuggestions } = useAiSuggestions();

    return (
        <div className="max-w-4xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Journal</h1>
            <div className="mb-4">
                <Textarea
                    name="journal"
                    id="journal"
                    rows={10}
                    value={journalContent}
                    onChange={(e) => setJournalContent(e.target.value)}
                    className="w-full p-2 border rounded"
                    placeholder="Write your journal entry here..."
                />
            </div>
            <Button
                onClick={() => analyzeJournal(journalContent)}
                disabled={isAnalyzing || !journalContent.trim()}
            >
                {isAnalyzing ? 'Analyzing...' : 'Analyze'}
            </Button>
            <div className="mt-4">
                <h2 className="text-xl font-semibold mb-2">Analysis:</h2>
                <div className="p-4 bg-gray-50 rounded text-black min-h-[200px] prose prose-slate max-w-none relative">
                    <ReactMarkdown>
                        {analysis ? unescapeMarkdown(analysis) : ''}
                    </ReactMarkdown>
                    {isAnalyzing && (
                        <span className="inline-block w-2 h-5 bg-blue-500 animate-pulse ml-1 align-middle" />
                    )}
                </div>
            </div>
            <Button
                onClick={() => generateSuggestions(journalContent)}
                disabled={isSuggesting || !journalContent.trim()}
                className="mt-4"
            >
                {isSuggesting ? 'Generating suggestions...' : 'Generate suggestions'}
            </Button>
            <div className="mt-4">
                <h2 className="text-xl font-semibold mb-2">Suggestions:</h2>
                {suggestions && (
                    <div className="p-4 bg-gray-50 rounded">
                        <h3 className="font-medium text-lg mb-2">{suggestions.activity}</h3>
                        <p className="text-gray-600 mb-2">{suggestions.reason}</p>
                        <p className="text-sm text-gray-500">{suggestions.suggestionReason}</p>
                    </div>
                )}
            </div>
        </div>
    );
}
