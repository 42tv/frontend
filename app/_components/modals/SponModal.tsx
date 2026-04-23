'use client';

import React, { useState } from 'react';
import useUserStore from '@/app/_lib/stores/userStore';
import { createDonation } from '@/app/_apis/donation';
import { AxiosError } from 'axios';
import { showErrorNotification } from '@/app/_components/utils/overlay/notificationHelpers';

interface SponModalProps {
    closeModal?: () => void;
    streamerUserId?: string;
}

const SponModal: React.FC<SponModalProps> = ({ closeModal, streamerUserId }) => {
    const { coin, fetchUser } = useUserStore();
    const [coinAmount, setCoinAmount] = useState<string>('0');
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleCoinAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        // 숫자만 입력되도록 필터링
        if (/^\d*$/.test(value)) {
            setCoinAmount(value);
        }
    };

    const handleDonate = async () => {
        // 유효성 검사
        if (!streamerUserId) {
            showErrorNotification('스트리머 정보를 찾을 수 없습니다');
            return;
        }

        const amount = parseInt(coinAmount);

        if (isNaN(amount) || amount <= 0) {
            showErrorNotification('후원 금액은 0보다 커야 합니다');
            return;
        }

        if (coin && coin.balance < amount) {
            showErrorNotification('보유 코인이 부족합니다');
            return;
        }

        setIsLoading(true);

        try {
            // 후원 API 호출
            await createDonation({
                coin_amount: amount,
                streamer_user_id: streamerUserId,
            });

            // 사용자 정보 갱신 (코인 잔액 업데이트)
            await fetchUser();

            // 모달 닫기
            if (closeModal) {
                closeModal();
            }
        } catch (err) {
            console.error('Donation error:', err);

            if (err instanceof AxiosError) {
                const errorMessage = err.response?.data?.message || '후원 처리 중 오류가 발생했습니다';
                showErrorNotification(errorMessage);
            } else {
                showErrorNotification('후원 처리 중 오류가 발생했습니다');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-[#2a2a2a] rounded-lg w-[400px] overflow-hidden">
            {/* Header */}
            <div className="relative px-6 py-4 border-b border-[#3a3a3a]">
                <h2 className="text-lg font-semibold text-white">
                    후원
                </h2>
            </div>

            {/* Content */}
            <div className="p-6">
                {/* Image Grid Area - Empty for now */}
                <div className="grid grid-cols-3 gap-3 mb-6 min-h-[300px] bg-[#1a1a1a] rounded-lg p-4">
                    <div className="col-span-3 flex items-center justify-center text-gray-500">
                        {/* Placeholder for heart items */}
                    </div>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-center gap-2 mb-6">
                    <button className="text-gray-400 hover:text-white">
                        &lt;
                    </button>
                    <span className="text-sm text-white">
                        1 / 6
                    </span>
                    <button className="text-gray-400 hover:text-white">
                        &gt;
                    </button>
                </div>

                {/* Bottom Section - Coin Amount */}
                <div className="border-t border-[#3a3a3a] pt-4 mb-6">
                    <div className="bg-[#1a1a1a] rounded-lg p-4">
                        <div className="flex items-center justify-between text-sm text-white">
                            <span>코인</span>
                            <input
                                type="text"
                                value={coinAmount}
                                onChange={handleCoinAmountChange}
                                placeholder="0"
                                className="bg-[#3a3a3a] text-white px-3 py-1 rounded text-right w-24 border border-[#4a4a4a] focus:outline-none focus:border-blue-500"
                                disabled={isLoading}
                            />
                        </div>
                    </div>
                </div>

                {/* Coin Balance Display */}
                <div className="mb-4 p-4 bg-[#1a1a1a] rounded-lg">
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">보유 코인</span>
                        <span className="text-white font-semibold text-lg">
                            {coin?.balance?.toLocaleString() ?? 0} 코인
                        </span>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                    <button
                        className="flex-1 py-3 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={handleDonate}
                        disabled={isLoading || !streamerUserId}
                    >
                        {isLoading ? '처리 중...' : '선물하기'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SponModal;
