import getCurrentUser from "@/app/actions/getCurrentUser";
import getListingById from "@/app/actions/getListingById";

import ClientOnly from "@/app/components/ClientOnly";
import EmptyState from "@/app/components/EmptyState";

import ListingClient from "./ListingClient";

interface IParams {
    listingId?: string;
}

const ListingPage = async ({ params }: { params: IParams }) => { // This is a server component so cannot use hooks here
    const listing = await getListingById(params);
    const currentUser = await getCurrentUser(); 

    if (!listing) {
        return (
            <ClientOnly>
                <EmptyState 
                    title="Listing not found"
                    subtitle="The listing you are looking for does not exist."
                />
            </ClientOnly>
        )
    }

    return (
        <ClientOnly>
            <ListingClient
                listing={listing}
                currentUser={currentUser}
            />
        </ClientOnly>
    )
}

export default ListingPage;