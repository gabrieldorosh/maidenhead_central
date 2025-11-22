# Maidenhead Central

A property management platform built with [Next.js 13](https://nextjs.org) and TypeScript. It allows for property listing, guest booking requests, reservation management, and automated calendar synchronisation with external platforms (AirBnB, Booking.com, Vrbo).

Currently in active development.

## Features

### Guest Experience
- **Booking Request System:** Guests can submit booking requests for selected dates with their contact information and custom messages
- **Smart Date Selection:** Interactive calendars with disable dates for existing reservations automatically synced with other platforms via external iCal feeds
- **Responsive Design:** Mobile-first UI with reusable components optimised for all devices.
- **User Authentication:** Support for Google, GitHub, and credential-based authentication

### Host Management:
- **Property Listing:** Create and manage property listings with photos, descriptions, and amenities
- **Listing Management:** Edit property details such as flexible pricings, minimum stays, guest capacity
- **Reservation Dashboard:** View and manage reservations
- **Email Notifications:** Automated emails for new booking requests with detailed guest information

### Calendar Integration
- **External Platform Synchronisation:** Automatically sync with AirBnB, Booking.com, Vrbo, and other platforms via iCal feeds
- **Conflict Prevention:** Smart date blocking to prevent double bookings

## Tech Stack

- **Frontend:** Next.js 13, React 18, TypeScript, TailwindCSS
- **Backend:** Next.js API Routes, Prisma ORM
- **Database:** MongoDB with Prisma
- **Authentication:** NextAuth.js (Google, GitHub, credentials)
- **State Management:** Zustand for global state
- **Email Service:** Resend with custom React Email templates
- **File Upload:** Cloudinary integration for image storage
- **Calendar Sync:** iCal/ICS feed processing with `node-ical`
- **Maps:** React Leaflet for location display
- **Notifications:** React Hot Toast for user feedback

---

## Setup

1. **Install dependencies:**
    ```bash
    npm install
    ```
    
2. **Set up `.env` file and fill in the following variables:**
    ```bash
    # Database
    DATABASE_URL=<MongoDB connection string>

    #Authentication
    NEXTAUTH_SECRET=<Random string used by NextAuth>
    NEXTAUTH_URL=http://localhost:3000
    GITHUB_ID=<GitHub oAuth client id>
    GITHUB_SECRET=<GitHub oAuth client secret>
    GOOGLE_ID=<Google oAuth client id>
    GOOGLE_SECRET=<Google oAuth client secret>

    # File Upload
    NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=<your Cloudinary cloud name>
    NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=<Cloudinary upload preset>

    # Resend (Email Service)
    RESEND_API_KEY=<Your Resend API key>
    EMAIL_FROM_ADDRESS=<Your verified sender email>
    EMAIL_FROM_NAME=<Your sender name>
    
    # Calendar Sync
    CRON_SECRET_TOKEN=<Secret token for cron job authentication>
    ```

3. **Set up the database:**
    ```bash
    npx prisma generate
    npx prisma db push
    ```
    
4. **Run the development server:**
    ```bash
    npm run dev
    ```
    
5. **Open your browser:**
    Go to [http://localhost:3000](http://localhost:3000) to view the site.

### Calendar Sync

The platform automatically synchronises reservations with external calendar feeds (AirBnB, Booking.com, Vrbo, etc.).

#### Configuration:

Each listing can have its own iCal URL configured on the property management page or in the database via the `icsUrl` field.

#### Manual Synchronisation:

Sync a specific listing's calendar:

```bash
curl -X POST http://localhost:3000/api/calendar/sync \
    -H 'Content-Type: application/json' \
    -d '{"listingId":"<LISTING_ID>","icsUrl":"https://example.com/calendar.ics"}'
```

#### Bulk Synchronisation:

Sync all listings with configured iCal URLs:

```bash
curl -X POST http://localhost:3000/api/calendar/sync-all
```

#### Automated Synchronisation with Cron:
For scheduled automation with authentication:

```bash
curl "http://localhost:3000/api/calendar/cron?token=<CRON_SECRET_TOKEN>"
```

## API Endpoints

### Booking Requests
- `POST /api/booking-request` - Submit a new booking request with guest information

### Calendar Management
- `POST /api/calendar/sync` - Sync specific listing calendar from iCal URL
- `POST /api/calendar/sync-all` - Sync all listing calendars with configured iCal URLs
- `GET /api/calendar/cron` - Automated sync endpoint for scheduled tasks (requires token)

### Property Management
- `GET /api/listings` - Fetch all listings with optional filtering
- `GET /api/listings/[id]` - Fetch specific listing details
- `POST /api/listings` - Create new listing (auth required)
- `PATCH /api/listings/[id]` - Update existing listing (owner authentication required)

### Reservation Management
- `POST /api/reservations` - Create new reservation (authentication required)
- `DELETE /api/reservations/[id]` - Cancel reservation (user or host authentication required)

### User Management
- `POST /api/register` - Register new user account
- Authentication handled via NextAuth.js endpoints

### Favourites
- `POST /api/favourites/[listingId]` - Toggle listing favourite status (authentication required)

## Cron Job Configuration

**Vercel (Recommended)**
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

## Support

For support, questions, or contributions, please:

- Open an issue on [GitHub](https://github.com/gabrieldorosh/maidenhead_central)
- Contact me at [gabrieldorosh.com](https://gabrieldorosh.com)
