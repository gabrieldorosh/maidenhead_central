import EmptyState from "../components/EmptyState";
import ClientOnly from "../components/ClientOnly";

import getCurrentUser from "../actions/getCurrentUser";
import getReservations from "../actions/getReservations";
import TripsClient from "./TripsClient";

const TripsPage = async () => {
    const currentUser = await getCurrentUser();

    // Shouldn't be able to get here without a user but just in case
    if (!currentUser) {
        return (
            <ClientOnly>
                <EmptyState 
                    title="Unauthorized"
                    subtitle="You must be logged in to view this page."
                />
            </ClientOnly>
        )
    }

    const reservations = await getReservations({
        userId: currentUser.id
    });

    // If the user has no reservations, show an empty state
    if (reservations.length === 0) {
        return (
            <ClientOnly>
                <EmptyState 
                    title="No Trips Found"
                    subtitle="You haven't booked any trips yet."
                />
            </ClientOnly>
        )
    }

    return (
        <ClientOnly>
            <TripsClient
                reservations={reservations}
                currentUser={currentUser}
            />
        </ClientOnly>
    )
}

export default TripsPage