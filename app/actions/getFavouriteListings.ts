import prisma from '@/app/libs/prismadb';
import getCurrentUser from './getCurrentUser';

export default async function getFavouriteListings() {
    try {
        const currentUser = await getCurrentUser();

        if (!currentUser) {
            return [];
        }

        const favourites = await prisma.listing.findMany({
            where: {
                id: {
                    in: [...(currentUser.favouriteIds || [])]
                }
            }
        });

        const SafeFavourites = favourites.map((favourite) => ({
            ...favourite,
            createdAt: favourite.createdAt.toISOString(),
            lastIcsSyncAt: favourite.lastIcsSyncAt?.toISOString() || null,
        }));

        return SafeFavourites;
    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error(error.message);
        }
        throw new Error('An unknown error occurred');
    }
} 