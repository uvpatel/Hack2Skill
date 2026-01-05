

// app/api/gemini/route.ts
import { NextRequest } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

// System prompt for the chatbot
const SYSTEM_PROMPT = `You are an advanced AI assistant powered by Google Gemini. You are helpful, accurate, and conversational.

Core Capabilities:
- Answer questions clearly and concisely
- Explain complex topics in simple terms
- Write and debug code in multiple languages
- Analyze images and extract information
- Provide creative and technical solutions
- Maintain context across the conversation

Behavior Guidelines:
- Be friendly and professional
- Admit when you don't know something
- Ask clarifying questions when needed
- Provide code examples with explanations
- Format responses with proper markdown
- Keep answers focused and relevant

Never:
- Make up information or hallucinate facts
- Provide harmful, dangerous, or illegal advice
- Share personal data or private information
- Claim to have real-time data access beyond your training`;

export async function POST(req: NextRequest) {
  const encoder = new TextEncoder();

  try {
    const { prompt, image, history } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return new Response(
        encoder.encode('data: {"error": "Gemini API key is not configured"}\n\n'),
        {
          status: 500,
          headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
          },
        }
      );
    }

    if (!prompt && !image) {
      return new Response(
        encoder.encode('data: {"error": "Prompt or image is required"}\n\n'),
        {
          status: 400,
          headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
          },
        }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction: SYSTEM_PROMPT,
    });

    // Build chat history
    const chatHistory = history?.map((msg: any) => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }],
    })) || [];

    const chat = model.startChat({
      history: chatHistory,
      generationConfig: {
        maxOutputTokens: 2048,
        temperature: 0.7,
        topP: 0.95,
        topK: 40,
      },
    });

    // Create streaming response
    const stream = new ReadableStream({
      async start(controller) {
        try {
          let parts: any[] = [];

          // Add text prompt if provided
          if (prompt) {
            parts.push({ text: prompt });
          }

          // Add image if provided
          if (image) {
            const base64Data = image.split(',')[1];
            const mimeType = image.split(';')[0].split(':')[1];
            parts.push({
              inlineData: {
                data: base64Data,
                mimeType: mimeType,
              },
            });
          }

          const result = await chat.sendMessageStream(parts);

          for await (const chunk of result.stream) {
            const text = chunk.text();
            if (text) {
              const data = JSON.stringify({ text });
              controller.enqueue(encoder.encode(`data: ${data}\n\n`));
            }
          }

          controller.enqueue(encoder.encode('data: {"done": true}\n\n'));
          controller.close();
        } catch (error: any) {
          console.error('Streaming error:', error);
          const errorData = JSON.stringify({
            error: error?.message || 'Failed to generate response',
          });
          controller.enqueue(encoder.encode(`data: ${errorData}\n\n`));
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error: any) {
    console.error('Error in API route:', error);
    const errorData = JSON.stringify({
      error: error?.message || 'Internal server error',
    });
    return new Response(encoder.encode(`data: ${errorData}\n\n`), {
      status: 500,
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  }
}