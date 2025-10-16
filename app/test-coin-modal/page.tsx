'use client';

import React from 'react';
import { useModalStore } from '@/app/_lib/stores';
import CoinShopModalWrapper from '@/app/_components/modals/CoinShopModalWrapper';

export default function TestCoinModalPage() {
  const { openCoinShop } = useModalStore();

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white mb-8">코인 상점 모달 테스트</h1>
        <button
          onClick={openCoinShop}
          className="px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg font-medium transition-colors"
        >
          코인 상점 열기
        </button>
      </div>
      <CoinShopModalWrapper />
    </div>
  );
}
