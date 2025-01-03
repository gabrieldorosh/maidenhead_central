import axios from 'axios';
import { useRouter } from 'next/navigation';
import React, { useCallback, useMemo } from 'react';
import { toast } from 'react-hot-toast';

import { SafeUser } from '../types';

import useLogInModal from './useLogInModal';

interface IUseFavourite {
    listingId: string;
    currentUser?: SafeUser | null;
}

const useFavourite = ({
    listingId,
    currentUser
}: IUseFavourite) => {
    const router = useRouter();
    const loginModal = useLogInModal();

    const hasFavourited = useMemo(() => {
        const list = currentUser?.favouriteIds || [];
        
        return list.includes(listingId);
    }, [currentUser, listingId]);

    const toggleFavourite = useCallback(async (
        e: React.MouseEvent<HTMLDivElement>
    ) => {
        e.stopPropagation();

        if (!currentUser) {
            return loginModal.onOpen();
        }

        try {
            let request;

            if (hasFavourited) {
                request = () => axios.delete(`/api/favourites/${listingId}`);
            } else {
                request = () => axios.post(`/api/favourites/${listingId}`);
            }

            await request();
            router.refresh();
            // toast.success('Success'); // Removed for brevity
        } catch (error) {
            console.error(error);
            toast.error('Something went wrong');
        }
    }, 
    [
        currentUser, 
        hasFavourited, 
        listingId, 
        loginModal, 
        router
    ]);

    return {
        hasFavourited,
        toggleFavourite
    };
};

export default useFavourite;