import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: NextRequest) {
    try {
        const { messages, systemPrompt } = await req.json();

        if (!process.env.GEMINI_API_KEY) {
            return NextResponse.json(
                { error: 'Gemini API key is not configured in the environment.' },
                { status: 500 }
            );
        }

        if (!messages || !Array.isArray(messages) || messages.length === 0) {
            return NextResponse.json(
                { error: 'Invalid or empty messages array.' },
                { status: 400 }
            );
        }

        const model = genAI.getGenerativeModel({
            model: 'gemini-1.5-flash',
            systemInstruction: systemPrompt,
        });

        // Formatting messages for Gemini
        // Gemini expects an array of contents with role (user/model) and parts
        const formattedHistory = messages.slice(0, -1).map((msg: any) => ({
            role: msg.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: msg.content }],
        }));

        const currentMessage = messages[messages.length - 1].content;

        const chat = model.startChat({
            history: formattedHistory,
        });

        const result = await chat.sendMessage(currentMessage);
        const response = await result.response;
        const text = response.text();

        return NextResponse.json({ text });
    } catch (error: any) {
        console.error('Chat API Error:', error);
        return NextResponse.json(
            { error: error?.message || 'An error occurred during the API call.' },
            { status: 500 }
        );
    }
}
