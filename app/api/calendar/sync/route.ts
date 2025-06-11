import { NextResponse } from 'next/server';
import calendarSync from '@/app/libs/calendarSync';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { listingId, icsUrl } = body;

        if (!listingId || !icsUrl) {
            return NextResponse.json({ error: 'Missing listingId or icsUrl' }, { status: 400 });
        }

        await calendarSync({ listingId, icsUrl });
        
        return NextResponse.json({ status: 'synced' });
    } catch (error: any) {
        console.error(error);
        const msg = error.message || JSON.stringify(error);
        return NextResponse.json({ error: msg }, { status: 500 });
    }
}