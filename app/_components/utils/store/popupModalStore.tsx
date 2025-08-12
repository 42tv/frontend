import { create } from 'zustand';
import { openPopupModal, closeAllModals } from '../overlay/overlayHelpers';
import { ReactNode } from 'react';

interface ModalState {
    currentOverlayId: string | null;
    openPopup: (content: ReactNode) => void;
    closePopup: () => void;
}

const popupModalStore = create<ModalState>((set, get) => ({
    currentOverlayId: null,
    openPopup: (content) => {
        const overlayId = openPopupModal(content);
        set({ currentOverlayId: overlayId });
    },
    closePopup: () => {
        const { currentOverlayId } = get();
        if (currentOverlayId) {
            closeAllModals();
            set({ currentOverlayId: null });
        }
    },
}));

export default popupModalStore;
