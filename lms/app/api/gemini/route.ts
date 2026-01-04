import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: NextRequest) {
    try {
        const { prompt } = await req.json();
        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            return NextResponse.json({ error: "Gemini API key is not configured" }, { status: 500 });
        }

        if (!prompt) {
            return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-001" });

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        return NextResponse.json({ result: text });
    } catch (error: any) {
        console.error("Error generating content:", error);
        return NextResponse.json({
            error: error?.message || "Failed to generate content",
            details: JSON.stringify(error)
        }, { status: 500 });
    }
}
