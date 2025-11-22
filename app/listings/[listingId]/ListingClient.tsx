'use client';

import { useCallback, useEffect, useMemo, useState } from "react";

import { SafeListing, SafeReservation, SafeUser } from "@/app/types";
import { categories } from "@/app/components/navbar/Categories";
import Container from "@/app/components/Container";
import ListingHead from "@/app/components/listings/ListingHead";
import ListingInfo from "@/app/components/listings/ListingInfo";
import useBookingRequestModal from "@/app/hooks/useBookingRequestModal";
import { useRouter } from "next/navigation";
import { differenceInCalendarDays, eachDayOfInterval } from "date-fns";
import ListingReservation from "@/app/components/listings/ListingReservation";
import BookingRequestModal from "@/app/components/modals/BookingRequestModal";
import { Range } from "react-date-range";

const initialDateRange = {
    startDate: new Date(),
    endDate: new Date(),
    key: 'selection',
}

interface ListingClientProps {
    reservations?: SafeReservation[];
    listing: SafeListing & {
        user: SafeUser;
    };
    currentUser?: SafeUser | null;
}

const ListingClient: React.FC<ListingClientProps> = ({
    reservations = [],
    listing,
    currentUser,
}) => {

    const bookingRequestModal = useBookingRequestModal();
    const router = useRouter();

    // Check for dates that are already reserved
    const disabledDates = useMemo(() => {
        let dates: Date[] = [];

        reservations.forEach((reservation: SafeReservation) => {
            const range = eachDayOfInterval({
                start: new Date(reservation.startDate),
                end: new Date(reservation.endDate),
            });

            // Only disable dates that are truly occupied (between check-in and check-out)
            // Check-in dates can serve as check-out dates for previous bookings
            // Check-out dates can serve as check-in dates for next bookings
            const occupiedDates = range.slice(1, -1); // Remove both first and last dates
            dates = [...dates, ...occupiedDates];
        });

        return dates;
    }, [reservations]);

    // States
    const [ isLoading, setIsLoading ] = useState(false);
    const [ totalPrice, setTotalPrice ] = useState(listing.price);
    const [ dateRange, setDateRange ] = useState<Range>(initialDateRange);

    // Open booking request modal
    const onCreateReservation = useCallback(() => {
        bookingRequestModal.onOpen();
    }, [bookingRequestModal]);

    // Calculate total price
    useEffect(() => {
        if (dateRange.startDate && dateRange.endDate) {
            const dayCount = differenceInCalendarDays(dateRange.endDate, dateRange.startDate);
            if (dayCount && listing.price) {
                setTotalPrice(dayCount * listing.price);
            } else {
                setTotalPrice(listing.price);
            }
        }
    }, [dateRange, listing.price]);

    const category = useMemo(() => {
        return categories.find((item) =>
            item.label === listing.category); 
    }, [listing.category]);

    return (
        <Container>
            <div className="max-w-screen-lg mx-auto">
                <div className="flex flex-col gap-6">
                    <ListingHead 
                        title={listing.title}
                        imageSrc={listing.imageSrc}
                        locationValue={listing.locationValue}
                        id={listing.id}
                        currentUser={currentUser}
                    />
                    <div className="grid grid-cols-1 md:grid-cols-7 md:gap-10 mt-6">
                        <ListingInfo
                            user={listing.user}
                            category={category}
                            description={listing.description}
                            roomCount={listing.roomCount}
                            guestCount={listing.guestCount}
                            bathroomCount={listing.bathroomCount}
                            locationValue={listing.locationValue}
                        />
                        <div className="
                                order-first
                                mb-10
                                md:order-last
                                md:col-span-3
                            "
                        >
                            <ListingReservation
                                price={listing.price}
                                totalPrice={totalPrice}
                                onChangeDate={(value) => setDateRange(value)}
                                dateRange={dateRange}
                                onSubmit={onCreateReservation}
                                disabled={isLoading}
                                disabledDates={disabledDates}
                                minStay={listing.minStay || 2} // default min 2 nights
                            />
                        </div>
                    </div>
                </div>
            </div>
            
            <BookingRequestModal
                isOpen={bookingRequestModal.isOpen}
                onClose={bookingRequestModal.onClose}
                listing={{
                    id: listing.id,
                    title: listing.title,
                    price: listing.price,
                    guestCount: listing.guestCount,
                    minStay: listing.minStay
                }}
                dateRange={dateRange}
                totalPrice={totalPrice}
            />
        </Container>
    )
}

export default ListingClient;