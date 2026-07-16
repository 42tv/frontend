'use client'
import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import MyLayOut from '@/app/my/info/components/layout';
import { getMyInquiries } from '@/app/_apis/inquiry';
import type { Inquiry } from '@/app/_types/inquiry';
import { inquiryStatusLabels, inquiryTypeLabels } from '@/app/_types/inquiry';

const PAGE_SIZE = 10;

export default function InquiryListPage() {
    const router = useRouter();
    const [inquiries, setInquiries] = useState<Inquiry[]>([]);
    const [page, setPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const load = useCallback(async (): Promise<void> => {
        try {
            setLoading(true);
            setError(null);
            const result = await getMyInquiries(page, PAGE_SIZE);
            setInquiries(result.inquiries);
            setTotalPages(result.pagination.totalPages);
        } catch (err: unknown) {
            console.error('Failed to fetch inquiries:', err);
            setError('문의 목록을 불러오는데 실패했습니다.');
        } finally {
            setLoading(false);
        }
    }, [page]);

    useEffect(() => {
        load();
    }, [load]);

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
            <div className="flex flex-col w-full h-full p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-text-primary">1:1 문의</h2>
                    <button
                        onClick={() => router.push('/my/inquiry/new')}
                        className="px-4 py-2 text-sm font-medium rounded-lg bg-accent text-white hover:opacity-90 transition-opacity"
                    >
                        문의하기
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

                {!loading && !error && inquiries.length === 0 && (
                    <div className="rounded-lg p-12 border border-border-primary">
                        <div className="flex flex-col items-center text-center">
                            <h3 className="text-lg font-medium mb-2 text-text-primary">문의 내역이 없습니다</h3>
                            <p className="text-sm text-text-secondary">궁금한 점이 있으면 문의하기 버튼을 눌러주세요.</p>
                        </div>
                    </div>
                )}

                {!loading && !error && inquiries.length > 0 && (
                    <div className="flex flex-col divide-y divide-border-primary border border-border-primary rounded-lg">
                        {inquiries.map((inquiry) => {
                            const hasNewAnswer = inquiry.status === 'ANSWERED' && !inquiry.is_answer_read;
                            return (
                                <div
                                    key={inquiry.id}
                                    onClick={() => router.push(`/my/inquiry/${inquiry.id}`)}
                                    className="flex items-center gap-3 p-4 cursor-pointer hover:bg-bg-tertiary transition-colors"
                                >
                                    <span className="shrink-0 px-2 py-0.5 text-xs rounded-full bg-bg-tertiary text-text-secondary">
                                        {inquiryTypeLabels[inquiry.type]}
                                    </span>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <p className="text-sm font-medium text-text-primary truncate">{inquiry.title}</p>
                                            {hasNewAnswer && (
                                                <span className="shrink-0 px-1.5 py-0.5 text-[10px] font-semibold rounded-full bg-red-500 text-white">
                                                    새 답변
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-xs text-text-secondary mt-0.5">{formatDate(inquiry.created_at)}</p>
                                    </div>
                                    <span
                                        className={`shrink-0 px-2 py-0.5 text-xs rounded-full ${
                                            inquiry.status === 'ANSWERED'
                                                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                                : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                                        }`}
                                    >
                                        {inquiryStatusLabels[inquiry.status]}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                )}

                {!loading && !error && totalPages > 1 && (
                    <div className="flex items-center justify-center gap-3 mt-6">
                        <button
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                            disabled={page <= 1}
                            className="px-3 py-1.5 text-sm rounded-md border border-border-primary text-text-primary hover:bg-bg-tertiary disabled:opacity-40 transition-colors"
                        >
                            이전
                        </button>
                        <span className="text-sm text-text-secondary">{page} / {totalPages}</span>
                        <button
                            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                            disabled={page >= totalPages}
                            className="px-3 py-1.5 text-sm rounded-md border border-border-primary text-text-primary hover:bg-bg-tertiary disabled:opacity-40 transition-colors"
                        >
                            다음
                        </button>
                    </div>
                )}
            </div>
        </MyLayOut>
    );
}
