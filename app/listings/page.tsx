import EmptyState from "../components/EmptyState";
import ClientOnly from "../components/ClientOnly";
import ListingsClient from "./ListingsClient";

import getCurrentUser from "../actions/getCurrentUser";
import getListings from "../actions/getListings";

const ListingsPage = async () => {
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

    const listings = await getListings({
        userId: currentUser.id
    });

    // If the user has no reservations, show an empty state
    if (listings.length === 0) {
        return (
            <ClientOnly>
                <EmptyState 
                    title="No Listings Found"
                    subtitle="You haven't listed any properties yet."
                />
            </ClientOnly>
        )
    }

    return (
        <ClientOnly>
            <ListingsClient
                listings={listings}
                currentUser={currentUser}
            />
        </ClientOnly>
    )
}

export default ListingsPage