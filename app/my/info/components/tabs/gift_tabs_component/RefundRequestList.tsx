'use client'
import React, { useState } from 'react';
import { cancelRefundRequest } from '@/app/_apis/coin-topup';
import { MyRefundRequest, RefundRequestStatus } from '@/app/_types/coin-topup';

interface RefundRequestListProps {
    requests: MyRefundRequest[];
    /** 취소 성공 후 목록/구매 내역 재조회 */
    onChanged: () => Promise<void> | void;
}

const statusLabels: Record<RefundRequestStatus, { label: string; className: string }> = {
    PENDING: { label: '처리 대기', className: 'text-warning-dark' },
    APPROVED: { label: '환불 완료', className: 'text-success-dark' },
    REJECTED: { label: '거절됨', className: 'text-error-dark' },
    CANCELED: { label: '취소됨', className: 'text-text-secondary' },
};

const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
    });
};

const formatAmount = (amount: number): string => amount.toLocaleString('ko-KR');

export default function RefundRequestList({ requests, onChanged }: RefundRequestListProps) {
    // 취소 확인 모달 상태
    const [cancelTarget, setCancelTarget] = useState<MyRefundRequest | null>(null);
    const [canceling, setCanceling] = useState<boolean>(false);
    const [cancelError, setCancelError] = useState<string | null>(null);

    const closeCancelModal = (): void => {
        if (canceling) return;
        setCancelTarget(null);
        setCancelError(null);
    };

    const handleCancel = async (): Promise<void> => {
        if (!cancelTarget || canceling) return;
        try {
            setCanceling(true);
            setCancelError(null);
            await cancelRefundRequest(cancelTarget.id);
            setCancelTarget(null);
            await onChanged();
        } catch (err: unknown) {
            const message = (err as { response?: { data?: { message?: string | string[] } } })?.response?.data?.message;
            setCancelError(
                (Array.isArray(message) ? message.join('\n') : message) || '환불 요청 취소에 실패했습니다.'
            );
        } finally {
            setCanceling(false);
        }
    };

    if (requests.length === 0) {
        return (
            <div className="rounded-lg p-12 border border-border-primary">
                <div className="flex flex-col items-center text-center">
                    <h3 className="text-lg font-medium mb-2 text-text-primary">환불 요청 내역이 없습니다</h3>
                    <p className="text-sm text-text-secondary">구매 내역에서 환불을 요청하시면 여기에 표시됩니다.</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="rounded-lg overflow-hidden border border-border-primary">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-bg-secondary">
                            <tr>
                                <th className="px-6 py-4 text-left font-medium text-sm text-text-primary">요청일시</th>
                                <th className="px-6 py-4 text-left font-medium text-sm text-text-primary">상품명</th>
                                <th className="px-6 py-4 text-center font-medium text-sm text-text-primary">환불 코인</th>
                                <th className="px-6 py-4 text-right font-medium text-sm text-text-primary">예상 환불액</th>
                                <th className="px-6 py-4 text-center font-medium text-sm text-text-primary">상태</th>
                                <th className="px-6 py-4 text-center font-medium text-sm text-text-primary">처리</th>
                            </tr>
                        </thead>
                        <tbody className="bg-bg-primary">
                            {requests.map((request: MyRefundRequest) => (
                                <tr key={request.id} className="border-t border-tableRowBorder">
                                    <td className="px-6 py-4 text-sm text-text-secondary">
                                        {formatDate(request.requested_at)}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-text-primary">
                                        {request.topup.product_name}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-center font-semibold text-text-primary">
                                        {formatAmount(request.remaining_coins)}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-right text-text-secondary">
                                        {formatAmount(request.expected_amount)}원
                                    </td>
                                    <td className="px-6 py-4 text-sm text-center">
                                        <span className={`font-semibold ${statusLabels[request.status].className}`}>
                                            {statusLabels[request.status].label}
                                        </span>
                                        {request.status === 'REJECTED' && request.reject_reason && (
                                            <p className="mt-1 text-xs text-text-secondary whitespace-pre-line">
                                                사유: {request.reject_reason}
                                            </p>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-center">
                                        {request.status === 'PENDING' ? (
                                            <button
                                                onClick={() => setCancelTarget(request)}
                                                className="px-3 py-1.5 text-xs rounded border border-border-primary text-text-primary hover:bg-bg-secondary hover:border-accent transition-colors"
                                            >
                                                요청 취소
                                            </button>
                                        ) : (
                                            <span className="text-xs text-text-secondary">
                                                {request.processed_at ? formatDate(request.processed_at) : '-'}
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <p className="mt-3 text-xs text-text-secondary">
                처리 대기 중인 요청은 승인 전까지 취소할 수 있으며, 해당 충전분의 코인은 승인·거절·취소 전까지 사용할 수 없습니다.
            </p>

            {/* 환불 요청 취소 확인 모달 */}
            {cancelTarget && (
                <div
                    className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
                    onClick={closeCancelModal}
                >
                    <div
                        className="bg-bg-primary rounded-2xl border border-border-primary p-6 w-full max-w-sm mx-4 flex flex-col gap-4 shadow-xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3 className="text-lg font-bold text-text-primary">환불 요청 취소</h3>
                        <div className="bg-bg-secondary rounded-xl p-4 flex flex-col gap-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-text-secondary">상품</span>
                                <span className="font-medium text-text-primary">{cancelTarget.topup.product_name}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-text-secondary">환불 코인</span>
                                <span className="font-medium text-text-primary">{formatAmount(cancelTarget.remaining_coins)}개</span>
                            </div>
                        </div>
                        <p className="text-xs text-text-secondary">
                            요청을 취소하면 해당 충전분의 코인을 다시 사용할 수 있습니다.
                        </p>
                        {cancelError && (
                            <p className="text-sm text-error-dark whitespace-pre-line">{cancelError}</p>
                        )}
                        <div className="flex gap-2">
                            <button
                                onClick={closeCancelModal}
                                disabled={canceling}
                                className="flex-1 py-2.5 rounded-lg border border-border-primary text-text-primary hover:bg-bg-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                닫기
                            </button>
                            <button
                                onClick={handleCancel}
                                disabled={canceling}
                                className="flex-1 py-2.5 rounded-lg bg-accent hover:bg-accent-light text-white font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {canceling ? '처리 중...' : '요청 취소'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
