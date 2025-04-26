import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook for debounced AI suggestions when typing journal entries
 * 
 * @param minCharacters - Minimum number of characters before triggering suggestions
 * @param debounceTime - Debounce delay in milliseconds
 */
export function useAISuggestions(
  minCharacters: number = 50,
  debounceTime: number = 1000
) {
  const [text, setText] = useState('');
  const [suggestions, setSuggestions] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch suggestions from the API
  const fetchSuggestions = useCallback(async (journalText: string) => {
    if (journalText.length < minCharacters) {
      setSuggestions('');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/suggestions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: journalText }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      setSuggestions(data.suggestions || data.message || '');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get suggestions');
      setSuggestions('');
    } finally {
      setLoading(false);
    }
  }, [minCharacters]);

  // Debounce the API call
  useEffect(() => {
    if (text.length < minCharacters) return;
    
    const handler = setTimeout(() => {
      fetchSuggestions(text);
    }, debounceTime);

    return () => {
      clearTimeout(handler);
    };
  }, [text, fetchSuggestions, debounceTime, minCharacters]);

  return {
    text,
    setText,
    suggestions,
    loading,
    error,
    // Reset suggestions when needed
    resetSuggestions: () => setSuggestions(''),
  };
}