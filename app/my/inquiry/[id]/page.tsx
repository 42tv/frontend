'use client'
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import MyLayOut from '@/app/my/info/components/layout';
import { getInquiry } from '@/app/_apis/inquiry';
import { notifyUnreadInquiryRefresh } from '@/app/_hooks/useUnreadInquiry';
import { getFileNameFromUrl } from '@/app/_lib/utils';
import type { Inquiry } from '@/app/_types/inquiry';
import { inquiryStatusLabels, inquiryTypeLabels } from '@/app/_types/inquiry';

export default function InquiryDetailPage() {
    const router = useRouter();
    const params = useParams<{ id: string }>();
    const inquiryId = Number(params.id);

    const [inquiry, setInquiry] = useState<Inquiry | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (Number.isNaN(inquiryId)) {
            setError('잘못된 접근입니다.');
            setLoading(false);
            return;
        }
        const fetchInquiry = async (): Promise<void> => {
            try {
                setLoading(true);
                // 답변이 있으면 백엔드가 이 조회 시점에 읽음 처리한다
                const data = await getInquiry(inquiryId);
                setInquiry(data);
                if (data.status === 'ANSWERED') {
                    notifyUnreadInquiryRefresh(); // 읽음 처리 반영해 뱃지 즉시 갱신
                }
            } catch (err: unknown) {
                console.error('Failed to fetch inquiry:', err);
                const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
                setError(message || '문의를 불러오는데 실패했습니다.');
            } finally {
                setLoading(false);
            }
        };
        fetchInquiry();
    }, [inquiryId]);

    const formatDate = (dateString: string): string => {
        return new Date(dateString).toLocaleString('ko-KR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <MyLayOut>
            <div className="flex flex-col w-full h-full p-6 max-w-3xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-text-primary">문의 상세</h2>
                    <button
                        onClick={() => router.push('/my/inquiry')}
                        className="px-4 py-2 text-sm rounded-lg border border-border-primary text-text-secondary hover:bg-bg-tertiary transition-colors"
                    >
                        목록으로
                    </button>
                </div>

                {loading && (
                    <div className="flex items-center justify-center py-16">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-accent" />
                    </div>
                )}

                {!loading && error && (
                    <div className="flex flex-col items-center justify-center py-16">
                        <p className="text-error-dark">{error}</p>
                    </div>
                )}

                {!loading && !error && inquiry && (
                    <div className="flex flex-col gap-6">
                        {/* 문의 정보 */}
                        <div className="rounded-lg border border-border-primary p-5">
                            <div className="flex items-center gap-2 mb-3">
                                <span className="px-2 py-0.5 text-xs rounded-full bg-bg-tertiary text-text-secondary">
                                    {inquiryTypeLabels[inquiry.type]}
                                </span>
                                <span
                                    className={`px-2 py-0.5 text-xs rounded-full ${
                                        inquiry.status === 'ANSWERED'
                                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                            : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                                    }`}
                                >
                                    {inquiryStatusLabels[inquiry.status]}
                                </span>
                                <span className="ml-auto text-xs text-text-secondary">{formatDate(inquiry.created_at)}</span>
                            </div>
                            <h3 className="text-lg font-semibold text-text-primary mb-3">{inquiry.title}</h3>
                            <p className="text-sm text-text-primary whitespace-pre-wrap">{inquiry.content}</p>

                            {inquiry.images.length > 0 && (
                                <div className="flex flex-col gap-1.5 mt-4">
                                    {inquiry.images.map((image) => (
                                        <a
                                            key={image.id}
                                            href={image.image_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1.5 text-sm text-accent hover:underline w-fit"
                                        >
                                            <span aria-hidden>📎</span>
                                            <span className="break-all">{getFileNameFromUrl(image.image_url)}</span>
                                        </a>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* 답변 영역 */}
                        {inquiry.status === 'ANSWERED' && inquiry.answer ? (
                            <div className="rounded-lg border border-accent/40 bg-bg-secondary p-5">
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-sm font-semibold text-accent">관리자 답변</span>
                                    {inquiry.answered_at && (
                                        <span className="text-xs text-text-secondary">{formatDate(inquiry.answered_at)}</span>
                                    )}
                                </div>
                                <p className="text-sm text-text-primary whitespace-pre-wrap">{inquiry.answer}</p>
                            </div>
                        ) : (
                            <div className="rounded-lg border border-border-primary p-8 text-center">
                                <p className="text-sm text-text-secondary">
                                    답변 대기 중입니다. 답변이 등록되면 알려드릴게요.
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </MyLayOut>
    );
}
