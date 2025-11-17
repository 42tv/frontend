'use client'
import { useEffect, useState } from 'react';
import { getSentDonations, SentDonationsResponse } from '@/app/_apis/donation';

export default function DonationTab() {
    const [donations, setDonations] = useState<SentDonationsResponse['donations']>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const itemsPerPage = 10;

    useEffect(() => {
        const fetchDonations = async () => {
            try {
                setLoading(true);
                const response = await getSentDonations({ limit: 100 });
                setDonations(response.donations);
            } catch (err: unknown) {
                console.error('Failed to fetch donations:', err);
                setError('후원 내역을 불러오는데 실패했습니다.');
            } finally {
                setLoading(false);
            }
        };

        fetchDonations();
    }, []);

    // 페이지네이션 계산
    const totalPages = Math.ceil(donations.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentDonations = donations.slice(startIndex, endIndex);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
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

    if (loading) {
        return (
            <div className="flex flex-col w-full h-full items-center justify-center">
                <div className="flex items-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
                    <span className="ml-3 text-text-secondary">로딩 중...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col w-full h-full items-center justify-center">
                <p className="text-error-dark">{error}</p>
            </div>
        );
    }

    if (donations.length === 0) {
        return (
            <div className="flex flex-col w-full h-full p-6">
                <h2 className="text-xl font-bold mb-6 text-text-primary">후원 내역</h2>
                <div className="rounded-lg p-12 border border-border-primary">
                    <div className="flex flex-col items-center text-center">
                        <h3 className="text-lg font-medium mb-2 text-text-primary">후원 내역이 없습니다</h3>
                        <p className="text-sm text-text-secondary">스트리머에게 후원하시면 내역이 여기에 표시됩니다.</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col w-full h-full p-6">
            <h2 className="text-xl font-bold mb-6 text-text-primary">후원 내역</h2>

            <div className="rounded-lg overflow-hidden border border-border-primary">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-bg-secondary">
                            <tr>
                                <th className="px-6 py-4 text-left font-medium text-sm text-text-primary">후원일시</th>
                                <th className="px-6 py-4 text-left font-medium text-sm text-text-primary">스트리머</th>
                                <th className="px-6 py-4 text-center font-medium text-sm text-text-primary">후원 코인</th>
                            </tr>
                        </thead>
                        <tbody className="bg-bg-primary">
                            {currentDonations.map((donation) => (
                                <tr key={donation.id} className="border-t border-tableRowBorder">
                                    <td className="px-6 py-4 text-sm text-text-secondary">
                                        {formatDate(donation.donated_at)}
                                    </td>
                                    <td className="px-6 py-4 text-sm font-medium text-text-primary">
                                        {donation.streamer.user_id}({donation.streamer.nickname})
                                    </td>
                                    <td className="px-6 py-4 text-sm text-center font-medium text-text-primary">
                                        {formatAmount(donation.coin_amount)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

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
        </div>
    );
}
