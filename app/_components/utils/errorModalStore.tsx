import { create } from 'zustand';

interface ModalState {
    isOpen: boolean;
    content: React.ReactNode | null;
    openError: (content: React.ReactNode) => void;
    closeModal: () => void;
}

const errorModalStore = create<ModalState>((set) => ({
    isOpen: false,
    content: null,
    openError: (content) => set({ isOpen: true, content }),
    closeModal: () => set({ isOpen: false, content: null }),
}));

export default errorModalStore;
