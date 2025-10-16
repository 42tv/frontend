import { create } from 'zustand';

interface ModalState {
  isCoinShopOpen: boolean;
  openCoinShop: () => void;
  closeCoinShop: () => void;
}

const useModalStore = create<ModalState>((set) => ({
  isCoinShopOpen: false,

  openCoinShop: () => set({ isCoinShopOpen: true }),
  closeCoinShop: () => set({ isCoinShopOpen: false }),
}));

export default useModalStore;
