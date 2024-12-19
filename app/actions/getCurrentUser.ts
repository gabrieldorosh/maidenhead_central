import { getServerSession } from "next-auth/next";

import { authOptions } from "@/pages/api/auth/[...nextauth]";
import prisma from "@/app/libs/prismadb";

export async function getSession() {
    return await getServerSession(authOptions);
}

export default async function getCurrentUser() {
    try {
        const session = await getSession();

        // Check if session is correct
        if (!session?.user?.email) {
            return null; // Return null if session doesn't exist
        }

        // Get user from database
        const currentUser = await prisma.user.findUnique({
            where: {
                email: session.user.email as string,
            }
        })

        // Check if user exists
        if (!currentUser) {
            return null; // Return null if user doesn't exist
        }

        return {
            ...currentUser, // Return user data like this to avoid hydration errors
            createdAt: currentUser.createdAt.toISOString(),
            updatedAt: currentUser.updatedAt.toISOString(),
            emailVerified: currentUser.emailVerified?.toISOString() || null,
        }
    } catch (error: any) {
        return null;
    }
}