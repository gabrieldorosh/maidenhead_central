import prisma from '../libs/prismadb';

interface IParams {
    listingId?: string;
}

export default async function getListingById(
    params: IParams
) {
    try {
        const { listingId } = await params;

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
            throw null;
        }

        return {
            ...listing,
            createdAt: listing.createdAt.toISOString(),
            user: {
                ...listing.user,
                createdAt: listing.user.createdAt.toISOString(),
                updatedAt: listing.user.updatedAt.toISOString(),
                emailVerified: listing.user.emailVerified?.toISOString() || null,
            }
        }
    } catch (error: any) {
        throw new Error(error);
    }
}

