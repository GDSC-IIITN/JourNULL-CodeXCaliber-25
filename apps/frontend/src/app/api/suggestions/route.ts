import { NextResponse } from "next/server";

/**
 * API endpoint to get AI suggestions for journal entries
 */
export async function POST(req: Request) {
  try {
    const { text } = await req.json();
    
    if (!text || typeof text !== 'string' || text.length < 10) {
      return NextResponse.json(
        { error: "Please provide at least 10 characters of journal text" },
        { status: 400 }
      );
    }

    // Call the backend API to get suggestions
    const response = await fetch(`${process.env.BACKEND_URL}/journal/suggestions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      throw new Error(`Backend returned ${response.status}`);
    }

    const suggestions = await response.json();
    return NextResponse.json({ message: suggestions.message });
  } catch (error) {
    console.error("Error getting AI suggestions:", error);
    return NextResponse.json(
      { error: "Failed to get AI suggestions" },
      { status: 500 }
    );
  }
}