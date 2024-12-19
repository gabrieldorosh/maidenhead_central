import { create } from 'zustand';

interface LogInModalStore {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
}

const useLogInModal = create<LogInModalStore>((set) => ({
    isOpen: false,
    onOpen: () => set({ isOpen: true }),
    onClose: () => set({ isOpen: false }),
}))

export default useLogInModal;