/* 
TODO:
1. Fetch .ICS files
2. Parse events using node-ical
3. Map each event to reservation format (start date, end date, guest information, etc.)
4. Use prisma to upsert reservations into `Reservation` so there are no duplicates (ICS uid as unique identifier)
5. Add API route that triggers sync logic, run on schedule with cron job
6. Update UI to show reservations from calendar sync
7. Respect rate limits
8. Ensure timezones are handled correctly (DTSTART, DTEND, etc. in ICS files)
*/

import axios from 'axios';
import prisma from './prismadb';
import * as ical from 'node-ical';

export interface CalendarSyncOptions {
    icsUrl: string;
    listingId: string;
}

export default async function calendarSync(options: CalendarSyncOptions) {
    const { icsUrl, listingId } = options;

    try {
        // Fetch the ICS file with timeout
        const response = await axios.get(icsUrl, {
            timeout: 30000, // 30 second timeout
            headers: {
                'User-Agent': 'Calendar-Sync-Bot/1.0'
            }
        });
        const icsData = response.data as string;

        // Parse the ICS data
        const parsed = ical.sync.parseICS(icsData);

        const listing = await prisma.listing.findUnique({ where: { id: listingId } });
        if (!listing) {
            throw new Error(`Listing with ID ${listingId} not found`);
        }

        let createdCount = 0;
        let updatedCount = 0;

        for (const event of Object.values(parsed)) {
            const eventObj = event as any; // Type assertion for ical events
            if (eventObj.type !== 'VEVENT') continue;
            
            // Skip events without proper dates
            if (!eventObj.start || !eventObj.end) continue;
            
            const startDate = new Date(eventObj.start as Date);
            const endDate = new Date(eventObj.end as Date);
            
            // Skip invalid dates
            if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) continue;
            
            // Skip past events (older than 30 days)
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
            if (endDate < thirtyDaysAgo) continue;

            // Look for existing reservation with same dates and listing ID
            const existingReservation = await prisma.reservation.findFirst({
                where: {
                    listingId,
                    startDate,
                    endDate,
                },
            });

            if (existingReservation) {
                await prisma.reservation.update({
                    where: { id: existingReservation.id },
                    data: {
                        startDate,
                        endDate,
                    },
                });
                updatedCount++;
            } else {
                await prisma.reservation.create({
                    data: {
                        listingId,
                        userId: listing.userId,
                        startDate,
                        endDate,
                        totalPrice: 0,
                    }
                });
                createdCount++;
            }
        }

        return {
            success: true,
            created: createdCount,
            updated: updatedCount,
            message: `Synced ${createdCount} new and ${updatedCount} updated reservations`
        };
    } catch (error: any) {
        console.error(`Calendar sync failed for listing ${listingId}:`, error);
        throw new Error(`Calendar sync failed: ${error.message}`);
    }
}