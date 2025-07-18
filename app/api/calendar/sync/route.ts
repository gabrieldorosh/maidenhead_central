import { NextResponse } from 'next/server';
import calendarSync from '@/app/libs/calendarSync';
import getCurrentUser from '@/app/actions/getCurrentUser';
import prisma from '@/app/libs/prismadb';

export async function POST(request: Request) {
    try {
        // Check if user is authenticated
        const currentUser = await getCurrentUser();
        
        if (!currentUser) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { listingId, icsUrl, forceResync = false } = body;

        if (!listingId || !icsUrl) {
            return NextResponse.json({ error: 'Missing listingId or icsUrl' }, { status: 400 });
        }

        // Verify the user owns this listing
        const listing = await prisma.listing.findUnique({
            where: { id: listingId },
            select: { userId: true, title: true }
        });

        if (!listing) {
            return NextResponse.json({ error: 'Listing not found' }, { status: 404 });
        }

        if (listing.userId !== currentUser.id) {
            return NextResponse.json({ 
                error: 'Unauthorized - You can only sync your own listings' 
            }, { status: 403 });
        }

        const result = await calendarSync({ listingId, icsUrl, forceResync });
        
        // Update the last sync timestamp
        await prisma.listing.update({
            where: { id: listingId },
            data: { lastIcsSyncAt: new Date() }
        });
        
        return NextResponse.json({ 
            status: 'synced',
            message: `Calendar synced successfully for "${listing.title}"`,
            result
        });
    } catch (error: any) {
        console.error('Calendar sync error:', error);
        const msg = error.message || JSON.stringify(error);
        return NextResponse.json({ error: msg }, { status: 500 });
    }
}