'use client';

import { toast } from "react-hot-toast";
import axios from "axios";
import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";

// Types
import { SafeReservation, SafeUser } from "../types";

// Components
import Heading from "../components/Heading";
import Container from "../components/Container";
import ListingCard from "../components/listings/ListingCard";
import Modal from "../components/modals/Modal";

interface ReservationsClientProps {
    reservations: SafeReservation[];
    currentUser?: SafeUser | null;
}

const ReservationsClient: React.FC<ReservationsClientProps> = ({
    reservations,
    currentUser,
}) => {
    const router = useRouter();
    const [deletingId, setDeletingId] = useState('');
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [reservationToCancel, setReservationToCancel] = useState<string | null>(null);

    const onCancel = useCallback((id: string) => {
        const reservation = reservations.find(r => r.id === id);
        
        // totalPrice = 0 means it's imported and cannot be cancelled here
        if (reservation && reservation.totalPrice === 0) {
            toast.error("This reservation was imported from an external calendar and cannot be cancelled from Maidenhead Central. Please cancel it from the original booking platform.");
            return;
        }

        setReservationToCancel(id);
        setShowConfirmModal(true);
    }, [reservations]);

    const handleConfirmCancel = useCallback(async () => {
        if (!reservationToCancel) return;

        setDeletingId(reservationToCancel);

        try {
            await axios.delete(`/api/reservations/${reservationToCancel}`);
            toast.success("Reservation cancelled successfully");
            router.refresh();
        } catch (error) {
            toast.error("Failed to cancel reservation");
        } finally {
            setDeletingId('');
            setShowConfirmModal(false);
            setReservationToCancel(null);
        }
    }, [reservationToCancel, router]);

    const handleCancelModal = useCallback(() => {
        setShowConfirmModal(false);
        setReservationToCancel(null);
    }, []);

    // Cancel modal
    const bodyContent = (
        <div className="text-center">
            <p className="text-neutral-600">
                Are you sure you want to cancel this guest's reservation? This action cannot be undone.
            </p>
        </div>
    );

    return (
        <Container>
            <Heading 
                title="Reservations"
                subtitle="Here are the reservations for your listings"
            />
            
            {reservations.some(r => r.totalPrice === 0) && (
                <div className="mt-6 mb-6 px-4 py-3 bg-gray-50 rounded-xl border border-gray-100">
                    <p className="text-sm text-gray-600">
                        <span className="font-medium text-gray-900">Imported reservations</span> cannot be cancelled here. 
                        Please use the original platform to modify these bookings.
                    </p>
                </div>
            )}
            
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8">
                {reservations.map((reservation) => {
                    const isImported = reservation.totalPrice === 0;
                    
                    return (
                        <ListingCard 
                            key={reservation.id}
                            data={reservation.listing}
                            reservation={reservation}
                            actionId={reservation.id}
                            onAction={onCancel}
                            disabled={deletingId === reservation.id || isImported}
                            actionLabel={isImported ? "Imported Reservation" : "Cancel Guest's Reservation"}
                            currentUser={currentUser}
                        />
                    );
                })}
            </div>

            <Modal
                isOpen={showConfirmModal}
                onClose={handleCancelModal}
                onSubmit={handleConfirmCancel}
                title="Cancel Reservation"
                body={bodyContent}
                actionLabel={!!deletingId ? "Cancelling..." : "Yes, Cancel Reservation"}
                secondaryAction={handleCancelModal}
                secondaryActionLabel="Keep Reservation"
                disabled={!!deletingId}
            />
        </Container>
    )
}

export default ReservationsClient;