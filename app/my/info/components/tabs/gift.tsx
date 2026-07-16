'use client'
import React, { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { getMyCoinTopups, getMyRefundRequests, createTopupRefundRequest } from '@/app/_apis/coin-topup';
import { CoinTopup, MyRefundRequest, RefundRequest } from '@/app/_types/coin-topup';
import { useUserStore } from '@/app/_lib/stores';
import HistoryTableSkeleton from './HistoryTableSkeleton';
import RefundRequestList from './gift_tabs_component/RefundRequestList';

const WITHDRAWAL_PERIOD_MS = 7 * 24 * 60 * 60 * 1000;
const KST_OFFSET_MS = 9 * 60 * 60 * 1000;
const USER_REASON_MAX_LENGTH = 500;

type GiftView = 'topups' | 'refunds';

/**
 * 청약철회 기간(결제일로부터 7일) 이내인지 판정.
 * 서버 topped_up_at은 KST 벽시계 값이 타임존 정보 없이 직렬화되므로 현재 시각에 +9시간 보정.
 * 정확한 판정은 서버가 하므로 이 값은 버튼 노출용.
 */
const isWithinWithdrawalPeriod = (toppedUpAt: string): boolean => {
    const kstNow = Date.now() + KST_OFFSET_MS;
    return kstNow <= new Date(toppedUpAt).getTime() + WITHDRAWAL_PERIOD_MS;
};

/** 환불 예상액 — 보너스 코인은 무상 지급분이라 실결제액을 초과할 수 없음 */
const estimateRefundAmount = (topup: CoinTopup): number => {
    return Math.min(Math.floor(topup.remaining_coins * topup.coin_unit_price), topup.paid_amount);
};

export default function GiftTab() {
    const coinBalance = useUserStore((state) => state.coin.balance);
    const fetchUser = useUserStore((state) => state.fetchUser);
    const [view, setView] = useState<GiftView>('topups');
    const [allTopups, setAllTopups] = useState<CoinTopup[]>([]);
    const [refundRequests, setRefundRequests] = useState<MyRefundRequest[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // 환불 요청 모달 상태 — 접수 후 관리자 승인 시 실제 환불
    const [refundTarget, setRefundTarget] = useState<CoinTopup | null>(null);
    const [refundReason, setRefundReason] = useState<string>('');
    const [refunding, setRefunding] = useState<boolean>(false);
    const [refundError, setRefundError] = useState<string | null>(null);
    const [refundResult, setRefundResult] = useState<RefundRequest | null>(null);

    const itemsPerPage = 10;

    const fetchHistories = useCallback(async () => {
        try {
            setLoading(true);
            const [topupsResponse, requestsResponse] = await Promise.all([
                getMyCoinTopups(50),
                getMyRefundRequests(50),
            ]);
            setAllTopups(topupsResponse.data.topups);
            setRefundRequests(requestsResponse.data.requests);
        } catch (err: unknown) {
            console.error('Failed to fetch coin topups:', err);
            setError('코인 구매 내역을 불러오는데 실패했습니다.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchHistories();
        fetchUser(); // 보유 코인 잔액을 최신 상태로 갱신
    }, [fetchHistories, fetchUser]);

    // 환불 요청 중(REFUND_REQUESTED)인 충전분의 잔여 코인 — 잔액에는 포함되지만 사용은 불가
    const lockedCoins = allTopups
        .filter((topup) => topup.status === 'REFUND_REQUESTED')
        .reduce((sum, topup) => sum + topup.remaining_coins, 0);
    const usableCoins = Math.max(0, coinBalance - lockedCoins);

    // 페이지네이션 계산
    const totalPages = Math.ceil(allTopups.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentTopups = allTopups.slice(startIndex, endIndex);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const openRefundModal = (topup: CoinTopup) => {
        setRefundError(null);
        setRefundResult(null);
        setRefundReason('');
        setRefundTarget(topup);
    };

    const closeRefundModal = () => {
        if (refunding) return;
        setRefundTarget(null);
        setRefundError(null);
        setRefundResult(null);
        setRefundReason('');
    };

    // 환불 요청 접수 — 즉시 환불이 아니며, 접수 시 해당 충전분 코인은 사용 불가 상태가 됨
    const handleRefundRequest = async () => {
        if (!refundTarget || refunding) return;
        try {
            setRefunding(true);
            setRefundError(null);
            const response = await createTopupRefundRequest(refundTarget.id, refundReason.trim() || undefined);
            setRefundResult(response.data);
            await fetchHistories();
        } catch (err: unknown) {
            const message = (err as { response?: { data?: { message?: string | string[] } } })?.response?.data?.message;
            setRefundError(
                (Array.isArray(message) ? message.join('\n') : message) || '환불 요청에 실패했습니다.'
            );
        } finally {
            setRefunding(false);
        }
    };

    const formatDate = (dateString: string): string => {
        const date = new Date(dateString);
        return date.toLocaleString('ko-KR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const formatAmount = (amount: number): string => {
        return amount.toLocaleString('ko-KR');
    };

    const getStatusText = (status: string): string => {
        switch (status) {
            case 'COMPLETED':
                return '완료';
            case 'PENDING':
                return '대기중';
            case 'FAILED':
                return '실패';
            case 'REFUNDED':
                return '환불';
            case 'REFUND_REQUESTED':
                return '환불 처리 중';
            case 'FROZEN':
                return '동결';
            default:
                return status;
        }
    };

    const getStatusColor = (status: string): string => {
        switch (status) {
            case 'COMPLETED':
                return 'text-success-dark';
            case 'PENDING':
                return 'text-warning-dark';
            case 'FAILED':
                return 'text-error-dark';
            case 'REFUNDED':
                return 'text-text-secondary';
            case 'REFUND_REQUESTED':
                return 'text-warning-dark';
            case 'FROZEN':
                return 'text-accent';
            default:
                return 'text-text-secondary';
        }
    };

    // 환불 요청 버튼/안내 셀 — 완료·잔여 코인 있음·7일 이내일 때만 버튼 노출
    const renderRefundCell = (topup: CoinTopup): React.ReactNode => {
        if (topup.status === 'REFUND_REQUESTED') {
            return (
                <span className="text-xs text-warning-dark">
                    환불 처리 중
                </span>
            );
        }
        const refundable = topup.status === 'COMPLETED' && topup.remaining_coins > 0;
        if (!refundable) {
            return <span className="text-text-secondary">-</span>;
        }
        if (!isWithinWithdrawalPeriod(topup.topped_up_at)) {
            return (
                <span className="text-xs text-text-secondary">
                    환불은 고객센터로<br />문의해주세요
                </span>
            );
        }
        return (
            <button
                onClick={() => openRefundModal(topup)}
                className="px-3 py-1.5 text-xs rounded border border-border-primary text-text-primary hover:bg-bg-secondary hover:border-accent transition-colors"
            >
                환불 요청
            </button>
        );
    };

    if (loading) {
        return <HistoryTableSkeleton title="코인 구매 내역" columnAlignments={['left', 'left', 'center', 'center', 'right', 'center', 'center']} />;
    }

    if (error) {
        return (
            <div className="flex flex-col w-full h-full items-center justify-center">
                <p className="text-error-dark">{error}</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col w-full h-full p-6">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-text-primary">
                    {view === 'topups' ? '코인 구매 내역' : '환불 요청 내역'}
                </h2>
                {/* 구매 내역 / 환불 요청 서브탭 */}
                <div className="flex rounded-lg border border-border-primary overflow-hidden text-sm">
                    <button
                        onClick={() => setView('topups')}
                        className={`px-4 py-2 transition-colors ${
                            view === 'topups'
                                ? 'bg-accent text-white font-semibold'
                                : 'text-text-secondary hover:bg-bg-secondary'
                        }`}
                    >
                        구매 내역
                    </button>
                    <button
                        onClick={() => setView('refunds')}
                        className={`px-4 py-2 transition-colors ${
                            view === 'refunds'
                                ? 'bg-accent text-white font-semibold'
                                : 'text-text-secondary hover:bg-bg-secondary'
                        }`}
                    >
                        환불 요청
                        {refundRequests.some((r) => r.status === 'PENDING') && (
                            <span className="ml-1.5 inline-block w-1.5 h-1.5 rounded-full bg-warning-dark align-middle" />
                        )}
                    </button>
                </div>
            </div>

            {/* 코인 잔액 요약 — 환불 요청 중인 충전분은 잔액에 포함되지만 사용 불가 */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
                <div className="rounded-lg border border-border-primary p-4">
                    <p className="text-xs text-text-secondary mb-1">보유 코인</p>
                    <p className="text-lg font-bold text-text-primary">{formatAmount(coinBalance)}개</p>
                </div>
                <div className="rounded-lg border border-border-primary p-4">
                    <p className="text-xs text-text-secondary mb-1">환불 요청 중 (사용 불가)</p>
                    <p className={`text-lg font-bold ${lockedCoins > 0 ? 'text-warning-dark' : 'text-text-secondary'}`}>
                        {formatAmount(lockedCoins)}개
                    </p>
                </div>
                <div className="rounded-lg border border-border-primary p-4">
                    <p className="text-xs text-text-secondary mb-1">사용 가능 코인</p>
                    <p className="text-lg font-bold text-accent">{formatAmount(usableCoins)}개</p>
                </div>
            </div>

            {view === 'refunds' ? (
                <RefundRequestList requests={refundRequests} onChanged={fetchHistories} />
            ) : allTopups.length === 0 ? (
                <div className="rounded-lg p-12 border border-border-primary">
                    <div className="flex flex-col items-center text-center">
                        <h3 className="text-lg font-medium mb-2 text-text-primary">코인 구매 내역이 없습니다</h3>
                        <p className="text-sm text-text-secondary">코인을 구매하시면 내역이 여기에 표시됩니다.</p>
                    </div>
                </div>
            ) : (
                <>
                    <div className="rounded-lg overflow-hidden border border-border-primary">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-bg-secondary">
                                    <tr>
                                        <th className="px-6 py-4 text-left font-medium text-sm text-text-primary">구매일시</th>
                                        <th className="px-6 py-4 text-left font-medium text-sm text-text-primary">상품명</th>
                                        <th className="px-6 py-4 text-center font-medium text-sm text-text-primary">코인</th>
                                        <th className="px-6 py-4 text-center font-medium text-sm text-text-primary">잔여 코인</th>
                                        <th className="px-6 py-4 text-right font-medium text-sm text-text-primary">결제금액</th>
                                        <th className="px-6 py-4 text-center font-medium text-sm text-text-primary">상태</th>
                                        <th className="px-6 py-4 text-center font-medium text-sm text-text-primary">청약철회</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-bg-primary">
                                    {currentTopups.map((topup: CoinTopup) => (
                                        <tr key={topup.id} className="border-t border-tableRowBorder">
                                            <td className="px-6 py-4 text-sm text-text-secondary">
                                                {formatDate(topup.topped_up_at)}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-text-primary">
                                                {topup.product_name}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-center font-semibold text-text-primary">
                                                {formatAmount(topup.total_coins)}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-center">
                                                <span className={topup.remaining_coins > 0 ? 'font-semibold text-text-primary' : 'text-text-secondary'}>
                                                    {formatAmount(topup.remaining_coins)}
                                                </span>
                                                {topup.refunded_coins > 0 && (
                                                    <p className="text-xs text-text-secondary">환불 {formatAmount(topup.refunded_coins)}</p>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-right text-text-secondary">
                                                {formatAmount(topup.paid_amount)}원
                                            </td>
                                            <td className={`px-6 py-4 text-sm text-center font-semibold ${getStatusColor(topup.status)}`}>
                                                {getStatusText(topup.status)}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-center">
                                                {renderRefundCell(topup)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <p className="mt-3 text-xs text-text-secondary">
                        미사용 코인은 결제일로부터 7일 이내 청약철회(환불)를 요청할 수 있으며, 승인 후 환불이 진행됩니다.
                        사용한 코인과 무상 지급된 보너스 코인은 환불 대상에서 제외됩니다.
                        환불 요청 중인 충전분의 코인은 승인·거절·취소 전까지 사용할 수 없어, 보유 잔액보다 사용 가능한 코인이 적을 수 있습니다.
                    </p>

                    {/* 페이지네이션 */}
                    {totalPages > 1 && (
                        <div className="flex justify-center items-center mt-6 gap-2">
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="px-4 py-2 rounded border border-border-primary text-text-primary disabled:opacity-50 disabled:cursor-not-allowed hover:bg-bg-secondary transition-colors"
                            >
                                이전
                            </button>

                            <div className="flex gap-1">
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                    <button
                                        key={page}
                                        onClick={() => handlePageChange(page)}
                                        className={`px-4 py-2 rounded border ${
                                            currentPage === page
                                                ? 'bg-accent text-white border-accent'
                                                : 'border-border-primary text-text-primary hover:bg-bg-secondary'
                                        } transition-colors`}
                                    >
                                        {page}
                                    </button>
                                ))}
                            </div>

                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="px-4 py-2 rounded border border-border-primary text-text-primary disabled:opacity-50 disabled:cursor-not-allowed hover:bg-bg-secondary transition-colors"
                            >
                                다음
                            </button>
                        </div>
                    )}
                </>
            )}

            {/* 환불 요청 확인/접수 결과 모달 */}
            {refundTarget && (
                <div
                    className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
                    onClick={closeRefundModal}
                >
                    <div
                        className="bg-bg-primary rounded-2xl border border-border-primary p-6 w-full max-w-sm mx-4 flex flex-col gap-4 shadow-xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {refundResult ? (
                            <>
                                <h3 className="text-lg font-bold text-text-primary">환불 요청 접수 완료</h3>
                                <div className="bg-bg-secondary rounded-xl p-4 flex flex-col gap-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-text-secondary">환불 대상 코인</span>
                                        <span className="font-semibold text-text-primary">{formatAmount(refundResult.remaining_coins)}개</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-text-secondary">예상 환불액</span>
                                        <span className="font-semibold text-text-primary">{formatAmount(refundResult.expected_amount)}원</span>
                                    </div>
                                </div>
                                <p className="text-xs text-text-secondary">
                                    승인 후 환불이 진행됩니다. 승인 전까지는 환불 요청 내역에서 취소할 수 있으며,
                                    해당 충전분의 코인은 처리 완료 전까지 사용할 수 없습니다.
                                </p>
                                <button
                                    onClick={closeRefundModal}
                                    className="w-full py-2.5 rounded-lg bg-accent hover:bg-accent-light text-white font-semibold transition-colors"
                                >
                                    확인
                                </button>
                            </>
                        ) : (
                            <>
                                <h3 className="text-lg font-bold text-text-primary">청약철회(환불) 요청</h3>
                                <div className="bg-bg-secondary rounded-xl p-4 flex flex-col gap-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-text-secondary">상품</span>
                                        <span className="font-medium text-text-primary">{refundTarget.product_name}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-text-secondary">잔여 코인</span>
                                        <span className="font-medium text-text-primary">{formatAmount(refundTarget.remaining_coins)}개</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-text-secondary">환불 예상액</span>
                                        <span className="font-bold text-text-primary">{formatAmount(estimateRefundAmount(refundTarget))}원</span>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label htmlFor="refund-reason" className="text-xs text-text-secondary">
                                        환불 사유 (선택)
                                    </label>
                                    <textarea
                                        id="refund-reason"
                                        value={refundReason}
                                        onChange={(e) => setRefundReason(e.target.value.slice(0, USER_REASON_MAX_LENGTH))}
                                        rows={2}
                                        maxLength={USER_REASON_MAX_LENGTH}
                                        placeholder="예: 단순 변심"
                                        className="w-full px-3 py-2 text-sm rounded-lg border border-border-primary bg-bg-primary text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-accent resize-none"
                                    />
                                </div>
                                <p className="text-xs text-text-secondary">
                                    요청 접수 후 승인되면 환불이 진행됩니다. 접수 중에는 해당 충전분의 코인을 사용할 수 없습니다.
                                    {refundTarget.remaining_coins < refundTarget.total_coins && (
                                        <> 사용한 코인을 제외한 잔여 코인만 환불됩니다.</>
                                    )}
                                </p>
                                {refundError && (
                                    <div className="flex flex-col gap-1">
                                        <p className="text-sm text-error-dark whitespace-pre-line">{refundError}</p>
                                        {refundError.includes('고객센터') && (
                                            <Link
                                                href="/my/inquiry"
                                                className="text-sm text-accent underline hover:text-accent-light transition-colors"
                                            >
                                                1:1 문의하러 가기
                                            </Link>
                                        )}
                                    </div>
                                )}
                                <div className="flex gap-2">
                                    <button
                                        onClick={closeRefundModal}
                                        disabled={refunding}
                                        className="flex-1 py-2.5 rounded-lg border border-border-primary text-text-primary hover:bg-bg-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        취소
                                    </button>
                                    <button
                                        onClick={handleRefundRequest}
                                        disabled={refunding}
                                        className="flex-1 py-2.5 rounded-lg bg-accent hover:bg-accent-light text-white font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {refunding ? '처리 중...' : '환불 요청'}
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
