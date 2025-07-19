'use client';

import { SafeListing, SafeUser } from "@/app/types";
import Container from "@/app/components/Container";
import Heading from "@/app/components/Heading";
import IcsUrlManager from "@/app/components/IcsUrlManager";
import Button from "@/app/components/Button";
import SimpleInput from "@/app/components/inputs/SimpleInput";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { IoChevronBack, IoEyeOutline } from "react-icons/io5";
import { useForm, FieldValues, SubmitHandler } from "react-hook-form";
import axios from "axios";
import { toast } from "react-hot-toast";
import { categories } from "@/app/components/navbar/Categories";
import useCountries from "@/app/hooks/useCountries";

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
    const { getAll, getByValue } = useCountries();
    const [currentIcsUrl, setCurrentIcsUrl] = useState(listing.icsUrl);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(listing.category);
    const [selectedLocation, setSelectedLocation] = useState(listing.locationValue);

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors, isDirty }
    } = useForm<FieldValues>({
        defaultValues: {
            category: listing.category,
            locationValue: listing.locationValue,
            guestCount: listing.guestCount,
            roomCount: listing.roomCount,
            bathroomCount: listing.bathroomCount,
            price: listing.price,
            minStay: listing.minStay || 2
        }
    });

    // Check form for changes
    const hasChanges = isDirty || 
        selectedCategory !== listing.category || 
        selectedLocation !== listing.locationValue;

    const handleIcsUrlUpdate = (newUrl: string | null) => {
        setCurrentIcsUrl(newUrl);
    };

    const handleBackToListings = () => {
        router.push('/listings');
    };

    const handleViewListing = () => {
        router.push(`/listings/${listing.id}`);
    };

    const onSubmit: SubmitHandler<FieldValues> = async (data) => {
        setIsLoading(true);
        
        try {
            await axios.patch(`/api/listings/${listing.id}`, {
                category: selectedCategory,
                locationValue: selectedLocation,
                guestCount: data.guestCount,
                roomCount: data.roomCount,
                bathroomCount: data.bathroomCount,
                price: data.price,
                minStay: data.minStay
            });
            
            toast.success('Listing updated successfully');
            router.refresh(); // refresh page to reflect changes
        } catch (error) {
            console.error('Error updating listing:', error);
            toast.error('Failed to update listing');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Container>
            <div className="max-w-screen-lg mx-auto">
                <div className="flex flex-col gap-6">
                    <div className="flex flex-col gap-3">
                        <div className="flex items-center justify-between">
                            <button 
                                onClick={handleBackToListings}
                                className="
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
                            
                            <button 
                                onClick={handleViewListing}
                                className="
                                    px-4
                                    py-2
                                    text-sm
                                    bg-blue-600
                                    text-white
                                    rounded-md
                                    hover:bg-blue-700
                                    transition
                                    flex
                                    items-center
                                    gap-2
                                "
                            >
                                <IoEyeOutline size={16} />
                                View Listing
                            </button>
                        </div>
                        <Heading 
                            title={`Manage "${listing.title}"`}
                            subtitle="Configure your listing settings and calendar sync"
                        />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Listing Info Card */}
                        <div className="p-6 border rounded-lg">
                            <h3 className="text-lg font-semibold mb-4">Listing Settings</h3>
                            
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                                {/* Editable fields */}
                                <div className="space-y-4">
                                    <div className="grid grid-cols-3 gap-4 items-center">
                                        <label className="text-sm font-medium text-gray-700">Category:</label>
                                        <div className="col-span-2">
                                            <SimpleInput
                                                id="category"
                                                isDropdown
                                                options={categories.map(cat => ({ value: cat.label, label: cat.label }))}
                                                value={selectedCategory}
                                                onChange={(value) => {
                                                    setSelectedCategory(value);
                                                    setValue('category', value, { shouldDirty: true });
                                                }}
                                                register={register}
                                                errors={errors}
                                                placeholder="Select category"
                                                required
                                            />
                                        </div>
                                    </div>
                                    
                                    <div className="grid grid-cols-3 gap-4 items-center">
                                        <label className="text-sm font-medium text-gray-700">Location:</label>
                                        <div className="col-span-2">
                                            <SimpleInput
                                                id="locationValue"
                                                isDropdown
                                                options={getAll().map(country => ({ value: country.value, label: `${country.flag} ${country.label}` }))}
                                                value={selectedLocation}
                                                onChange={(value) => {
                                                    setSelectedLocation(value);
                                                    setValue('locationValue', value, { shouldDirty: true });
                                                }}
                                                register={register}
                                                errors={errors}
                                                placeholder="Select country"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-3 gap-4 items-center">
                                        <label className="text-sm font-medium text-gray-700">Max Guests:</label>
                                        <div className="col-span-2">
                                            <SimpleInput
                                                id="guestCount"
                                                type="number"
                                                required
                                                register={register}
                                                errors={errors}
                                                placeholder="Number of guests"
                                            />
                                        </div>
                                    </div>
                                    
                                    <div className="grid grid-cols-3 gap-4 items-center">
                                        <label className="text-sm font-medium text-gray-700">Bedrooms:</label>
                                        <div className="col-span-2">
                                            <SimpleInput
                                                id="roomCount"
                                                type="number"
                                                required
                                                register={register}
                                                errors={errors}
                                                placeholder="Number of bedrooms"
                                            />
                                        </div>
                                    </div>
                                    
                                    <div className="grid grid-cols-3 gap-4 items-center">
                                        <label className="text-sm font-medium text-gray-700">Bathrooms:</label>
                                        <div className="col-span-2">
                                            <SimpleInput
                                                id="bathroomCount"
                                                type="number"
                                                required
                                                register={register}
                                                errors={errors}
                                                placeholder="Number of bathrooms"
                                            />
                                        </div>
                                    </div>
                                    
                                    <div className="grid grid-cols-3 gap-4 items-center">
                                        <label className="text-sm font-medium text-gray-700">Price per Night:</label>
                                        <div className="col-span-2">
                                            <SimpleInput
                                                id="price"
                                                type="number"
                                                formatPrice
                                                required
                                                register={register}
                                                errors={errors}
                                                placeholder="Price in pounds"
                                            />
                                        </div>
                                    </div>
                                    
                                    <div className="grid grid-cols-3 gap-4 items-center">
                                        <label className="text-sm font-medium text-gray-700">Minimum Stay:</label>
                                        <div className="col-span-2">
                                            <SimpleInput
                                                id="minStay"
                                                type="number"
                                                required
                                                register={register}
                                                errors={errors}
                                                placeholder="Minimum nights"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Save button */}
                                <Button
                                    disabled={!hasChanges || isLoading}
                                    label={isLoading ? "Saving..." : "Save Changes"}
                                    onClick={handleSubmit(onSubmit)}
                                />
                            </form>

                            {/* uneditable fields */}
                            <div className="pt-4 border-t border-gray-200 mt-6">
                                <div className="space-y-2 text-sm text-gray-600">
                                    <p><span className="font-medium">Created:</span> {new Date(listing.createdAt).toLocaleDateString()}</p>
                                    {listing.lastIcsSyncAt && (
                                        <p><span className="font-medium">Last Sync:</span> {new Date(listing.lastIcsSyncAt).toLocaleString()}</p>
                                    )}
                                </div>
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
