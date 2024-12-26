import { NextResponse } from "next/server";

import getCurrentUser from "@/app/actions/getCurrentUser";
import prisma from "@/app/libs/prismadb";

interface IParams {
    listingId?: string;
}

export async function POST(
    request: Request,
    { params }: { params: IParams }
) {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
        return NextResponse.error();
    }

    const { listingId } = await params;

    if (!listingId || typeof listingId !== 'string') {
        throw new Error('Invalid listingId');
    }

    // const instead of let because the value isn't being reassigned, only mutated
    const favouriteIds = [...(currentUser.favouriteIds || [])];

    favouriteIds.push(listingId);

    const user = await prisma.user.update({
        where: {
            id: currentUser.id
        },
        data: {
            favouriteIds
        }
    });
    
    return NextResponse.json(user);
}

export async function DELETE(
    request: Request,
    { params }: { params: IParams }
) {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
        return NextResponse.error();
    }

    const { listingId } = params;

    if (!listingId || typeof listingId !== 'string') {
        throw new Error('Invalid listingId');
    }

    let favouriteIds = [...(currentUser.favouriteIds || [])];
    
    favouriteIds = favouriteIds.filter((id) => id !== listingId);

    const user = await prisma.user.update({
        where: {
            id: currentUser.id
        },
        data: {
            favouriteIds
        }
    })

    return NextResponse.json(user);
}