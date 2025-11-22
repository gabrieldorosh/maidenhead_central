import prisma from '../libs/prismadb';

interface IParams {
    listingId?: string;
}

export default async function getListingById(
    params: IParams
) {
    try {
        const { listingId } = params;

        // Don't need to check anything as this is not an API route
        // listingId can be used directly.

        const listing = await prisma.listing.findUnique({
            where: {
                id: listingId
            },
            include: {
                user: true
            }
        });

        if (!listing) {
            throw new Error('Listing not found');
        }

        return {
            ...listing,
            createdAt: listing.createdAt.toISOString(),
            lastIcsSyncAt: listing.lastIcsSyncAt?.toISOString() || null,
            user: {
                ...listing.user,
                createdAt: listing.user.createdAt.toISOString(),
                updatedAt: listing.user.updatedAt.toISOString(),
                emailVerified: listing.user.emailVerified?.toISOString() || null,
            },
        };
    } catch (error: unknown) {
        // Narrow down the error type
        if (error instanceof Error) {
            throw new Error(error.message);
        }
        // Otherwise
        throw new Error('An unknown error occurred');
    }
}

