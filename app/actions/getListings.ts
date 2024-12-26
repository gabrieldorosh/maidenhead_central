import prisma from '../libs/prismadb';
import { ListingQuery } from '../types';

export interface IListingParams {
  userId?: string;
  guestCount?: number;
  roomCount?: number;
  bathroomCount?: number;
  startDate?: string;
  endDate?: string;
  locationValue?: string;
  category?: string;
}

export default async function getListings(
  params: IListingParams
) {
  try {
    const {
      userId,
      guestCount,
      roomCount,
      bathroomCount,
      startDate,
      endDate,
      locationValue,
      category
    } = params;

    const query: ListingQuery = {};

    if (userId) {
      query.userId = userId;
    };

    if (category) {
      query.category = category;
    };

    if (roomCount) {
      query.roomCount = {
        gte: +roomCount, // Convert to number
      };
    };

    if (guestCount) {
      query.guestCount = {
        gte: +guestCount
      };
    };

    if (bathroomCount) {
      query.bathroomCount = {
        gte: +bathroomCount
      };
    };

    if (locationValue) {
      query.locationValue = locationValue;
    };

    if (startDate && endDate) {
      query.NOT = {
        reservations: {
          some: {
            OR: [
              // Logic for filtering out conflicts
              {
                endDate: { gte: startDate },
                startDate: { lte: startDate },
              },
              {
                startDate: { lte: endDate },
                endDate: { gte: endDate },
              }
            ]
          }
        }
      }
    };

    const listings = await prisma.listing.findMany({
      where: query,
      orderBy: {
          createdAt: 'desc'
      }
    });

    const safeListings = listings.map((listing) => ({
      ...listing,
      createdAt: listing.createdAt.toISOString(),
    }));

    return safeListings;
  } catch (error: unknown) {
    // Narrow down the type of error
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    // If the error is not an instance of Error, throw a new error
    throw new Error('An unknown error occurred')
  }
}