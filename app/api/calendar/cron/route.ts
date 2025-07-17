import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    // For Vercel cron, check for the cron secret header
    const authHeader = request.headers.get('authorization');
    const cronToken = process.env.CRON_SECRET_TOKEN;
    
    // Support both query parameter and header authentication
    const { searchParams } = new URL(request.url);
    const queryToken = searchParams.get('token');
    
    const providedToken = authHeader?.replace('Bearer ', '') || queryToken;
    
    if (!cronToken || providedToken !== cronToken) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        // Call the sync-all endpoint
        const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
        const syncResponse = await fetch(`${baseUrl}/api/calendar/sync-all`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!syncResponse.ok) {
            throw new Error(`Sync failed with status: ${syncResponse.status}`);
        }

        const syncResult = await syncResponse.json();
        
        return NextResponse.json({
            success: true,
            timestamp: new Date().toISOString(),
            ...syncResult
        });
    } catch (error: any) {
        console.error('Cron job failed:', error);
        return NextResponse.json({ 
            success: false,
            error: error.message,
            timestamp: new Date().toISOString()
        }, { status: 500 });
    }
}
