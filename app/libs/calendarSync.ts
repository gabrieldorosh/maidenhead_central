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
    forceResync?: boolean; // If true, delete all calendar reservations first
}

export default async function calendarSync(options: CalendarSyncOptions) {
    const { icsUrl, listingId, forceResync = false } = options;

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
        let deletedCount = 0;

        // Force resync: Delete all calendar-synced reservations first
        if (forceResync) {
            const existingCalendarReservations = await prisma.reservation.findMany({
                where: {
                    listingId,
                    totalPrice: 0, // Only calendar-synced reservations
                },
                select: { id: true }
            });

            if (existingCalendarReservations.length > 0) {
                await prisma.reservation.deleteMany({
                    where: {
                        id: {
                            in: existingCalendarReservations.map(r => r.id)
                        }
                    }
                });
                deletedCount = existingCalendarReservations.length;
            }
        }

        // Collect all valid events first
        const validEvents = [];
        
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

            validEvents.push({ startDate, endDate });
        }

        // Early return if no valid events
        if (validEvents.length === 0) {
            // Only clean up if not force resync (already cleaned up above)
            if (!forceResync) {
                // If no events in ICS, clean up all existing calendar-synced reservations
                const existingCalendarReservations = await prisma.reservation.findMany({
                    where: {
                        listingId,
                        // Only delete reservations that were created by calendar sync (totalPrice = 0)
                        totalPrice: 0,
                        // Only future reservations to avoid deleting historical data
                        startDate: {
                            gte: new Date()
                        }
                    }
                });

                if (existingCalendarReservations.length > 0) {
                    await prisma.reservation.deleteMany({
                        where: {
                            id: {
                                in: existingCalendarReservations.map(r => r.id)
                            }
                        }
                    });
                    deletedCount = existingCalendarReservations.length;
                }
            }

            return {
                success: true,
                created: 0,
                updated: 0,
                deleted: deletedCount,
                message: forceResync ? 
                    `Force resync completed: ${deletedCount} reservations cleared` :
                    deletedCount > 0 ? 
                        `Cleaned up ${deletedCount} cancelled reservations` : 
                        'No valid events found to sync'
            };
        }

        // Batch check for existing reservations (calendar-synced only)
        // Skip this check if force resync (already deleted all)
        const existingReservations = forceResync ? [] : await prisma.reservation.findMany({
            where: {
                listingId,
                // Only get calendar-synced reservations (totalPrice = 0)
                totalPrice: 0,
                // Only future reservations to avoid deleting historical data
                startDate: {
                    gte: new Date()
                }
            },
            select: {
                id: true,
                startDate: true,
                endDate: true
            }
        });

        // Create maps for quick lookup
        const existingMap = new Map();
        const allExistingKeys = new Set();
        
        existingReservations.forEach(res => {
            const key = `${res.startDate.toISOString()}-${res.endDate.toISOString()}`;
            existingMap.set(key, res);
            allExistingKeys.add(key);
        });

        // Prepare batch operations
        const createData = [];
        const updatePromises = [];
        const validEventKeys = new Set();

        for (const event of validEvents) {
            const key = `${event.startDate.toISOString()}-${event.endDate.toISOString()}`;
            validEventKeys.add(key);
            const existing = existingMap.get(key);

            if (existing) {
                // Add to update batch
                updatePromises.push(
                    prisma.reservation.update({
                        where: { id: existing.id },
                        data: {
                            startDate: event.startDate,
                            endDate: event.endDate,
                        },
                    })
                );
                updatedCount++;
            } else {
                // Add to create batch
                createData.push({
                    listingId,
                    userId: listing.userId,
                    startDate: event.startDate,
                    endDate: event.endDate,
                    totalPrice: 0,
                });
                createdCount++;
            }
        }

        // Find reservations that exist in DB but not in ICS (cancelled bookings)
        // Skip deletion check if force resync (already deleted all)
        if (!forceResync) {
            const keysToDelete = Array.from(allExistingKeys).filter(key => !validEventKeys.has(key));
            const reservationsToDelete = keysToDelete.map(key => existingMap.get(key)).filter(Boolean);
            
            if (reservationsToDelete.length > 0) {
                const deletePromise = prisma.reservation.deleteMany({
                    where: {
                        id: {
                            in: reservationsToDelete.map(r => r.id)
                        }
                    }
                });
                updatePromises.push(deletePromise);
                deletedCount += reservationsToDelete.length;
            }
        }

        // Execute batch operations
        const promises = [];
        
        if (createData.length > 0) {
            promises.push(prisma.reservation.createMany({ data: createData }));
        }
        
        if (updatePromises.length > 0) {
            promises.push(...updatePromises);
        }

        if (promises.length > 0) {
            await Promise.all(promises);
        }

        return {
            success: true,
            created: createdCount,
            updated: updatedCount,
            deleted: deletedCount,
            message: forceResync ? 
                `Force resync completed: ${deletedCount} cleared, ${createdCount} new reservations imported` :
                `Synced ${createdCount} new, ${updatedCount} updated, and ${deletedCount} deleted reservations`
        };
    } catch (error: any) {
        console.error(`Calendar sync failed for listing ${listingId}:`, error);
        throw new Error(`Calendar sync failed: ${error.message}`);
    }
}