import { create } from 'zustand';

interface ModalState {
    isOpen: boolean;
    content: React.ReactNode | null;
    openPopup: (content: React.ReactNode) => void;
    closePopup: () => void;
}

const popupModalStore = create<ModalState>((set) => ({
    isOpen: false,
    content: null,
    openPopup: (content) => set({ isOpen: true, content }),
    closePopup: () => set({ isOpen: false, content: null }),
}));

export default popupModalStore;
