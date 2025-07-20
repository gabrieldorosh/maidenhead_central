import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import prismadb from '@/app/libs/prismadb';
import { format } from 'date-fns';
import { createBookingRequestEmail } from '@/app/libs/emailTemplates';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
    try {
        // Parse request body with guest information from modal
        const body = await request.json();
        const { 
            listingId, 
            startDate, 
            endDate, 
            totalPrice, 
            guestInfo: {
                name: guestName,
                email: guestEmail, 
                phone: guestPhone,
                guestCount
            },
            message 
        } = body;

        // Validate required fields
        if (!listingId || !startDate || !endDate || !totalPrice || 
            !guestName || !guestEmail || !guestPhone || !guestCount) {
            return NextResponse.json(
                { error: 'Missing required fields' }, 
                { status: 400 }
            );
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(guestEmail)) {
            return NextResponse.json(
                { error: 'Invalid email format' }, 
                { status: 400 }
            );
        }

        // Validate phone format
        const phoneRegex = /^[\+]?[0-9][\d\s\-\(\)]{6,20}$/;
        if (!phoneRegex.test(guestPhone)) {
            return NextResponse.json(
                { error: 'Invalid phone number format' }, 
                { status: 400 }
            );
        }

        // Fetch listing details including host information
        const listing = await prismadb.listing.findUnique({
            where: { id: listingId },
            include: {
                user: true // Include host details
            }
        });

        if (!listing) {
            return NextResponse.json(
                { error: 'Listing not found' }, 
                { status: 404 }
            );
        }

        // Check if host has an email (they should)
        if (!listing.user.email) {
            return NextResponse.json(
                { error: 'Host email not available' }, 
                { status: 400 }
            );
        }

        // Format dates for better readability
        const checkInDate = format(new Date(startDate), 'EEEE, MMMM do, yyyy');
        const checkOutDate = format(new Date(endDate), 'EEEE, MMMM do, yyyy');
        const nights = Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24));

        // Check if minimum stay requirements are met
        const minStay = listing.minStay || 2;
        const meetsMinStay = nights >= minStay;

        // Use template to create email content
        const emailHtml = createBookingRequestEmail({
            listing: {
                title: listing.title,
                locationValue: listing.locationValue,
                guestCount: listing.guestCount,
                roomCount: listing.roomCount,
                bathroomCount: listing.bathroomCount,
            },
            guest: {
                name: guestName,
                email: guestEmail,
                phone: guestPhone,
            },
            booking: {
                checkInDate,
                checkOutDate,
                nights,
                totalPrice,
                guestCount: parseInt(guestCount),
                meetsMinStay,
            },
            message,
        });

        // Send email via Resend
        const emailData = await resend.emails.send({
            from: `${process.env.EMAIL_FROM_NAME} <${process.env.EMAIL_FROM_ADDRESS}>`,
            to: [listing.user.email],
            replyTo: [guestEmail],
            subject: `New Booking Request - ${listing.title} - ${checkInDate}`,
            html: emailHtml,
        });

        return NextResponse.json({ 
            success: true, 
            emailId: emailData.data?.id,
            message: 'Booking request sent successfully' 
        });

    } catch (error) {
        console.error('Booking request email error:', error);
        return NextResponse.json(
            { error: 'Failed to send booking request' }, 
            { status: 500 }
        );
    }
}
