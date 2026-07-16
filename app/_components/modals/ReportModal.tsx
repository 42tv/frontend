'use client';

import React, { useState } from 'react';
import { AxiosError } from 'axios';
import { createReport } from '@/app/_apis/report';
import type { ReportTargetType } from '@/app/_types/admin-console';
import {
    showSuccessNotification,
    showErrorNotification,
} from '@/app/_components/utils/overlay/notificationHelpers';

/** 신고 사유 프리셋 */
const REPORT_REASONS: string[] = [
    '음란물/부적절한 콘텐츠',
    '불법 행위',
    '기타',
];

interface ReportModalProps {
    closeModal?: () => void;
    /** 피신고자 user_idx */
    reportedIdx: number;
    targetType: ReportTargetType;
    /** 대상 참조 (stream_id, 게시글 id 등) */
    targetRef?: string;
    /** 증거 (스트림 제목 등 부가 정보) */
    evidence?: Record<string, unknown>;
}

const ReportModal: React.FC<ReportModalProps> = ({
    closeModal,
    reportedIdx,
    targetType,
    targetRef,
    evidence,
}) => {
    const [selectedReason, setSelectedReason] = useState<string>('');
    const [detail, setDetail] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleSubmit = async () => {
        // 유효성 검사
        if (!selectedReason) {
            showErrorNotification('신고 사유를 선택해주세요');
            return;
        }

        if (selectedReason === '기타' && !detail.trim()) {
            showErrorNotification('기타 사유는 상세 내용을 입력해주세요');
            return;
        }

        // 사유 조합: 선택 사유 + 상세 내용
        const reason = detail.trim()
            ? `[${selectedReason}] ${detail.trim()}`
            : selectedReason;

        setIsLoading(true);

        try {
            await createReport({
                reportedIdx,
                targetType,
                targetRef,
                reason,
                evidence,
            });

            showSuccessNotification('신고가 접수되었습니다');

            if (closeModal) {
                closeModal();
            }
        } catch (err) {
            console.error('Report error:', err);

            if (err instanceof AxiosError) {
                const errorMessage = err.response?.data?.message || '신고 접수 중 오류가 발생했습니다';
                showErrorNotification(errorMessage);
            } else {
                showErrorNotification('신고 접수 중 오류가 발생했습니다');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-[#2a2a2a] rounded-lg w-[400px] overflow-hidden">
            {/* Content */}
            <div className="p-6">
                {/* 신고 사유 선택 */}
                <div className="mb-6">
                    <p className="text-sm text-gray-400 mb-3">신고 사유</p>
                    <div className="flex flex-col gap-2">
                        {REPORT_REASONS.map((reason: string) => (
                            <button
                                key={reason}
                                type="button"
                                className={`w-full px-4 py-3 rounded-lg text-left text-sm transition-colors border ${
                                    selectedReason === reason
                                        ? 'bg-blue-600/20 border-blue-500 text-white'
                                        : 'bg-[#1a1a1a] border-[#3a3a3a] text-gray-300 hover:border-[#4a4a4a]'
                                }`}
                                onClick={() => setSelectedReason(reason)}
                                disabled={isLoading}
                            >
                                {reason}
                            </button>
                        ))}
                    </div>
                </div>

                {/* 상세 내용 */}
                <div className="mb-6">
                    <p className="text-sm text-gray-400 mb-3">
                        상세 내용 {selectedReason === '기타' ? '(필수)' : '(선택)'}
                    </p>
                    <textarea
                        value={detail}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDetail(e.target.value)}
                        placeholder="신고 내용을 자세히 입력해주세요"
                        maxLength={500}
                        rows={4}
                        className="w-full bg-[#1a1a1a] text-white text-sm px-4 py-3 rounded-lg border border-[#3a3a3a] focus:outline-none focus:border-blue-500 resize-none placeholder:text-gray-500"
                        disabled={isLoading}
                    />
                    <p className="text-xs text-gray-500 text-right mt-1">
                        {detail.length}/500
                    </p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                    <button
                        type="button"
                        className="flex-1 py-3 rounded-lg bg-[#3a3a3a] text-gray-300 font-medium hover:bg-[#4a4a4a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={closeModal}
                        disabled={isLoading}
                    >
                        취소
                    </button>
                    <button
                        type="button"
                        className="flex-1 py-3 rounded-lg bg-red-600 text-white font-medium hover:bg-red-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={handleSubmit}
                        disabled={isLoading || !selectedReason}
                    >
                        {isLoading ? '접수 중...' : '신고하기'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ReportModal;
