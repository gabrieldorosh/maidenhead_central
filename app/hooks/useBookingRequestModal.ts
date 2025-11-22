import { create } from 'zustand';

interface BookingRequestModalStore {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
}

const useBookingRequestModal = create<BookingRequestModalStore>((set) => ({
    isOpen: false,
    onOpen: () => set({ isOpen: true }),
    onClose: () => set({ isOpen: false })
}));

export default useBookingRequestModal;
