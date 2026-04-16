'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { getPayoutSummary, getMaturedPayoutCoins } from '@/app/_apis/payout-coin';
import { createSettlement, getMySettlements, getMySettlementStats } from '@/app/_apis/settlement';
import type { PayoutSummary } from '@/app/_types/payout-coin';
import type { Settlement, SettlementStats } from '@/app/_types/settlement';

const SETTLEMENT_STATUS_LABEL: Record<string, string> = {
  PENDING: '검토 중',
  APPROVED: '승인됨',
  PAID: '지급 완료',
  REJECTED: '거절됨',
};

const SETTLEMENT_STATUS_CLASS: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  APPROVED: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  PAID: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  REJECTED: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
};

function formatCurrency(value: number) {
  return value.toLocaleString('ko-KR') + '원';
}

function formatCoin(value: number) {
  return value.toLocaleString('ko-KR') + ' Coin';
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
}

export const ExchangeContent = () => {
  const [summary, setSummary] = useState<PayoutSummary | null>(null);
  const [stats, setStats] = useState<SettlementStats | null>(null);
  const [settlements, setSettlements] = useState<Settlement[]>([]);
  const [loading, setLoading] = useState(true);
  const [requesting, setRequesting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [summaryRes, statsRes, settlementsRes] = await Promise.all([
        getPayoutSummary(),
        getMySettlementStats(),
        getMySettlements({ limit: 10 }),
      ]);
      setSummary(summaryRes.data);
      setStats(statsRes.data);
      setSettlements(settlementsRes.data.settlements);
    } catch {
      setError('데이터를 불러오는 데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleRequestSettlement = async () => {
    if (!summary || summary.matured_amount <= 0) return;

    try {
      setRequesting(true);
      setError(null);
      setSuccessMessage(null);

      // MATURED 상태의 PayoutCoin ID 목록 조회
      const maturedRes = await getMaturedPayoutCoins({ limit: 500 });
      const ids = maturedRes.data.payoutCoins.map((c) => c.id);

      if (ids.length === 0) {
        setError('정산 가능한 코인이 없습니다.');
        return;
      }

      await createSettlement({ payout_coin_ids: ids });
      setSuccessMessage('정산 요청이 완료되었습니다. 관리자 검토 후 지급됩니다.');
      await fetchData();
    } catch {
      setError('정산 요청에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setRequesting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16 text-text-secondary">
        불러오는 중...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 알림 메시지 */}
      {error && (
        <div className="px-4 py-3 rounded-lg bg-red-50 text-red-700 border border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800 text-sm">
          {error}
        </div>
      )}
      {successMessage && (
        <div className="px-4 py-3 rounded-lg bg-green-50 text-green-700 border border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800 text-sm">
          {successMessage}
        </div>
      )}

      {/* 코인 현황 카드 */}
      <div className="p-6 rounded-lg bg-bg-secondary border border-border-primary">
        <h3 className="font-bold text-lg mb-4 text-text-primary">코인 현황</h3>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <SummaryCard
            label="정산 가능"
            value={summary?.matured_amount ?? 0}
            accent="green"
            tooltip="지금 바로 정산 요청할 수 있는 금액입니다."
          />
          <SummaryCard
            label="대기 중"
            value={summary?.pending_amount ?? 0}
            accent="yellow"
            tooltip="후원 후 3일간 대기 중인 금액입니다."
          />
          <SummaryCard
            label="차단됨"
            value={summary?.blocked_amount ?? 0}
            accent="red"
            tooltip="컴플라이언스 검토로 보류된 금액입니다."
          />
          <SummaryCard
            label="정산 완료"
            value={summary?.settled_amount ?? 0}
            accent="gray"
            tooltip="이미 정산 요청된 금액입니다."
          />
        </div>
      </div>

      {/* 정산 요약 + 요청 버튼 */}
      <div className="p-6 rounded-lg bg-bg-secondary border border-border-primary">
        <h3 className="font-bold text-lg mb-4 text-text-primary">정산 요청</h3>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-sm text-text-secondary mb-1">현재 정산 가능 금액</p>
            <p className="text-3xl font-bold text-text-primary">
              {formatCurrency(summary?.matured_amount ?? 0)}
            </p>
            <p className="text-xs text-text-secondary mt-1">
              수수료 10% 차감 후 실지급:{' '}
              <span className="font-semibold text-text-primary">
                {formatCurrency(Math.floor((summary?.matured_amount ?? 0) * 0.9))}
              </span>
            </p>
          </div>
          <button
            onClick={handleRequestSettlement}
            disabled={requesting || !summary || summary.matured_amount <= 0}
            className="px-6 py-3 rounded-lg font-semibold transition-colors text-white
              bg-accent hover:bg-accent-light
              disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {requesting ? '요청 중...' : '정산 요청하기'}
          </button>
        </div>
      </div>

      {/* 정산 통계 */}
      {stats && (
        <div className="p-6 rounded-lg bg-bg-secondary border border-border-primary">
          <h3 className="font-bold text-lg mb-4 text-text-primary">정산 통계</h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-xs text-text-secondary mb-1">누적 지급액</p>
              <p className="font-bold text-text-primary">{formatCoin(stats.total_paid_amount)}</p>
              <p className="text-xs text-text-secondary">{stats.total_paid_count}건</p>
            </div>
            <div>
              <p className="text-xs text-text-secondary mb-1">검토 중</p>
              <p className="font-bold text-text-primary">{formatCoin(stats.pending_amount)}</p>
              <p className="text-xs text-text-secondary">{stats.pending_count}건</p>
            </div>
            <div>
              <p className="text-xs text-text-secondary mb-1">승인됨</p>
              <p className="font-bold text-text-primary">{formatCoin(stats.approved_amount)}</p>
              <p className="text-xs text-text-secondary">{stats.approved_count}건</p>
            </div>
          </div>
        </div>
      )}

      {/* 정산 내역 */}
      <div className="p-6 rounded-lg bg-bg-secondary border border-border-primary">
        <h3 className="font-bold text-lg mb-4 text-text-primary">정산 내역</h3>
        {settlements.length === 0 ? (
          <p className="text-center py-8 text-text-secondary text-sm">정산 내역이 없습니다.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border-primary text-text-secondary">
                  <th className="pb-3 text-left font-medium">요청일</th>
                  <th className="pb-3 text-right font-medium">총 금액</th>
                  <th className="pb-3 text-right font-medium">수수료</th>
                  <th className="pb-3 text-right font-medium">실지급액</th>
                  <th className="pb-3 text-center font-medium">상태</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-primary">
                {settlements.map((s) => (
                  <tr key={s.id} className="text-text-primary">
                    <td className="py-3">{formatDate(s.created_at)}</td>
                    <td className="py-3 text-right">{formatCurrency(s.total_value)}</td>
                    <td className="py-3 text-right text-text-secondary">
                      -{formatCurrency(s.fee_amount)}
                    </td>
                    <td className="py-3 text-right font-semibold">
                      {formatCurrency(s.payout_amount)}
                    </td>
                    <td className="py-3 text-center">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${SETTLEMENT_STATUS_CLASS[s.status]}`}
                      >
                        {SETTLEMENT_STATUS_LABEL[s.status] ?? s.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

interface SummaryCardProps {
  label: string;
  value: number;
  accent: 'green' | 'yellow' | 'red' | 'gray';
  tooltip: string;
}

const ACCENT_CLASS: Record<SummaryCardProps['accent'], string> = {
  green: 'text-green-600 dark:text-green-400',
  yellow: 'text-yellow-600 dark:text-yellow-400',
  red: 'text-red-600 dark:text-red-400',
  gray: 'text-text-secondary',
};

const BORDER_CLASS: Record<SummaryCardProps['accent'], string> = {
  green: 'border-l-4 border-l-green-500',
  yellow: 'border-l-4 border-l-yellow-500',
  red: 'border-l-4 border-l-red-500',
  gray: 'border-l-4 border-l-border-primary',
};

const SummaryCard: React.FC<SummaryCardProps> = ({ label, value, accent, tooltip }) => (
  <div
    className={`p-4 rounded-lg bg-bg-tertiary ${BORDER_CLASS[accent]}`}
    title={tooltip}
  >
    <p className="text-xs text-text-secondary mb-1">{label}</p>
    <p className={`text-lg font-bold ${ACCENT_CLASS[accent]}`}>
      {formatCoin(value)}
    </p>
  </div>
);
