import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formats text by converting markdown-style formatting to HTML
 * @param text The text to format
 * @returns Formatted text with HTML tags
 */
// function formatText(text: string): string {
//   return text
//     .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold text
//     .replace(/\*(.*?)\*/g, '<em>$1</em>') // Italic text
//     .replace(/\`(.*?)\`/g, '<code>$1</code>') // Code blocks
//     .replace(/\~\~(.*?)\~\~/g, '<del>$1</del>'); // Strikethrough
// }

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
  let jsonBuffer = "";

  try {
    while (true) {
      const { done, value } = await reader.read();

      if (done) {
        break;
      }

      // Decode the Uint8Array to text
      const text = new TextDecoder().decode(value);

      // Parse the text chunks
      const lines = text.split('\n');

      for (const line of lines) {
        if (line.startsWith('0:"')) {
          // Extract the actual text content from the token
          const content = line.slice(3, -1);

          // Add to JSON buffer
          jsonBuffer += content;

          try {
            // First, unescape the JSON string if it's escaped
            const unescapedJson = jsonBuffer.replace(/\\n/g, '')
              .replace(/\\"/g, '"')
              .replace(/^"|"$/g, '');

            // Try to parse the unescaped JSON
            const jsonData = JSON.parse(unescapedJson);
            // If successful, pass the actual object to the callback and clear the buffer
            onChunk(jsonData);
            jsonBuffer = "";
          } catch (e) {
            // If parsing fails, it might be incomplete JSON
            // Keep accumulating in the buffer
            console.error('Error parsing JSON:', (e as Error).message);
            continue;
          }

          // Add a small delay to make the streaming effect visible
          await new Promise(resolve => setTimeout(resolve, 10));
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