import { NextResponse } from "next/server";

import getCurrentUser from "@/app/actions/getCurrentUser";
import prisma from "@/app/libs/prismadb";

export async function POST(
    request: Request,
    context: { params: Record<string, unknown> }
) {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
        return NextResponse.error();
    }

    // Safely extract the listing ID from the URL during runtime
    const listingId = context.params?.listingId;

    if (!listingId || typeof listingId !== 'string') {
        throw new Error('Invalid listing ID');
    }

    const favouriteIds = [...(currentUser.favouriteIds || []), listingId];

    const user = await prisma.user.update({
        where: { id: currentUser.id },
        data: { favouriteIds },
    });
    
    return NextResponse.json(user);
}

export async function DELETE(
    request: Request,
    context: { params: Record<string, unknown> } 
) {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
        return NextResponse.error();
    }

    const listingId = context.params?.listingId;

    if (!listingId || typeof listingId !== 'string') {
        throw new Error('Invalid listing ID');
    }

    let favouriteIds = [...(currentUser.favouriteIds || [])];
    favouriteIds = favouriteIds.filter((id) => id !== listingId);

    const user = await prisma.user.update({
        where: { id: currentUser.id },
        data: { favouriteIds },
    })

    return NextResponse.json(user);
}