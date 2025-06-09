import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { Emotion } from "../validation/journal.schema";
import { useEffect, useState } from "react";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Utility function to handle streaming responses from the API
 * @param stream The ReadableStream from the API response
 * @param onChunk Callback function that receives the accumulated text after each chunk
 * @returns Promise that resolves when the stream is complete
 */
export async function handleStreamResponse(
  stream: ReadableStream<Uint8Array>,
  onChunk: (data: Record<string, unknown>) => void
): Promise<void> {
  const reader = stream.getReader();
  let buffer = "";
  let accumulatedText = "";

  try {
    while (true) {
      const { done, value } = await reader.read();

      if (done) {
        // Process any remaining data in the buffer
        if (buffer.trim()) {
          accumulatedText += buffer;
          onChunk({ text: accumulatedText });
        }
        break;
      }

      // Decode the Uint8Array to text
      const text = new TextDecoder().decode(value);

      // Parse the text chunks
      const lines = text.split('\n');

      for (const line of lines) {
        if (!line.trim()) continue;

        if (line.startsWith('0:"')) {
          // Extract the actual text content from the token
          const content = line.slice(3, -1);

          // Process content character by character
          for (let i = 0; i < content.length; i++) {
            const char = content[i];
            buffer += char;
            accumulatedText += char;

            // Send update every few characters for smoother streaming
            if (i % 3 === 0 || i === content.length - 1) {
              onChunk({ text: accumulatedText });
              // Add a small delay for visual effect
              await new Promise(resolve => setTimeout(resolve, 10));
            }
          }
          buffer = "";
        }
      }
    }
  } catch (error) {
    console.error('Error processing stream:', error);
    throw error;
  } finally {
    reader.releaseLock();
  }
}

/**
 * Utility function to handle streaming JSON responses from the API
 * @param stream The ReadableStream from the API response
 * @param onChunk Callback function that receives the parsed JSON data
 * @returns Promise that resolves when the stream is complete
 */
export async function handleJsonStreamResponse<T>(
  stream: ReadableStream<Uint8Array>,
  onChunk: (data: T) => void
): Promise<void> {
  const reader = stream.getReader();
  let buffer = "";

  try {
    while (true) {
      const { done, value } = await reader.read();

      if (done) {
        // Process any remaining data in the buffer
        if (buffer.trim()) {
          try {
            // First unescape the JSON string
            const unescapedJson = buffer
              .replace(/\\n/g, '')
              .replace(/\\"/g, '"')
              .replace(/^"|"$/g, '')
              .trim();

            if (unescapedJson) {
              const jsonData = JSON.parse(unescapedJson) as T;
              onChunk(jsonData);
            }
          } catch (e) {
            console.error('Error parsing final JSON buffer:', {
              error: (e as Error).message,
              buffer: buffer,
              unescapedBuffer: buffer
                .replace(/\\n/g, '')
                .replace(/\\"/g, '"')
                .replace(/^"|"$/g, '')
                .trim()
            });
          }
        }
        break;
      }

      // Decode the Uint8Array to text
      const text = new TextDecoder().decode(value);

      // Parse the text chunks
      const lines = text.split('\n');

      for (const line of lines) {
        if (!line.trim()) continue;

        if (line.startsWith('0:"')) {
          // Extract the actual text content from the token
          const content = line.slice(3, -1);

          // Add to buffer
          buffer += content;

          try {
            // First unescape the JSON string
            const unescapedJson = buffer
              .replace(/\\n/g, '')
              .replace(/\\"/g, '"')
              .replace(/^"|"$/g, '')
              .trim();

            if (unescapedJson) {
              const jsonData = JSON.parse(unescapedJson) as T;
              onChunk(jsonData);
              buffer = "";
            }
          } catch (e) {
            // If parsing fails, keep accumulating
            console.error('Error parsing JSON buffer:', {
              error: (e as Error).message,
              buffer: buffer,
              unescapedBuffer: buffer
                .replace(/\\n/g, '')
                .replace(/\\"/g, '"')
                .replace(/^"|"$/g, '')
                .trim()
            });
            continue;
          }
        }
      }
    }
  } catch (error) {
    console.error('Error processing JSON stream:', error);
    throw error;
  } finally {
    reader.releaseLock();
  }
}

export function debounce<T extends (...args: Parameters<T>) => void>(func: T, delay: number): T {
  let timeout: NodeJS.Timeout;
  return ((...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), delay);
  }) as T;
}

// Map emotion type to emoji
export const getEmotionEmoji = (emotion: Emotion): string => {
  const emojiMap: Record<Emotion['emotion'], string> = {
    happy: '😊',
    sad: '😢',
    angry: '😠',
    fearful: '😨',
    disgusted: '😖',
    surprised: '😮',
    content: '😐',
    anxious: '😰',
    depressed: '😔',
    exhausted: '😫',
    stressed: '😓',
    other: '🤷‍♂️'
  };
  return emojiMap[emotion.emotion];
};

export const getClientSideCookie = (name: string): string | undefined => {
  const cookieValue = document.cookie
    .split('; ')
    .find((row) => row.startsWith(`${name}=`))
    ?.split('=')[1];

  return cookieValue;
};

export const useRandomEmoji = (interval: number = 1000) => {
  const [emoji, setEmoji] = useState<string>('');
  useEffect(() => {
    const timeout = setInterval(() => {
      const emojis = ['😊', '😢', '😠', '😨', '😖', '😮', '😐', '😰', '😔', '😫', '😓', '🤷‍♂️'];
      const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
      setEmoji(randomEmoji);
    }, interval);
    return () => clearInterval(timeout);
  }, [interval]);
  return emoji;
}

export const playSound = () => {
  const audio = new Audio('/sounds/click.mp3');
  audio.play();
}

export function unescapeMarkdown(text: string): string {
  return text
    .replace(/\\n/g, '\n')
    .replace(/\\"/g, '"')
    .replace(/\\'/g, "'")
    .replace(/\\\\/g, '\\');
}