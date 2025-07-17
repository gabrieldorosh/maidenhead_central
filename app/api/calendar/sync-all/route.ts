import { NextResponse } from 'next/server';
import prisma from '@/app/libs/prismadb';
import calendarSync from '@/app/libs/calendarSync';

export async function POST(request: Request) {
    try {
        // Get all listings that have an ICS URL configured
        const listingsWithIcs = await prisma.listing.findMany({
            where: {
                icsUrl: {
                    not: null
                }
            },
            select: {
                id: true,
                icsUrl: true,
                title: true,
                lastIcsSyncAt: true
            }
        });

        if (listingsWithIcs.length === 0) {
            return NextResponse.json({ 
                message: 'No listings with ICS URLs found',
                synced: 0 
            });
        }

        const results = [];
        let successCount = 0;
        let errorCount = 0;

        for (const listing of listingsWithIcs) {
            try {
                await calendarSync({
                    listingId: listing.id,
                    icsUrl: listing.icsUrl!
                });

                // Update the last sync timestamp
                await prisma.listing.update({
                    where: { id: listing.id },
                    data: { lastIcsSyncAt: new Date() }
                });

                results.push({
                    listingId: listing.id,
                    title: listing.title,
                    status: 'success'
                });
                successCount++;
            } catch (error: any) {
                console.error(`Failed to sync listing ${listing.id}:`, error);
                results.push({
                    listingId: listing.id,
                    title: listing.title,
                    status: 'error',
                    error: error.message
                });
                errorCount++;
            }
        }
        
        return NextResponse.json({
            message: `Sync completed: ${successCount} successful, ${errorCount} failed`,
            results,
            synced: successCount,
            failed: errorCount
        });
    } catch (error: any) {
        console.error('Calendar sync-all error:', error);
        return NextResponse.json({ 
            error: error.message || 'Internal server error' 
        }, { status: 500 });
    }
}
