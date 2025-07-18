import { NextResponse } from 'next/server';
import prisma from '@/app/libs/prismadb';
import getCurrentUser from '@/app/actions/getCurrentUser';

export async function PATCH(
    request: Request,
    { params }: { params: { listingId: string } }
) {
    try {
        const currentUser = await getCurrentUser();
        
        if (!currentUser) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { icsUrl } = body;

        const { listingId } = params;

        if (!listingId || typeof listingId !== 'string') {
            return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
        }

        // Verify the user owns this listing
        const listing = await prisma.listing.findUnique({
            where: {
                id: listingId
            }
        });

        if (!listing) {
            return NextResponse.json({ error: 'Listing not found' }, { status: 404 });
        }

        if (listing.userId !== currentUser.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        // Validate ICS URL format if provided
        if (icsUrl && typeof icsUrl === 'string') {
            try {
                new URL(icsUrl);
                if (!icsUrl.includes('.ics') && !icsUrl.includes('calendar')) {
                    return NextResponse.json({ 
                        error: 'Invalid ICS URL format' 
                    }, { status: 400 });
                }
            } catch {
                return NextResponse.json({ 
                    error: 'Invalid URL format' 
                }, { status: 400 });
            }
        }

        const updatedListing = await prisma.listing.update({
            where: {
                id: listingId
            },
            data: {
                icsUrl: icsUrl || null
            }
        });

        return NextResponse.json(updatedListing);
    } catch (error: any) {
        console.error('Update listing ICS URL error:', error);
        return NextResponse.json({ 
            error: 'Internal server error' 
        }, { status: 500 });
    }
}
