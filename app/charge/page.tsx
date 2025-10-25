'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { getActiveProducts, purchaseProduct } from '../_apis/product';
import { Product } from '../_types/product';
import { PaymentGatewayService } from '../_services/payment-gateway.service';

const TABS = [
  { id: 'charge', label: '코인 충전' },
];

export default function ChargePage() {
  const [activeTab, setActiveTab] = useState<string>('charge');
  const [customCoins, setCustomCoins] = useState<number>(0);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [purchasing, setPurchasing] = useState<boolean>(false);
  const [selectedPg, setSelectedPg] = useState<'mock' | 'toss' | 'inicis' | 'kakaopay'>('mock');

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

  const handlePurchase = async (productId: number, coins: number, price: number) => {
    if (purchasing) return;

    const confirmed = window.confirm(
      `${coins}개 코인을 ${price.toLocaleString()}원에 구매하시겠습니까?`
    );

    if (!confirmed) return;

    try {
      setPurchasing(true);

      // 1. 백엔드에 결제 준비 요청 (PG사 선택 포함)
      const result = await purchaseProduct(productId, selectedPg);

      // 2-1. Mock 결제인 경우: 이미 완료됨
      if (result.success && result.data.topup) {
        alert(
          `충전 완료!\n${result.data.product.total_coins}개의 코인이 충전되었습니다.\n현재 잔액: ${result.data.wallet.coin_balance}개`
        );
        setCustomCoins(0);
        return;
      }

      // 2-2. Real PG인 경우: 결제 창 호출
      if (result.data.pg_transaction_id) {
        try {
          const paymentResult = await PaymentGatewayService.requestPayment({
            pg_provider: result.data.pg_provider || 'mock',
            pg_transaction_id: result.data.pg_transaction_id,
            amount: price,
            product_name: `${coins}개 코인`,
            redirect_url: result.data.redirect_url,
            app_scheme: result.data.app_scheme,
            pg_data: result.data.pg_data,
          });

          if (paymentResult.success) {
            alert('결제가 완료되었습니다!\n잠시 후 코인이 충전됩니다.');
            setCustomCoins(0);
            // TODO: 잔액 새로고침 또는 페이지 리로드
            window.location.reload();
          } else {
            alert(`결제 실패: ${paymentResult.error || '알 수 없는 오류'}`);
          }
        } catch (pgError) {
          console.error('PG 결제 실패:', pgError);
          alert(
            pgError instanceof Error
              ? pgError.message
              : '결제 모듈 연동 중 오류가 발생했습니다.'
          );
        }
        return;
      }

      // 예상치 못한 응답
      alert('충전에 실패했습니다. 다시 시도해주세요.');
    } catch (error: unknown) {
      console.error('구매 실패:', error);
      const errorMessage =
        (error as { response?: { data?: { message?: string } } }).response?.data?.message ||
        '충전 중 오류가 발생했습니다.';
      alert(errorMessage);
    } finally {
      setPurchasing(false);
    }
  };

  const handleCustomPurchase = () => {
    // 커스텀 구매는 현재 지원하지 않음 (패키지 상품만 가능)
    alert('패키지 상품 구매만 지원됩니다. 아래 상품 중 하나를 선택해주세요.');
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

        {/* PG사 선택 */}
        <div className="bg-card dark:bg-card-dark rounded-xl border border-border dark:border-border-dark p-6 mb-8 shadow-sm">
          <h3 className="text-foreground dark:text-foreground-dark font-medium mb-4">결제 수단 선택</h3>
          <div className="flex gap-4">
            <button
              onClick={() => setSelectedPg('mock')}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                selectedPg === 'mock'
                  ? 'bg-yellow-400 text-black'
                  : 'bg-background dark:bg-background-dark text-foreground dark:text-foreground-dark border border-border dark:border-border-dark hover:border-yellow-500'
              }`}
            >
              테스트 결제 (Mock)
            </button>
            <button
              onClick={() => setSelectedPg('toss')}
              disabled
              className="px-6 py-2 rounded-lg font-medium bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed"
              title="토스페이먼츠 준비 중"
            >
              토스페이먼츠 (준비중)
            </button>
            <button
              onClick={() => setSelectedPg('inicis')}
              disabled
              className="px-6 py-2 rounded-lg font-medium bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed"
              title="이니시스 준비 중"
            >
              이니시스 (준비중)
            </button>
            <button
              onClick={() => setSelectedPg('kakaopay')}
              disabled
              className="px-6 py-2 rounded-lg font-medium bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed"
              title="카카오페이 준비 중"
            >
              카카오페이 (준비중)
            </button>
          </div>
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

                  {/* Name or Amount */}
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
                    onClick={() => handlePurchase(product.id, totalCoins, product.price)}
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
