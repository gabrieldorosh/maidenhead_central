import getCurrentUser from "@/app/actions/getCurrentUser";
import getListingById from "@/app/actions/getListingById";
import ClientOnly from "@/app/components/ClientOnly";
import EmptyState from "@/app/components/EmptyState";
import ListingManageClient from "./ListingManageClient";

interface IParams {
    listingId?: string;
}

const ListingManagePage = async ({ params }: { params: IParams }) => {
    const currentUser = await getCurrentUser();
    const listing = await getListingById(params);

    if (!currentUser) {
        return (
            <ClientOnly>
                <EmptyState 
                    title="Unauthorized"
                    subtitle="You need to be logged in to manage listings."
                />
            </ClientOnly>
        );
    }

    if (!listing) {
        return (
            <ClientOnly>
                <EmptyState 
                    title="Listing not found"
                    subtitle="The listing you are looking for does not exist."
                />
            </ClientOnly>
        );
    }

    if (listing.userId !== currentUser.id) {
        return (
            <ClientOnly>
                <EmptyState 
                    title="Unauthorized"
                    subtitle="You can only manage your own listings."
                />
            </ClientOnly>
        );
    }

    return (
        <ClientOnly>
            <ListingManageClient 
                listing={{
                    ...listing,
                    lastIcsSyncAt: listing.lastIcsSyncAt ? listing.lastIcsSyncAt.toISOString() : null
                }}
                currentUser={currentUser}
            />
        </ClientOnly>
    );
};

export default ListingManagePage;
