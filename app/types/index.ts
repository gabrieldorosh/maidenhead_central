import { Listing, Reservation, User } from "@prisma/client";

export type SafeUser = Omit<
    User,
    "createdAt" | "updatedAt" | "emailVerified"
> & {
    createdAt: string;
    updatedAt: string;
    emailVerified: string | null;
}

export type SafeListing = Omit<
    Listing,
    "createdAt" | "lastIcsSyncAt"
> & {
    createdAt: string;
    lastIcsSyncAt?: string | null;
}

export type SafeReservation = Omit<
    Reservation,
    "createdAt" | "startDate" | "endDate" | "listing"
> & {
    createdAt: string;
    startDate: string;
    endDate: string;
    listing: SafeListing;
}

export type SearchQueryParams = {
    locationValue?: string;
    guestCount?: number;
    roomCount?: number;
    bathroomCount?: number;
    startDate?: string;
    endDate?: string;
    [key: string]: string | number | boolean | null | undefined | (string | number | boolean | null | undefined)[];
}

export type ReservationQuery = {
    listingId?: string;
    userId?: string;
    listing?: {
        userId?: string;
    };
}

export type RangeFilter = {
    gte: number;
}

export type ReservationConflict = {
    endDate?: { gte: string };
    startDate?: { lte: string };
}

export type ListingQuery = {
    userId?: string;
    category?: string;
    roomCount?: RangeFilter;
    guestCount?: RangeFilter;
    bathroomCount?: RangeFilter;
    locationValue?: string;
    NOT?: {
        reservations: {
            some: {
                OR: ReservationConflict[];
            };
        };
    };
}