import { create } from 'zustand';
import { openModal, closeAllModals } from '../overlay/overlayHelpers';
import { ReactNode } from 'react';

interface ModalState {
    currentOverlayId: string | null;
    openModal: (content: ReactNode) => void;
    closeModal: () => void;
}

const useModalStore = create<ModalState>((set, get) => ({
    currentOverlayId: null,
    openModal: (content) => {
        const overlayId = openModal(content);
        set({ currentOverlayId: overlayId });
    },
    closeModal: () => {
        const { currentOverlayId } = get();
        if (currentOverlayId) {
            closeAllModals();
            set({ currentOverlayId: null });
        }
    },
}));

export default useModalStore;
