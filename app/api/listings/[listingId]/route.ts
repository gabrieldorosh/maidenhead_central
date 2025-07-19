import { NextResponse } from "next/server";

import getCurrentUser from "@/app/actions/getCurrentUser";
import prisma from "@/app/libs/prismadb";

interface IParams {
    listingId?: string;
}

export async function PATCH(
    request: Request,
    { params } : { params: IParams }
) {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
        return NextResponse.error();
    }

    const { listingId } = params;

    if (!listingId || typeof listingId !== "string") {
        throw new Error("Invalid listing ID");
    }

    const body = await request.json();
    const { category, locationValue, guestCount, roomCount, bathroomCount, price, minStay } = body;

    // validate req fields
    if (!category || !locationValue || !guestCount || !roomCount || !bathroomCount || !price || !minStay) {
        return NextResponse.error();
    }

    // validate num vals
    if (guestCount < 1 || roomCount < 1 || bathroomCount < 1 || price < 1 || minStay < 1) {
        return NextResponse.error();
    }

    // check if user owns the listing
    const existingListing = await prisma.listing.findUnique({
        where: {
            id: listingId,
            userId: currentUser.id
        }
    });

    if (!existingListing) {
        return NextResponse.error();
    }

    const listing = await prisma.listing.update({
        where: {
            id: listingId,
            userId: currentUser.id
        },
        data: {
            category: category,
            locationValue: locationValue,
            guestCount: parseInt(guestCount),
            roomCount: parseInt(roomCount),
            bathroomCount: parseInt(bathroomCount),
            price: parseInt(price),
            minStay: parseInt(minStay)
        }
    });

    return NextResponse.json(listing);
}

export async function DELETE(
    request: Request,
    { params } : { params: IParams }
) {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
        return NextResponse.error();
    }

    const { listingId } = params;

    if (!listingId || typeof listingId !== "string") {
        throw new Error("Invalid listing ID");
    }

    const listing = await prisma.listing.deleteMany({
        where: {
            id: listingId,
            userId: currentUser.id
        }
    })

    return NextResponse.json(listing);
} 