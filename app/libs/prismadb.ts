// It is best practice to use a singleton pattern to avoid creating multiple instances of the PrismaClient. 
// This is because PrismaClient is a heavy object that holds a connection pool to the database. 
// Creating multiple instances of PrismaClient can lead to performance issues and connection leaks.

import { PrismaClient } from "@prisma/client";

declare global {
    // eslint-disable-next-line no-var
    var prisma : PrismaClient | undefined;
}

const client = globalThis.prisma || new PrismaClient();

if (process.env.NODE_ENV != "production") {
    globalThis.prisma = client;
}

export default client;