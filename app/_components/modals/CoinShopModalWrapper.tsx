'use client';

import React from 'react';
import { useModalStore } from '@/app/_lib/stores';
import CoinShopModal from './CoinShopModal';

const CoinShopModalWrapper: React.FC = () => {
  const { isCoinShopOpen, closeCoinShop } = useModalStore();

  const handlePurchase = (coins: number, amount: number) => {
    console.log(`구매: ${coins}개 코인, ${amount}원`);
    // TODO: 실제 구매 API 호출
    closeCoinShop();
  };

  const handleGift = (coins: number, amount: number) => {
    console.log(`선물: ${coins}개 코인, ${amount}원`);
    // TODO: 실제 선물 API 호출
    closeCoinShop();
  };

  if (!isCoinShopOpen) return null;

  return (
    <CoinShopModal
      onClose={closeCoinShop}
      onPurchase={handlePurchase}
      onGift={handleGift}
    />
  );
};

export default CoinShopModalWrapper;
