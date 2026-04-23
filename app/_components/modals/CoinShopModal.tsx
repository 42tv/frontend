'use client';

import React, { useState } from 'react';

interface CoinPackage {
  id: string;
  coins: number | 'custom';
  price: number;
  label: string;
}

interface CoinShopModalProps {
  onClose?: () => void;
  onPurchase?: (coins: number, amount: number) => void;
  onGift?: (coins: number, amount: number) => void;
}

const COIN_PACKAGES: CoinPackage[] = [
  { id: 'custom', coins: 'custom', price: 0, label: '직접입력' },
  { id: '100', coins: 100, price: 11000, label: '100' },
  { id: '300', coins: 300, price: 33000, label: '300' },
  { id: '500', coins: 500, price: 55000, label: '500' },
  { id: '1000', coins: 1000, price: 110000, label: '1,000' },
  { id: '2000', coins: 2000, price: 220000, label: '2,000' },
];

const CoinShopModal: React.FC<CoinShopModalProps> = ({
  onClose,
  onPurchase,
  onGift,
}) => {
  const [selectedPackage, setSelectedPackage] = useState<string>('100');
  const [customAmount, setCustomAmount] = useState<number>(100);

  const getSelectedCoins = (): number => {
    if (selectedPackage === 'custom') {
      return customAmount;
    }
    const pkg = COIN_PACKAGES.find((p) => p.id === selectedPackage);
    return pkg && typeof pkg.coins === 'number' ? pkg.coins : 100;
  };

  const getSelectedPrice = (): number => {
    if (selectedPackage === 'custom') {
      return customAmount * 110; // 1 coin = 110원
    }
    const pkg = COIN_PACKAGES.find((p) => p.id === selectedPackage);
    return pkg ? pkg.price : 0;
  };

  const handlePurchase = () => {
    const coins = getSelectedCoins();
    const price = getSelectedPrice();
    if (onPurchase) {
      onPurchase(coins, price);
    }
  };

  const handleGift = () => {
    const coins = getSelectedCoins();
    const price = getSelectedPrice();
    if (onGift) {
      onGift(coins, price);
    }
  };

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 0;
    setCustomAmount(value);
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-[#2a2a2a] rounded-lg w-full max-w-md mx-4 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative px-6 py-4 border-b border-[#3a3a3a]">
          <h2 className="text-lg font-semibold text-white">상점</h2>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M18 6L6 18M6 6l12 12" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-[#3a3a3a]">
          <div className="flex-1 py-3 text-sm font-medium text-white border-b-2 border-white text-center">
            하드
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Coin Packages Grid */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            {COIN_PACKAGES.map((pkg) => (
              <button
                key={pkg.id}
                onClick={() => setSelectedPackage(pkg.id)}
                className={`aspect-square rounded-lg flex flex-col items-center justify-center transition-all ${
                  selectedPackage === pkg.id
                    ? 'bg-[#4a4a4a] border-2 border-white'
                    : 'bg-[#3a3a3a] border-2 border-transparent hover:bg-[#404040]'
                }`}
              >
                {pkg.coins === 'custom' ? (
                  <>
                    <svg width="24" height="24" viewBox="0 0 64 64" fill="none" className="mb-1">
                      <circle cx="32" cy="32" r="30" fill="#F4C542"/>
                      <circle cx="32" cy="32" r="26" fill="#FFD700"/>
                      <circle cx="32" cy="32" r="22" fill="#F4C542"/>
                      <ellipse cx="24" cy="24" rx="8" ry="6" fill="#FFE55C" opacity="0.6"/>
                      <path d="M32 20 L28 28 L32 24 L36 28 Z M32 44 L28 36 L32 40 L36 36 Z" fill="#DAA520"/>
                      <text x="32" y="38" fontSize="18" fill="#DAA520" textAnchor="middle" fontWeight="bold" fontFamily="Arial">₩</text>
                    </svg>
                    <span className="text-xs text-white">{pkg.label}</span>
                  </>
                ) : (
                  <>
                    <svg width="24" height="24" viewBox="0 0 64 64" fill="none" className="mb-1">
                      <circle cx="32" cy="32" r="30" fill="#F4C542"/>
                      <circle cx="32" cy="32" r="26" fill="#FFD700"/>
                      <circle cx="32" cy="32" r="22" fill="#F4C542"/>
                      <ellipse cx="24" cy="24" rx="8" ry="6" fill="#FFE55C" opacity="0.6"/>
                      <path d="M32 20 L28 28 L32 24 L36 28 Z M32 44 L28 36 L32 40 L36 36 Z" fill="#DAA520"/>
                      <text x="32" y="38" fontSize="18" fill="#DAA520" textAnchor="middle" fontWeight="bold" fontFamily="Arial">₩</text>
                    </svg>
                    <span className="text-sm font-semibold text-white">{pkg.label}</span>
                    <span className="text-xs text-gray-400">{pkg.price.toLocaleString()}원</span>
                  </>
                )}
              </button>
            ))}
          </div>

          {/* Info Messages */}
          <div className="space-y-2 mb-6">
            <p className="text-xs text-gray-400">
              • 하드는 최소 100개 이상부터 충전 및 선물이 가능합니다.
            </p>
            <p className="text-xs text-gray-400">
              • 하드 상품은 결제 후 7일 이내 미사용 시 취소/환불이 가능합니다.
            </p>
            <p className="text-xs text-gray-400">
              • 단, 상품 내용이 표시·광고 내용과 다르거나 계약내용과 다르게 이행된 경우는 3개월 이내, 그 사실을 알았거나 알 수 있었던 날로부터 30일 이내 신청 가능합니다.
            </p>
          </div>

          {/* Coin Input */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm text-gray-300">하드개수입력</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={selectedPackage === 'custom' ? customAmount : getSelectedCoins()}
                  onChange={handleCustomAmountChange}
                  disabled={selectedPackage !== 'custom'}
                  className="bg-[#3a3a3a] text-white px-3 py-1 rounded text-sm w-24 text-right disabled:opacity-50"
                  min="100"
                />
                <svg width="18" height="18" viewBox="0 0 64 64" fill="none">
                  <circle cx="32" cy="32" r="30" fill="#F4C542"/>
                  <circle cx="32" cy="32" r="26" fill="#FFD700"/>
                  <circle cx="32" cy="32" r="22" fill="#F4C542"/>
                  <ellipse cx="24" cy="24" rx="8" ry="6" fill="#FFE55C" opacity="0.6"/>
                  <path d="M32 20 L28 28 L32 24 L36 28 Z M32 44 L28 36 L32 40 L36 36 Z" fill="#DAA520"/>
                  <text x="32" y="38" fontSize="18" fill="#DAA520" textAnchor="middle" fontWeight="bold" fontFamily="Arial">₩</text>
                </svg>
                <span className="text-sm text-white">개</span>
              </div>
            </div>
          </div>

          {/* Total Price */}
          <div className="border-t border-[#3a3a3a] pt-4 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-lg font-bold text-accent">결제예정금액</span>
                <span className="text-xs text-gray-400 ml-2">(vat 포함)</span>
              </div>
              <span className="text-xl font-bold text-accent">
                {getSelectedPrice().toLocaleString()}원
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleGift}
              className="flex-1 py-3 rounded-lg bg-gray-600 hover:bg-gray-500 text-white font-medium transition-colors"
            >
              선물하기
            </button>
            <button
              onClick={handlePurchase}
              className="flex-1 py-3 rounded-lg bg-accent hover:bg-accent-light text-white font-medium transition-colors"
            >
              구매하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoinShopModal;
