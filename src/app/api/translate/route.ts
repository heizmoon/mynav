import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { text } = body;

        if (!text) {
            return NextResponse.json({ error: 'Text is required' }, { status: 400 });
        }

        // Detect if text contains Chinese characters
        const isChinese = /[\u4e00-\u9fa5]/.test(text);

        // Translate Chinese to English, otherwise translate to Chinese
        const langpair = isChinese ? 'zh|en' : 'en|zh';

        // MyMemory Translation API (Free tier, 5000 chars/day)
        const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${langpair}`;

        const response = await fetch(url, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Translation API request failed');
        }

        const data = await response.json();

        // MyMemory response structure: { responseData: { translatedText: string } }
        const translatedText = data?.responseData?.translatedText;

        if (!translatedText) {
            return NextResponse.json({ error: 'Invalid response from translation service' }, { status: 500 });
        }

        return NextResponse.json({ result: translatedText });

    } catch (error) {
        console.error('Translation error:', error);
        return NextResponse.json({ error: 'Failed to translate' }, { status: 500 });
    }
}
