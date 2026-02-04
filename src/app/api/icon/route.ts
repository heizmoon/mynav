import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const targetUrl = searchParams.get('url');

    if (!targetUrl) {
        return NextResponse.json({ error: 'URL parameter required' }, { status: 400 });
    }

    try {
        // 1. Try to fetch the page to find the icon link
        // We add a user-agent to avoid being blocked by some sites
        const htmlRes = await fetch(targetUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            },
            next: { revalidate: 3600 } // Cache for 1 hour
        });

        if (!htmlRes.ok) {
            throw new Error(`Failed to fetch site: ${htmlRes.status}`);
        }

        const htmlText = await htmlRes.text();

        // Simple regex to find favicon
        const match = htmlText.match(/<link[^>]*rel=["'](?:shortcut )?icon["'][^>]*href=["']([^"']+)["'][^>]*>/i);
        let iconUrl = '';

        if (match && match[1]) {
            iconUrl = match[1];
            // Handle relative URLs
            if (!iconUrl.startsWith('http')) {
                const urlObj = new URL(targetUrl);
                if (iconUrl.startsWith('//')) {
                    iconUrl = `${urlObj.protocol}${iconUrl}`;
                } else if (iconUrl.startsWith('/')) {
                    iconUrl = `${urlObj.origin}${iconUrl}`;
                } else {
                    iconUrl = `${urlObj.origin}/${iconUrl}`; // crude relative handling
                    // Ideally we resolve against current path, but root relative is safest guess for icons
                }
            }
        } else {
            // Fallback to /favicon.ico
            const urlObj = new URL(targetUrl);
            iconUrl = `${urlObj.origin}/favicon.ico`;
        }

        // 2. Fetch the icon image data
        const iconRes = await fetch(iconUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        });

        if (!iconRes.ok) throw new Error('Icon fetch failed');

        const arrayBuffer = await iconRes.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const base64 = buffer.toString('base64');
        const mimeType = iconRes.headers.get('content-type') || 'image/png';

        return NextResponse.json({ icon: `data:${mimeType};base64,${base64}` });

    } catch (error) {
        console.error('Error fetching icon:', error);
        // Return a generic fallback or error
        return NextResponse.json({ error: 'Failed to fetch icon' }, { status: 500 });
    }
}
