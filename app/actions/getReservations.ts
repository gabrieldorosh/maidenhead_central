import prisma from '@/app/libs/prismadb';

interface IParams {
    listingId?: string;
    userId?: string;
    authorId?: string;
}

export default async function getReservations(
    params: IParams
) {
    try {
        const { listingId, userId, authorId } = params;

        const query: any = {};

        // Find all reservations for this listing
        if (listingId) {
            query.listingId = listingId;
        }

        // Find all reservations for this user
        if (userId) {
            query.userId = userId;
        }

        // Find all reservations for listings for this host
        if (authorId) {
            query.listing = { userId: authorId };
        }

        const reservations = await prisma.reservation.findMany({
            where: query,
            include: {
                listing: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        const SafeReservations = reservations.map(
            (reservation) => ({
                ...reservation,
                createdAt: reservation.createdAt.toISOString(),
                startDate: reservation.startDate.toISOString(),
                endDate: reservation.endDate.toISOString(),
                listing: {
                    ...reservation.listing,
                    createdAt: reservation.listing.createdAt.toISOString(),
                }
            })
        );

        return SafeReservations;
    } catch (error: any) {
        throw new Error(error);
    }
}