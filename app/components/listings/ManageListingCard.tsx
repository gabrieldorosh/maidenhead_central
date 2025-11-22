'use client';

import { useRouter } from "next/navigation";
import { SafeUser, SafeListing } from "@/app/types";
import useCountries from "@/app/hooks/useCountries";
import { useCallback } from "react";
import Image from "next/image";
import Button from "../Button";

interface ManageListingCardProps {
    data: SafeListing;
    onDelete?: (id: string) => void;
    disabled?: boolean;
    currentUser?: SafeUser | null;
}

const ManageListingCard: React.FC<ManageListingCardProps> = ({
    data,
    onDelete,
    disabled,
    currentUser,
}) => {
    const router = useRouter();
    const { getByValue } = useCountries();

    const location = getByValue(data.locationValue);

    const handleView = useCallback(() => {
        router.push(`/listings/${data.id}`);
    }, [router, data.id]);

    const handleManage = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        router.push(`/listings/${data.id}/manage`);
    }, [router, data.id]);

    const handleDelete = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        if (disabled) return;
        onDelete?.(data.id);
    }, [onDelete, data.id, disabled]);

    return (
        <div className="col-span-1 cursor-pointer group">
            <div className="flex flex-col gap-2 w-full">
                <div
                    onClick={handleView}
                    className="
                        aspect-square
                        w-full
                        relative
                        overflow-hidden
                        rounded-xl
                    "
                >
                    <Image
                        fill
                        alt="listing"
                        src={data.imageSrc}
                        className="
                            object-cover
                            h-full
                            w-full
                            group-hover:scale-105
                            transition        
                        "
                    />
                </div>
                
                <div className="font-semibold text-lg">
                    {location?.region}, {location?.label}
                </div>
                
                <div className="font-light text-neutral-500">
                    {data.category}
                </div>
                
                <div className="flex flex-row items-center gap-1">
                    <div className="font-semibold">
                        £{data.price}
                    </div>
                    <div className="font-light">
                        / night
                    </div>
                </div>

                {data.icsUrl ? (
                    <div className="text-xs text-green-600 font-medium">
                        📅 Calendar Sync Enabled
                    </div>
                ) : (
                    <div className="text-xs text-red-600 font-medium">
                        📅 Calendar sync disabled
                    </div>
                )}

                <div className="flex flex-col gap-2 mt-2">
                    <Button 
                        small
                        label="Manage Listing"
                        onClick={handleManage}
                        outline
                    />
                    <Button 
                        small
                        label={disabled ? "Deleting..." : "Delete Listing"}
                        onClick={handleDelete}
                        disabled={disabled}
                    />
                </div>
            </div>
        </div>
    );
};

export default ManageListingCard;
