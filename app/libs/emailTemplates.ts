interface BookingRequestEmailProps {
  listing: {
    title: string;
    locationValue: string;
    guestCount: number;
    roomCount: number;
    bathroomCount: number;
  };
  guest: {
    name: string;
    email: string;
    phone: string;
  };
  booking: {
    checkInDate: string;
    checkOutDate: string;
    nights: number;
    totalPrice: number;
    guestCount: number;
    meetsMinStay: boolean;
  };
  message?: string;
}

export function createBookingRequestEmail({
  listing,
  guest,
  booking,
  message
}: BookingRequestEmailProps): string {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Booking Request</title>
        <!--[if mso]>
        <noscript>
            <xml>
                <o:OfficeDocumentSettings>
                    <o:PixelsPerInch>96</o:PixelsPerInch>
                </o:OfficeDocumentSettings>
            </xml>
        </noscript>
        <![endif]-->
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #222222; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%;">
        
        <!-- Email Wrapper -->
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
            <tr>
                <td>
                    
                    <!-- Email Container -->
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width: 600px; margin: 0 auto;">
                        
                        <!-- Header -->
                        <tr>
                            <td style="padding: 40px 40px 32px; border-bottom: 1px solid #f0f0f0;">
                                
                                <!-- Brand Section -->
                                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                    <tr>
                                        <td style="padding-bottom: 32px; text-align: center;">
                                            <img src="https://maidenhead-central.vercel.app/images/logo.png" alt="Maidenhead Central" width="150" style="display: block; border: 0; margin: 0 auto; max-width: 100%; height: auto;">
                                        </td>
                                    </tr>
                                </table>
                                
                                <!-- Header Content -->
                                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                    <tr>
                                        <td>
                                            <h1 style="margin: 0 0 8px 0; font-size: 32px; font-weight: 700; color: #222222; letter-spacing: -0.02em; line-height: 1.2;">New booking request</h1>
                                            <p style="margin: 0; font-size: 18px; color: #717171; font-weight: 400; line-height: 1.5;">You have a new inquiry for <strong style="font-weight: 600; color: #222222;">${listing.title}</strong></p>
                                        </td>
                                    </tr>
                                </table>
                                
                            </td>
                        </tr>
                        
                        <!-- Trip Details Section -->
                        <tr>
                            <td style="padding: 40px; border-bottom: 1px solid #f0f0f0;">
                                <h2 style="margin: 0 0 24px 0; font-size: 22px; font-weight: 600; color: #222222; letter-spacing: -0.01em;">Trip details</h2>
                                
                                <!-- Info Rows -->
                                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                    <tr>
                                        <td style="padding: 16px 0; border-bottom: 1px solid #f0f0f0;">
                                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                                <tr>
                                                    <td style="font-size: 16px; color: #717171; font-weight: 400;">Check-in</td>
                                                    <td style="text-align: right; font-size: 16px; font-weight: 600; color: #222222;">${booking.checkInDate}</td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 16px 0; border-bottom: 1px solid #f0f0f0;">
                                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                                <tr>
                                                    <td style="font-size: 16px; color: #717171; font-weight: 400;">Check-out</td>
                                                    <td style="text-align: right; font-size: 16px; font-weight: 600; color: #222222;">${booking.checkOutDate}</td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 16px 0; border-bottom: 1px solid #f0f0f0;">
                                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                                <tr>
                                                    <td style="font-size: 16px; color: #717171; font-weight: 400;">Guests</td>
                                                    <td style="text-align: right; font-size: 16px; font-weight: 600; color: #222222;">${booking.guestCount} ${booking.guestCount === 1 ? 'guest' : 'guests'}</td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 16px 0 0 0;">
                                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                                <tr>
                                                    <td style="font-size: 16px; color: #717171; font-weight: 400;">Nights</td>
                                                    <td style="text-align: right; font-size: 16px; font-weight: 600; color: #222222;">${booking.nights} ${booking.nights === 1 ? 'night' : 'nights'}</td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                </table>
                                
                                <!-- Total Section -->
                                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-top: 20px;">
                                    <tr>
                                        <td style="background-color: #2563eb; padding: 16px 20px; border-radius: 10px; text-align: center;">
                                            <!--[if mso]>
                                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                                <tr>
                                                    <td style="text-align: center;">
                                            <![endif]-->
                                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                                <tr>
                                                    <td style="text-align: center;">
                                                        ${booking.meetsMinStay ? `
                                                        <div style="font-size: 12px; color: #ffffff; margin-bottom: 2px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px; opacity: 0.9;">TOTAL PAYOUT</div>
                                                        <div style="font-size: 28px; font-weight: 700; color: #ffffff; letter-spacing: -0.01em;">£${booking.totalPrice}</div>
                                                        ` : `
                                                        <div style="font-size: 12px; color: #ffffff; margin-bottom: 2px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px; opacity: 0.9;">PRICING</div>
                                                        <div style="font-size: 20px; font-weight: 700; color: #ffffff; letter-spacing: -0.01em;">Special rates apply</div>
                                                        <div style="font-size: 12px; color: #ffffff; margin-top: 4px; opacity: 0.9;">Guest does not meet minimum stay requirements</div>
                                                        `}
                                                    </td>
                                                </tr>
                                            </table>
                                            <!--[if mso]>
                                                    </td>
                                                </tr>
                                            </table>
                                            <![endif]-->
                                        </td>
                                    </tr>
                                </table>
                                
                            </td>
                        </tr>
                        
                        <!-- Guest Section -->
                        <tr>
                            <td style="padding: 40px; border-bottom: 1px solid #f0f0f0;">
                                <h2 style="margin: 0 0 24px 0; font-size: 22px; font-weight: 600; color: #222222; letter-spacing: -0.01em;">Guest Information</h2>
                                
                                <!-- Guest Card -->
                                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background: #f9f9f9; border-radius: 16px; border: 1px solid #f0f0f0;">
                                    <tr>
                                        <td style="padding: 32px;">
                                            
                                            <!-- Guest Info Rows -->
                                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                                <tr>
                                                    <td style="padding: 12px 0; border-bottom: 1px solid #e8e8e8;">
                                                        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                                            <tr>
                                                                <td style="font-size: 15px; color: #717171; font-weight: 400;">Name</td>
                                                                <td style="text-align: right; font-size: 15px; font-weight: 600; color: #222222;">${guest.name}</td>
                                                            </tr>
                                                        </table>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td style="padding: 12px 0; border-bottom: 1px solid #e8e8e8;">
                                                        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                                            <tr>
                                                                <td style="font-size: 15px; color: #717171; font-weight: 400;">Email</td>
                                                                <td style="text-align: right; font-size: 15px; font-weight: 600; color: #222222;">${guest.email}</td>
                                                            </tr>
                                                        </table>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td style="padding: 12px 0 0 0;">
                                                        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                                            <tr>
                                                                <td style="font-size: 15px; color: #717171; font-weight: 400;">Phone</td>
                                                                <td style="text-align: right; font-size: 15px; font-weight: 600; color: #222222;">${guest.phone}</td>
                                                            </tr>
                                                        </table>
                                                    </td>
                                                </tr>
                                            </table>
                                            
                                        </td>
                                    </tr>
                                </table>
                                
                            </td>
                        </tr>
                        
                        ${message ? `
                        <!-- Message Section -->
                        <tr>
                            <td style="padding: 40px; border-bottom: 1px solid #f0f0f0;">
                                <h2 style="margin: 0 0 24px 0; font-size: 22px; font-weight: 600; color: #222222; letter-spacing: -0.01em;">Message from guest</h2>
                                
                                <!-- Message Container -->
                                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background: #f8fafc; border-radius: 12px; border: 1px solid #e2e8f0;">
                                    <tr>
                                        <td style="padding: 24px;">
                                            <div style="font-size: 16px; color: #374151; line-height: 1.6; font-style: italic; margin: 0;">${message}</div>
                                        </td>
                                    </tr>
                                </table>
                                
                            </td>
                        </tr>
                        ` : ''}
                        
                        <!-- Property Section -->
                        <tr>
                            <td style="padding: 40px;">
                                <h2 style="margin: 0 0 24px 0; font-size: 22px; font-weight: 600; color: #222222; letter-spacing: -0.01em;">Your listing</h2>
                                
                                <!-- Property Info -->
                                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                    <tr>
                                        <td style="padding: 16px 0; border-bottom: 1px solid #f0f0f0;">
                                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                                <tr>
                                                    <td style="font-size: 16px; color: #717171; font-weight: 400;">Property</td>
                                                    <td style="text-align: right; font-size: 16px; font-weight: 600; color: #222222;">${listing.title}</td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 16px 0 0 0;">
                                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                                <tr>
                                                    <td style="font-size: 16px; color: #717171; font-weight: 400;">Location</td>
                                                    <td style="text-align: right; font-size: 16px; font-weight: 600; color: #222222;">${listing.locationValue}</td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                </table>
                                
                                <!-- Property Stats -->
                                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-top: 24px;">
                                    <tr>
                                        <td width="33.33%" style="padding-right: 8px;">
                                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background: #f9f9f9; border-radius: 12px; border: 1px solid #f0f0f0;">
                                                <tr>
                                                    <td style="padding: 24px 20px; text-align: center;">
                                                        <div style="font-size: 28px; font-weight: 700; color: #222222; margin-bottom: 4px; line-height: 1;">${listing.guestCount}</div>
                                                        <div style="font-size: 13px; color: #717171; font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px;">GUESTS</div>
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                        <td width="33.33%" style="padding: 0 4px;">
                                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background: #f9f9f9; border-radius: 12px; border: 1px solid #f0f0f0;">
                                                <tr>
                                                    <td style="padding: 24px 20px; text-align: center;">
                                                        <div style="font-size: 28px; font-weight: 700; color: #222222; margin-bottom: 4px; line-height: 1;">${listing.roomCount}</div>
                                                        <div style="font-size: 13px; color: #717171; font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px;">BEDROOMS</div>
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                        <td width="33.33%" style="padding-left: 8px;">
                                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background: #f9f9f9; border-radius: 12px; border: 1px solid #f0f0f0;">
                                                <tr>
                                                    <td style="padding: 24px 20px; text-align: center;">
                                                        <div style="font-size: 28px; font-weight: 700; color: #222222; margin-bottom: 4px; line-height: 1;">${listing.bathroomCount}</div>
                                                        <div style="font-size: 13px; color: #717171; font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px;">BATHROOMS</div>
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                </table>
                                
                            </td>
                        </tr>
                        
                        <!-- Footer -->
                        <tr>
                            <td style="padding: 40px; text-align: center; border-top: 1px solid #f0f0f0;">
                                
                                <h3 style="margin: 0 0 24px 0; font-size: 22px; font-weight: 600; color: #222222;">What's next?</h3>
                                
                                <!-- Steps Container -->
                                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width: 400px; margin: 0 auto 40px auto;">
                                    <tr>
                                        <td style="padding-bottom: 12px;">
                                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background: #f9f9f9; border-radius: 12px; border: 1px solid #f0f0f0;">
                                                <tr>
                                                    <td style="padding: 20px 24px;">
                                                        <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                                                            <tr>
                                                                <td style="vertical-align: top; padding-right: 16px;">
                                                                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="background: #2563eb; border-radius: 50%; width: 28px; height: 28px;">
                                                                        <tr>
                                                                            <td style="text-align: center; vertical-align: middle; font-size: 14px; font-weight: 600; color: white; line-height: 28px;">1</td>
                                                                        </tr>
                                                                    </table>
                                                                </td>
                                                                <td style="vertical-align: top;">
                                                                    <div style="font-size: 15px; color: #222222; font-weight: 400; line-height: 1.5; margin-top: 2px;">Reply to this email to connect with ${guest.name}</div>
                                                                </td>
                                                            </tr>
                                                        </table>
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding-bottom: 12px;">
                                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background: #f9f9f9; border-radius: 12px; border: 1px solid #f0f0f0;">
                                                <tr>
                                                    <td style="padding: 20px 24px;">
                                                        <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                                                            <tr>
                                                                <td style="vertical-align: top; padding-right: 16px;">
                                                                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="background: #2563eb; border-radius: 50%; width: 28px; height: 28px;">
                                                                        <tr>
                                                                            <td style="text-align: center; vertical-align: middle; font-size: 14px; font-weight: 600; color: white; line-height: 28px;">2</td>
                                                                        </tr>
                                                                    </table>
                                                                </td>
                                                                <td style="vertical-align: top;">
                                                                    <div style="font-size: 15px; color: #222222; font-weight: 400; line-height: 1.5; margin-top: 2px;">Accept the booking and block these dates in your calendar</div>
                                                                </td>
                                                            </tr>
                                                        </table>
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background: #f9f9f9; border-radius: 12px; border: 1px solid #f0f0f0;">
                                                <tr>
                                                    <td style="padding: 20px 24px;">
                                                        <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                                                            <tr>
                                                                <td style="vertical-align: top; padding-right: 16px;">
                                                                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="background: #2563eb; border-radius: 50%; width: 28px; height: 28px;">
                                                                        <tr>
                                                                            <td style="text-align: center; vertical-align: middle; font-size: 14px; font-weight: 600; color: white; line-height: 28px;">3</td>
                                                                        </tr>
                                                                    </table>
                                                                </td>
                                                                <td style="vertical-align: top;">
                                                                    <div style="font-size: 15px; color: #222222; font-weight: 400; line-height: 1.5; margin-top: 2px;">Send confirmation details to your guest</div>
                                                                </td>
                                                            </tr>
                                                        </table>
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                </table>
                                
                                <!-- Footer Brand -->
                                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="border-top: 1px solid #f0f0f0; padding-top: 32px;">
                                    <tr>
                                        <td style="text-align: center; padding-bottom: 12px;">
                                            <img src="https://maidenhead-central.vercel.app/images/logo.png" alt="Maidenhead Central" width="120" style="display: block; border: 0; margin: 0 auto; max-width: 100%; height: auto;">
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="text-align: center;">
                                            <div style="font-size: 14px; color: #717171; font-weight: 400; margin: 0;">Premium property management</div>
                                        </td>
                                    </tr>
                                </table>
                                
                            </td>
                        </tr>
                        
                    </table>
                    
                </td>
            </tr>
        </table>
        
    </body>
    </html>
  `;
}
