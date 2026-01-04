import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

export async function POST(req: NextRequest) {
    try {
        const { prompt } = await req.json();

        if (!process.env.GROQ_API_KEY) {
            return NextResponse.json({ error: "Groq API key is not configured" }, { status: 500 });
        }

        if (!prompt) {
            return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
        }

        const chatCompletion = await groq.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            model: "groq/compound-mini",
        });

        const result = chatCompletion.choices[0]?.message?.content || "";

        return NextResponse.json({ result });
    } catch (error: any) {
        console.error("Error generating content:", error);
        return NextResponse.json({
            error: error?.message || "Failed to generate content",
            details: JSON.stringify(error)
        }, { status: 500 });
    }
}
