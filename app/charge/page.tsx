'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Bootpay } from '@bootpay/client-js';
import { getActiveProducts, preparePayment } from '../_apis/product';
import { Product, RealPGPurchaseData } from '../_types/product';
import { useBootpayStyles } from '../_hooks/useBootpayStyles';

export default function ChargePage() {
  useBootpayStyles();

  const [customCoins, setCustomCoins] = useState<number>(0);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [purchasing, setPurchasing] = useState<boolean>(false);

  // 1코인 = 100원 + 부가세 10% = 110원
  const COIN_PRICE_WITH_VAT = 110;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await getActiveProducts();
        setProducts(response.data);
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
    if (value === '') {
      setCustomCoins(0);
      return;
    }

    if (!/^\d+$/.test(value)) {
      return;
    }

    const coins = parseInt(value, 10);
    if (coins >= 0) {
      setCustomCoins(coins);
    }
  };

  const handlePurchase = async (productId: number) => {
    if (purchasing) return;

    try {
      setPurchasing(true);

      const prepareResponse = await preparePayment(productId, 'bootpay');
      const prepareData = prepareResponse.data.data as RealPGPurchaseData;

      if (!prepareData.pg_data || !prepareData.product) {
        alert('결제 준비 데이터를 받지 못했습니다.');
        setPurchasing(false);
        return;
      }

      const pgData = prepareData.pg_data;
      const productData = prepareData.product;

      Bootpay.requestPayment({
        application_id: pgData.application_id,
        price: pgData.price,
        order_name: pgData.order_name,
        order_id: pgData.order_id,
        tax_free: 0,
        user: {
          id: pgData.user.id,
          username: pgData.user.username,
          email: pgData.user.email,
          phone: pgData.user.phone || '010-0000-0000',
        },
        items: [
          {
            id: productData.id.toString(),
            name: productData.name,
            qty: 1,
            price: productData.price,
          },
        ],
        extra: {
          open_type: 'iframe',
          escrow: false,
          show_close_button: true,
          card_quota: '0,2,3',
          display_success_result: true,
        },
      })
        .then((response: unknown) => {
          console.log('Bootpay 결제 응답:', response);
          alert('결제가 완료되었습니다!\n잠시 후 코인이 충전됩니다.');
          setPurchasing(false);
          window.location.reload();
        })
        .catch((error: unknown) => {
          console.error('Bootpay 에러 원본:', error);
          setPurchasing(false);
          const bootpayError = error as { event?: string; error_code?: string; message?: string };
          if (bootpayError?.event === 'cancel') {
            alert('결제가 취소되었습니다.');
          } else if (bootpayError?.event === 'error') {
            alert(`결제 오류가 발생했습니다.\n${bootpayError.message ?? ''}`);
          } else {
            alert('결제가 취소되었습니다.');
          }
        });

    } catch (error: unknown) {
      setPurchasing(false);
      console.error('구매 실패:', error);
      const errorMessage =
        (error as { response?: { data?: { message?: string } } }).response?.data?.message ||
        '충전 중 오류가 발생했습니다.';
      alert(errorMessage);
    }
  };

  const handleCustomPurchase = () => {
    alert('패키지 상품 구매만 지원됩니다. 아래 상품 중 하나를 선택해주세요.');
  };

  return (
    <div className="min-h-screen bg-background dark:bg-background-dark pt-[20px] pb-12">
      <div className="max-w-7xl mx-auto px-6">
        {/* Tab */}
        <div className="flex gap-8 mb-8 border-b border-border dark:border-border-dark">
          <button className="pb-3 px-2 font-medium text-yellow-500 border-b-2 border-yellow-500">
            코인 충전
          </button>
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
                  className="w-64 bg-card dark:bg-card-dark rounded-2xl border border-border dark:border-border-dark px-4 py-3 flex flex-col items-center shadow-sm hover:shadow-md transition-all hover:border-yellow-500/50"
                >
                  {/* Icon or Image */}
                  <div className="w-24 h-24 bg-background dark:bg-background-dark rounded-full flex items-center justify-center mb-2 border-2 border-border dark:border-border-dark overflow-hidden">
                    {product.image_url ? (
                      <Image
                        src={product.image_url}
                        alt={product.name}
                        width={96}
                        height={96}
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
                  <div className="w-full border-t border-border dark:border-border-dark mb-2"></div>

                  {/* Name */}
                  <div className="text-lg font-bold text-foreground dark:text-foreground-dark mb-0.5 text-center">
                    {product.name}
                  </div>

                  {/* Coin Details */}
                  <div className="text-sm text-muted-foreground dark:text-muted-foreground-dark mb-0.5">
                    기본 {product.base_coins.toLocaleString()}개
                    {product.bonus_coins > 0 && (
                      <span className="text-yellow-500 ml-1">
                        + 보너스 {product.bonus_coins.toLocaleString()}개
                      </span>
                    )}
                  </div>

                  {/* Total Coins */}
                  <div className="text-base font-semibold text-foreground dark:text-foreground-dark mb-0.5">
                    총 {totalCoins.toLocaleString()}개
                  </div>

                  {/* Price */}
                  <div className="text-yellow-500 font-bold text-base mb-2">
                    {product.price.toLocaleString()} 원
                  </div>

                  {/* Purchase Button */}
                  <button
                    onClick={() => handlePurchase(product.id)}
                    disabled={purchasing}
                    className={`w-full font-bold py-1.5 rounded-lg transition-colors shadow-sm hover:shadow-md ${
                      purchasing
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-yellow-400 hover:bg-yellow-500 text-black'
                    }`}
                  >
                    {purchasing ? '처리 중...' : '구매하기'}
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
