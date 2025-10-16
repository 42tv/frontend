'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { getActiveProducts } from '../_apis/product';
import { Product } from '../_types/product';

const TABS = [
  { id: 'charge', label: '코인 충전' },
];

export default function ChargePage() {
  const [activeTab, setActiveTab] = useState<string>('charge');
  const [customCoins, setCustomCoins] = useState<number>(0);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // 1코인 = 100원 + 부가세 10% = 110원
  const COIN_PRICE_WITH_VAT = 110;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await getActiveProducts();
        setProducts(data.products);
      } catch (error) {
        console.error('상품 목록 조회 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const calculatePrice = (coins: number): number => {
    return coins * COIN_PRICE_WITH_VAT;
  };

  const handleCoinsChange = (value: string) => {
    // 빈 문자열이면 0으로 설정
    if (value === '') {
      setCustomCoins(0);
      return;
    }

    // 숫자만 허용
    if (!/^\d+$/.test(value)) {
      return;
    }

    const coins = parseInt(value, 10);
    // 양수만 허용
    if (coins >= 0) {
      setCustomCoins(coins);
    }
  };

  const handlePurchase = (coins: number, price: number) => {
    console.log(`구매: ${coins}개 코인, ${price}원`);
    alert(`${coins}개 코인을 ${price.toLocaleString()}원에 구매하시겠습니까?`);
  };

  const handleCustomPurchase = () => {
    if (customCoins > 0) {
      const price = calculatePrice(customCoins);
      handlePurchase(customCoins, price);
    } else {
      alert('코인 개수를 입력해주세요.');
    }
  };

  return (
    <div className="min-h-screen bg-background dark:bg-background-dark pt-[20px] pb-12">
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
        <div className="bg-card dark:bg-card-dark rounded-xl border border-border dark:border-border-dark p-6 mb-8 shadow-sm">
          <div className="flex items-center gap-4 max-w-4xl">
            <span className="text-foreground dark:text-foreground-dark font-medium whitespace-nowrap">
              코인 개수 입력
            </span>
            <input
              type="text"
              value={customCoins === 0 ? '' : customCoins}
              onChange={(e) => handleCoinsChange(e.target.value)}
              placeholder="0"
              className="flex-1 bg-background dark:bg-background-dark border border-border dark:border-border-dark rounded px-4 py-2 text-foreground dark:text-foreground-dark focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
            <span className="text-muted-foreground dark:text-muted-foreground-dark">개</span>
            <input
              type="text"
              value={calculatePrice(customCoins).toLocaleString()}
              readOnly
              placeholder="0"
              className="flex-1 bg-background dark:bg-background-dark border border-border dark:border-border-dark rounded px-4 py-2 text-foreground dark:text-foreground-dark cursor-default opacity-75"
            />
            <span className="text-muted-foreground dark:text-muted-foreground-dark">원</span>
            <button
              onClick={handleCustomPurchase}
              className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold px-8 py-2 rounded transition-colors whitespace-nowrap shadow-sm hover:shadow-md"
            >
              구매하기
            </button>
          </div>
        </div>

        {/* Package Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="text-muted-foreground dark:text-muted-foreground-dark">
              로딩 중...
            </div>
          </div>
        ) : products.length === 0 ? (
          <div className="flex justify-center items-center py-20">
            <div className="text-muted-foreground dark:text-muted-foreground-dark">
              등록된 상품이 없습니다.
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => {
              const totalCoins = product.base_coins + product.bonus_coins;
              return (
                <div
                  key={product.id}
                  className="bg-card dark:bg-card-dark rounded-2xl border border-border dark:border-border-dark p-6 flex flex-col items-center shadow-sm hover:shadow-md transition-all hover:border-yellow-500/50"
                >
                  {/* Icon or Image */}
                  <div className="w-32 h-32 bg-background dark:bg-background-dark rounded-full flex items-center justify-center mb-4 border-2 border-border dark:border-border-dark overflow-hidden">
                    {product.image_url ? (
                      <Image
                        src={product.image_url}
                        alt={product.name}
                        width={128}
                        height={128}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                        <circle cx="32" cy="32" r="28" fill="#F59E0B"/>
                        <circle cx="32" cy="32" r="24" fill="#FBBF24"/>
                        <circle cx="32" cy="32" r="20" fill="#F59E0B"/>
                        <path d="M32 16 L28 24 L32 20 L36 24 Z M32 48 L28 40 L32 44 L36 40 Z" fill="#D97706"/>
                        <ellipse cx="24" cy="24" rx="6" ry="4" fill="#FDE68A" opacity="0.5"/>
                      </svg>
                    )}
                  </div>

                  {/* Divider */}
                  <div className="w-full border-t border-border dark:border-border-dark mb-4"></div>

                  {/* Name or Amount */}
                  <div className="text-xl font-bold text-foreground dark:text-foreground-dark mb-2 text-center">
                    {product.name}
                  </div>

                  {/* Coin Details */}
                  <div className="text-sm text-muted-foreground dark:text-muted-foreground-dark mb-2">
                    기본 {product.base_coins.toLocaleString()}개
                    {product.bonus_coins > 0 && (
                      <span className="text-yellow-500 ml-1">
                        + 보너스 {product.bonus_coins.toLocaleString()}개
                      </span>
                    )}
                  </div>

                  {/* Total Coins */}
                  <div className="text-lg font-semibold text-foreground dark:text-foreground-dark mb-2">
                    총 {totalCoins.toLocaleString()}개
                  </div>

                  {/* Price */}
                  <div className="text-yellow-500 font-bold text-lg mb-4">
                    {product.price.toLocaleString()} 원
                  </div>

                  {/* Purchase Button */}
                  <button
                    onClick={() => handlePurchase(totalCoins, product.price)}
                    className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 rounded-lg transition-colors shadow-sm hover:shadow-md"
                  >
                    구매하기
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
