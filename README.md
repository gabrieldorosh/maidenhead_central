# Maidenhead Central

A property management app built with [Next.js 13](https://nextjs.org) and TypeScript. It allows for listing, reservation, and management of bookings.

It uses Next.js, NextAuth, Prisma, TailwindCSS, and other React libraries.

It is a current WIP.
## Features

The database is set up with MongoDB via Prisma
Authentication is handled with NextAuth (Google, GitHub, credentials) and uses JWTs
State managemant is handled with Zustand hooks
Multiple reusable UI components were created with TailwindCSS
Calendar Sync (Airbnb, Booking.com)

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
    AIRBNB_CALENDAR_URL=<iCal URL for your Airbnb listing>
    AIRBNB_LISTING_ID=<ID of the listing in the databse to block dates for>
    ```
3. Run the development server:
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) to view the site.
### Calendar Sync

The project is able to synchronise reservations from an iCalendar (ICS) feed. The sync is triggered by sending a POST request to `/api/calendar/sync` with `listingId` and `url` fields in the JSON body.

```bash
curl -X POST http://localhost:3000/api/calendar/sync \
    -H 'Content-Type: application/json' \
    -d '{"listingId":"<LISTING_ID>","icsUrl":"https://example.com/calendar.ics"}'
```

Each event in the feed will be upserted as a reservation for the selected listing.