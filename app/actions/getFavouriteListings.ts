import prisma from '@/app/libs/prismadb';

import getCurrentUser from './getCurrentUser';
import toast from 'react-hot-toast';

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
        }));

        return SafeFavourites;
    } catch (error: any) {
        throw new Error(error);
    }
} 