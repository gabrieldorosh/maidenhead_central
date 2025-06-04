# Maidenhead Central

A property management app built with [Next.js 13](https://nextjs.org) and TypeScript. It allows for listing, reservation, and management of bookings.

It uses Next.js, NextAuth, Prisma, TailwindCSS, and other React libraries.

It is a current WIP

## Features
The database is set up with MongoDB via Prisma
Authentication is handled with NextAuth (Google, GitHub, credentials) and uses JWTs
State managemant is handled with Zustand hooks
Multiple reusable UI components were created with TailwindCSS

---

## Setup
1. Install dependencies:
    ```bash
    npm install
    ```
2. Create `.env` file and configure the following variables:
    ```bash
    DATABASE_URL=<MongoDB connection string>
    GITHUB_ID=<GitHub oAuth client id>
    GITHUB_SECRET=<GitHub oAuth client secret>
    GOOGLE_ID=<Google oAuth client id>
    GOOGLE_SECRET=<Google oAuth client secret>
    NEXTAUTH_SECRET=<Random string used by NextAuth>
    NEXTAUTH_URL=http://localhost:3000
    NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=<your Cloudinary cloud name>
    NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=<Cloudinary upload preset>
    ```
3. Run the development server:
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) to view the site.