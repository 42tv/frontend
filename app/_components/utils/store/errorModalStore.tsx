import { create } from 'zustand';
import { openErrorModal, closeAllModals } from '../overlay/overlayHelpers';
import { ReactNode } from 'react';

interface ModalState {
    currentOverlayId: string | null;
    openError: (content: ReactNode) => void;
    closeModal: () => void;
}

const errorModalStore = create<ModalState>((set, get) => ({
    currentOverlayId: null,
    openError: (content) => {
        const overlayId = openErrorModal(content);
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

export default errorModalStore;
