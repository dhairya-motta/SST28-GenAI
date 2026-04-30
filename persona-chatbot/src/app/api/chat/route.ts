import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';
import { ChatCompletionMessageParam } from 'groq-sdk/resources/chat/completions';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY || '' });

export async function POST(req: NextRequest) {
    try {
        const { messages, systemPrompt } = await req.json();

        if (!process.env.GROQ_API_KEY) {
            return NextResponse.json(
                { error: 'Groq API key is not configured in the environment.' },
                { status: 500 }
            );
        }

        if (!messages || !Array.isArray(messages) || messages.length === 0) {
            return NextResponse.json(
                { error: 'Invalid or empty messages array.' },
                { status: 400 }
            );
        }

        const formattedMessages: ChatCompletionMessageParam[] = [
            { role: 'system', content: systemPrompt },
            ...messages.map((msg: { role: string; content: string }) => ({
                role: (msg.role === 'user' ? 'user' : 'assistant') as 'user' | 'assistant',
                content: msg.content,
            }))
        ];

        const chatCompletion = await groq.chat.completions.create({
            messages: formattedMessages,
            model: 'llama-3.3-70b-versatile',
            temperature: 0.7,
            max_tokens: 1024,
        });

        const text = chatCompletion.choices[0]?.message?.content || '';

        return NextResponse.json({ text });
    } catch (error: unknown) {
        console.error('Chat API Error:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'An error occurred during the API call.' },
            { status: 500 }
        );
    }
}
