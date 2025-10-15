'use client';

import React, { useState } from 'react';

interface HeartsPackage {
  id: string;
  hearts: number;
  price: number;
}

const HEARTS_PACKAGES: HeartsPackage[] = [
  { id: '100', hearts: 100, price: 11000 },
  { id: '300', hearts: 300, price: 33000 },
  { id: '500', hearts: 500, price: 55000 },
  { id: '1000', hearts: 1000, price: 110000 },
  { id: '2000', hearts: 2000, price: 220000 },
  { id: '3000', hearts: 3000, price: 330000 },
  { id: '4000', hearts: 4000, price: 440000 },
  { id: '5000', hearts: 5000, price: 550000 },
];

const TABS = [
  { id: 'charge', label: '벨 충전' },
  { id: 'management', label: '벨 관리권' },
  { id: 'coupon', label: '쿠폰' },
  { id: 'item', label: '아이템 구매' },
  { id: 'subscription', label: '구독권' },
];

export default function ChargePage() {
  const [activeTab, setActiveTab] = useState<string>('charge');
  const [customHearts, setCustomHearts] = useState<number>(0);
  const [customPrice, setCustomPrice] = useState<number>(0);

  const handlePurchase = (hearts: number, price: number) => {
    console.log(`구매: ${hearts}개 하트, ${price}원`);
    alert(`${hearts}개 하트를 ${price.toLocaleString()}원에 구매하시겠습니까?`);
  };

  const handleCustomPurchase = () => {
    if (customHearts > 0 && customPrice > 0) {
      handlePurchase(customHearts, customPrice);
    } else {
      alert('개수와 금액을 모두 입력해주세요.');
    }
  };

  return (
    <div className="min-h-screen bg-background dark:bg-background-dark pt-[80px] pb-12">
      <div className="max-w-7xl mx-auto px-6">
        {/* Tabs */}
        <div className="flex gap-8 mb-8 border-b border-border dark:border-border-dark">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-3 px-2 font-medium transition-colors ${
                activeTab === tab.id
                  ? 'text-yellow-500 border-b-2 border-yellow-500'
                  : 'text-muted-foreground dark:text-muted-foreground-dark hover:text-foreground dark:hover:text-foreground-dark'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Custom Input Section */}
        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-6 mb-8">
          <div className="flex items-center gap-4 max-w-4xl">
            <span className="text-foreground dark:text-foreground-dark font-medium whitespace-nowrap">
              벨 개수 입력
            </span>
            <input
              type="number"
              value={customHearts || ''}
              onChange={(e) => setCustomHearts(parseInt(e.target.value) || 0)}
              placeholder="0"
              className="flex-1 bg-white dark:bg-gray-900 border border-border dark:border-border-dark rounded px-4 py-2 text-foreground dark:text-foreground-dark focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
            <span className="text-muted-foreground dark:text-muted-foreground-dark">개</span>
            <input
              type="number"
              value={customPrice || ''}
              onChange={(e) => setCustomPrice(parseInt(e.target.value) || 0)}
              placeholder="0"
              className="flex-1 bg-white dark:bg-gray-900 border border-border dark:border-border-dark rounded px-4 py-2 text-foreground dark:text-foreground-dark focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
            <span className="text-muted-foreground dark:text-muted-foreground-dark">원</span>
            <button
              onClick={handleCustomPurchase}
              className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold px-8 py-2 rounded transition-colors whitespace-nowrap"
            >
              구매하기
            </button>
          </div>
        </div>

        {/* Package Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {HEARTS_PACKAGES.map((pkg) => (
            <div
              key={pkg.id}
              className="bg-white dark:bg-gray-800 rounded-2xl border border-border dark:border-border-dark p-6 flex flex-col items-center shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Icon */}
              <div className="w-32 h-32 bg-gray-900 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                  <circle cx="32" cy="32" r="28" fill="#F59E0B"/>
                  <circle cx="32" cy="32" r="24" fill="#FBBF24"/>
                  <circle cx="32" cy="32" r="20" fill="#F59E0B"/>
                  <path d="M32 16 L28 24 L32 20 L36 24 Z M32 48 L28 40 L32 44 L36 40 Z" fill="#D97706"/>
                  <ellipse cx="24" cy="24" rx="6" ry="4" fill="#FDE68A" opacity="0.5"/>
                </svg>
              </div>

              {/* Divider */}
              <div className="w-full border-t border-border dark:border-border-dark mb-4"></div>

              {/* Amount */}
              <div className="text-xl font-bold text-foreground dark:text-foreground-dark mb-2">
                벨 {pkg.hearts.toLocaleString()}개
              </div>

              {/* Price */}
              <div className="text-yellow-500 font-bold text-lg mb-4">
                {pkg.price.toLocaleString()} 원
              </div>

              {/* Purchase Button */}
              <button
                onClick={() => handlePurchase(pkg.hearts, pkg.price)}
                className="w-full bg-black dark:bg-white text-white dark:text-black font-bold py-3 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
              >
                구매하기
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
