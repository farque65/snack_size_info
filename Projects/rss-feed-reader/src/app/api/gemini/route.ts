// src/app/api/gemini/route.ts
import { NextRequest, NextResponse } from 'next/server';

interface GeminiResult {
  title: string;
  description: string;
  relevance: string;
}

interface GeminiResponse {
  results?: GeminiResult[];
  error?: string;
}

interface GeminiContentPart {
  text?: string;
}

interface GeminiContent {
  parts: GeminiContentPart[];
}

interface GeminiCandidate {
  content: GeminiContent;
}

interface GeminiAPIResponse {
  candidates: GeminiCandidate[];
  error?: {
    message: string;
  };
}

export async function POST(request: NextRequest): Promise<NextResponse<GeminiResponse>> {
  try {
    const apiKey = process.env.GOOGLE_GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: 'Gemini API key not configured. Please set GOOGLE_GEMINI_API_KEY environment variable.' },
        { status: 500 }
      );
    }

    const { prompt } = await request.json();

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey,
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json() as { error?: { message: string } };
      const errorMessage = errorData.error?.message || 'Failed to call Gemini API';
      return NextResponse.json(
        { error: errorMessage },
        { status: response.status }
      );
    }

    const data = await response.json() as GeminiAPIResponse;

    // Extract the text from Gemini response
    const textContent = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!textContent) {
      return NextResponse.json(
        { error: 'No content received from Gemini API' },
        { status: 500 }
      );
    }

    // Parse the JSON response from Gemini
    let results: GeminiResult[] = [];
    try {
      // Try to extract JSON from the response
      const jsonMatch = textContent.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]) as GeminiResult[];
        results = parsed;
      } else {
        // If no JSON array found, create results from the text
        results = [
          {
            title: 'AI Analysis',
            description: textContent,
            relevance: 'High - Direct analysis from Gemini',
          },
        ];
      }
    } catch {
      // If JSON parsing fails, return the raw text as a single result
      results = [
        {
          title: 'AI Analysis',
          description: textContent,
          relevance: 'High - Direct analysis from Gemini',
        },
      ];
    }

    return NextResponse.json({ results });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Gemini API error:', errorMessage);
    return NextResponse.json(
      { error: `Failed to process request: ${errorMessage}` },
      { status: 500 }
    );
  }
}