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
    CRON_SECRET_TOKEN=<Secret token for cron job authentication>
    ```
3. Run the development server:
    ```bash
    npm run dev
    ```
4. Open [http://localhost:3000](http://localhost:3000) to view the site.
### Calendar Sync

The project is able to synchronise reservations from an iCalendar (ICS) feed per listing.

#### Setup per-listing ICS URLs:
Each listing can have its own ICS URL configured in the database. The `icsUrl` field in the `Listing` model stores the calendar URL.

#### Manual sync:
Send a POST request to `/api/calendar/sync` with `listingId` and `url` fields:

```bash
curl -X POST http://localhost:3000/api/calendar/sync \
    -H 'Content-Type: application/json' \
    -d '{"listingId":"<LISTING_ID>","icsUrl":"https://example.com/calendar.ics"}'
```

#### Automated sync:
Sync all listings with configured ICS URLs:

```bash
curl -X POST http://localhost:3000/api/calendar/sync-all
```

#### Cron job setup:
For automated scheduling, use the cron endpoint with authentication:

```bash
curl "http://localhost:3000/api/calendar/cron?token=<CRON_SECRET_TOKEN>"
```

#### Setting up automated scheduling:

**Vercel Cron (Recommended for Vercel deployments)**
The project includes `vercel.json` with cron configuration that runs daily at 6 AM:

```json
{
  "crons": [
    {
      "path": "/api/calendar/cron", 
      "schedule": "0 6 * * *"
    }
  ]
}
```

*Note: Vercel Hobby accounts are limited to daily cron jobs. For more frequent syncing, upgrade to Pro plan or use external cron services.*

Make sure to set the `CRON_SECRET_TOKEN` environment variable in your Vercel project settings.

**Alternative option:**

*External cron service*
Use services like cron-job.org or EasyCron:

```bash
# Add to crontab for every 6 hours
0 */6 * * * curl -f "https://yourdomain.com/api/calendar/cron?token=YOUR_SECRET_TOKEN"
```

Each event in the feed will be upserted as a reservation for the selected listing.
