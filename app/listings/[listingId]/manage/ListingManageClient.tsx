'use client';

import { SafeListing, SafeUser } from "@/app/types";
import Container from "@/app/components/Container";
import Heading from "@/app/components/Heading";
import IcsUrlManager from "@/app/components/IcsUrlManager";
import Button from "@/app/components/Button";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { IoChevronBack } from "react-icons/io5";

interface ListingManageClientProps {
    listing: SafeListing & {
        user: SafeUser;
    };
    currentUser: SafeUser;
}

const ListingManageClient: React.FC<ListingManageClientProps> = ({
    listing,
    currentUser
}) => {
    const router = useRouter();
    const [currentIcsUrl, setCurrentIcsUrl] = useState(listing.icsUrl);

    const handleIcsUrlUpdate = (newUrl: string | null) => {
        setCurrentIcsUrl(newUrl);
    };

    const handleBackToListings = () => {
        router.push('/listings');
    };

    return (
        <Container>
            <div className="max-w-screen-lg mx-auto">
                <div className="flex flex-col gap-6">
                    <div className="flex flex-col gap-3">
                        <button 
                            onClick={handleBackToListings}
                            className="
                                self-start
                                text-sm
                                text-neutral-600
                                hover:text-black
                                transition
                                flex
                                items-center
                                gap-1
                            "
                        >
                            <IoChevronBack size={16} />
                            Back to My Listings
                        </button>
                        <Heading 
                            title={`Manage "${listing.title}"`}
                            subtitle="Configure calendar sync and other settings for your listing"
                        />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Listing Info Card */}
                        <div className="p-6 border rounded-lg">
                            <h3 className="text-lg font-semibold mb-4">Listing Overview</h3>
                            <div className="space-y-2 text-sm">
                                <p><span className="font-medium">Category:</span> {listing.category}</p>
                                <p><span className="font-medium">Location:</span> {listing.locationValue}</p>
                                <p><span className="font-medium">Guests:</span> {listing.guestCount}</p>
                                <p><span className="font-medium">Rooms:</span> {listing.roomCount}</p>
                                <p><span className="font-medium">Bathrooms:</span> {listing.bathroomCount}</p>
                                <p><span className="font-medium">Price:</span> £{listing.price}/night</p>
                                <p><span className="font-medium">Created:</span> {new Date(listing.createdAt).toLocaleDateString()}</p>
                                {listing.lastIcsSyncAt && (
                                    <p><span className="font-medium">Last Sync:</span> {new Date(listing.lastIcsSyncAt).toLocaleString()}</p>
                                )}
                            </div>
                        </div>

                        {/* Calendar Sync Card */}
                        <div>
                            <IcsUrlManager 
                                listingId={listing.id}
                                currentIcsUrl={currentIcsUrl || ''}
                                onUpdate={handleIcsUrlUpdate}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </Container>
    );
};

export default ListingManageClient;
