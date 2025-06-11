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
import ical from 'node-ical';

export interface CalendarSyncOptions {
    icsUrl: string;
    listingId: string;
}

export default async function calendarSync(options: CalendarSyncOptions) {
    const { icsUrl, listingId } = options;

    // Fetch the ICS file
    const response = await axios.get(icsUrl);
    const icsData = response.data as string;

    // Parse the ICS data
    const parsed = ical.sync.parseICS(icsData);

    const listing = await prisma.listing.findUnique({ where: { id: listingId } });
    if (!listing) {
        throw new Error(`Listing with ID ${listingId} not found`);
    }

    for (const event of Object.values(parsed)) {
        if (event.type !== 'VEVENT') continue;
        const startDate = new Date(event.start as Date);
        const endDate = new Date(event.end as Date);

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
        } else {
            await prisma.reservation.create({
                data: {
                    listingId,
                    userId: listing.userId,
                    startDate,
                    endDate,
                    totalPrice: 0,
                }
            })
        }
    }
}