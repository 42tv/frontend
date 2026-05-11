'use client';

import React, { useState, useEffect, useCallback } from 'react';
import ExchangeContentSkeleton from './ExchangeContentSkeleton';
import { getPayoutSummary } from '@/app/_apis/payout-coin';
import { createSettlement, getMySettlements, getMySettlementStats } from '@/app/_apis/settlement';
import type { PayoutSummary } from '@/app/_types/payout-coin';
import type { Settlement, SettlementStats, SettlementStatus } from '@/app/_types/settlement';
import {
  MdAccountBalanceWallet, MdAccessTime, MdLoop, MdBlock,
  MdCheckCircle, MdTrendingUp, MdRefresh, MdInfoOutline,
} from 'react-icons/md';
import { AxiosError } from 'axios';

const SETTLEMENT_STATUS_LABEL: Record<SettlementStatus, string> = {
  PENDING: '처리 중',
  APPROVED: '승인됨',
  PAID: '정산 완료',
  REJECTED: '거절됨',
};

const SETTLEMENT_STATUS_CLASS: Record<SettlementStatus, string> = {
  PENDING: 'bg-yellow-500/15 text-yellow-400 ring-1 ring-yellow-500/30',
  APPROVED: 'bg-blue-500/15 text-blue-400 ring-1 ring-blue-500/30',
  PAID: 'bg-green-500/15 text-green-400 ring-1 ring-green-500/30',
  REJECTED: 'bg-red-500/15 text-red-400 ring-1 ring-red-500/30',
};

function formatCurrency(value: number) {
  return value.toLocaleString('ko-KR') + '원';
}

function formatCoin(count: number) {
  return count.toLocaleString('ko-KR') + '개';
}

function formatDate(dateStr: string | null) {
  if (!dateStr) return '-';
  return new Date(dateStr).toLocaleDateString('ko-KR', {
    year: 'numeric', month: '2-digit', day: '2-digit',
  });
}

function extractApiError(err: unknown): string {
  if (err instanceof AxiosError) {
    const msg = err.response?.data?.message;
    if (typeof msg === 'string') return msg;
  }
  return '요청 처리 중 오류가 발생했습니다.';
}


const HISTORY_FILTER_TABS: { label: string; value: SettlementStatus | undefined }[] = [
  { label: '전체', value: undefined },
  { label: '처리 중', value: 'PENDING' },
  { label: '승인됨', value: 'APPROVED' },
  { label: '정산 완료', value: 'PAID' },
  { label: '거절됨', value: 'REJECTED' },
];

export const ExchangeContent = () => {
  const [summary, setSummary] = useState<PayoutSummary | null>(null);
  const [stats, setStats] = useState<SettlementStats | null>(null);
  const [settlements, setSettlements] = useState<Settlement[]>([]);
  const [loading, setLoading] = useState(true);
  const [requesting, setRequesting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [amountInput, setAmountInput] = useState('');
  const [filterStatus, setFilterStatus] = useState<SettlementStatus | undefined>(undefined);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const fetchData = useCallback(async (status?: SettlementStatus) => {
    try {
      setLoading(true);
      setError(null);
      const [summaryRes, statsRes, settlementsRes] = await Promise.all([
        getPayoutSummary(),
        getMySettlementStats(),
        getMySettlements({ limit: 20, status }),
      ]);
      setSummary(summaryRes.data);
      setStats(statsRes.data);
      setSettlements(settlementsRes.data?.settlements ?? []);
    } catch (err) {
      setError(extractApiError(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(filterStatus); }, [fetchData, filterStatus]);

  const availableCount = Math.floor((summary?.available_amount ?? 0) / 100);
  const enteredCount = Math.min(Math.max(0, Number(amountInput) || 0), availableCount);
  const enteredAmount = enteredCount * 100;
  const feeValue = Math.floor(enteredAmount * 0.1);
  const netValue = enteredAmount - feeValue;
  const canSettle = enteredCount > 0 && availableCount > 0;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value.replace(/[^0-9]/g, '');
    const num = Number(v);
    setAmountInput(num > availableCount ? String(availableCount) : v);
  };

  const handleSetMax = () => setAmountInput(String(availableCount));

  const handleRequestSettlement = async () => {
    if (!canSettle) return;
    try {
      setRequesting(true);
      setError(null);
      setSuccessMessage(null);
      const res = await createSettlement({ amount: enteredAmount });
      setSuccessMessage(
        `정산이 신청되었습니다. 신청 코인 ${formatCoin(Math.floor(res.data.total_value / 100))} (${formatCurrency(res.data.total_value)}), 예상 지급액 ${formatCurrency(res.data.payout_amount)}`,
      );
      setAmountInput('');
      await fetchData(filterStatus);
    } catch (err) {
      setError(extractApiError(err));
    } finally {
      setRequesting(false);
    }
  };

  const handleFilterChange = (status: SettlementStatus | undefined) => {
    setFilterStatus(status);
    setExpandedId(null);
  };

  if (loading) return <ExchangeContentSkeleton />;

  const noAccount = error?.includes('계좌');

  return (
    <div className="space-y-5">
      {/* 페이지 헤더 */}
      <div className="pb-4 border-b border-border-primary flex items-start justify-between">
        <div>
          <h2 className="text-xl font-semibold text-text-primary">수익 정산</h2>
          <p className="text-sm mt-1 text-text-secondary">후원 코인을 원화로 전환 신청하고 정산 내역을 확인하세요.</p>
        </div>
        <button
          onClick={() => fetchData(filterStatus)}
          className="p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-bg-tertiary transition-colors"
          title="새로고침"
        >
          <MdRefresh className="w-4 h-4" />
        </button>
      </div>

      {/* 알림 */}
      {error && (
        <div className="flex items-start gap-2.5 px-4 py-3 rounded-xl bg-red-500/10 text-red-400 ring-1 ring-red-500/20 text-sm">
          <span className="shrink-0 mt-0.5">⚠</span>
          <div className="flex-1">
            <p>{error}</p>
            {noAccount && (
              <p className="mt-1 text-xs opacity-80">
                정산 계좌를 먼저 등록하고 인증을 완료해주세요.
              </p>
            )}
          </div>
        </div>
      )}
      {successMessage && (
        <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-green-500/10 text-green-400 ring-1 ring-green-500/20 text-sm">
          <span className="shrink-0">✓</span>{successMessage}
        </div>
      )}

      {/* 정산 신청 카드 */}
      <div className="rounded-xl bg-bg-secondary border border-border-primary overflow-hidden">
        {/* 정산 가능 금액 강조 */}
        <div className="px-6 pt-6 pb-5 border-b border-border-primary">
          <p className="text-xs font-medium text-text-secondary uppercase tracking-wider mb-1">정산 가능 코인</p>
          <p className="text-4xl font-bold text-accent tabular-nums">
            {formatCoin(availableCount)}
          </p>
          <p className="text-xs text-text-secondary mt-2 flex items-center gap-1">
            <MdInfoOutline className="w-3.5 h-3.5 shrink-0" />
            1개 = 100원 / 수수료 10% 적용 전
          </p>
        </div>

        <div className="px-6 py-5">
          <h3 className="font-semibold text-text-primary text-sm mb-5">정산 신청</h3>

          {/* 금액 입력 */}
          <div className="mb-5">
            <label className="block text-xs text-text-secondary mb-1.5">신청 코인 수</label>
            <div className="relative">
              <input
                type="text"
                inputMode="numeric"
                value={amountInput}
                onChange={handleInputChange}
                placeholder="0"
                disabled={availableCount === 0}
                className="w-full px-4 py-3 pr-24 rounded-lg bg-bg-tertiary border border-border-primary text-text-primary text-sm tabular-nums
                  focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent placeholder:text-text-secondary/40
                  disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                <span className="text-xs text-text-secondary">개</span>
                <button
                  onClick={handleSetMax}
                  disabled={availableCount === 0}
                  className="text-xs px-2 py-1 rounded bg-accent/20 text-accent hover:bg-accent/30 transition-colors font-medium disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  전액
                </button>
              </div>
            </div>
            <p className="text-xs text-text-secondary mt-1.5">
              최대 {formatCoin(availableCount)} 신청 가능
            </p>
          </div>

          {/* 계산 결과 */}
          <div className="rounded-lg bg-bg-tertiary border border-border-primary divide-y divide-border-primary">
            <div className="flex items-center justify-between px-4 py-3">
              <span className="text-sm text-text-secondary">신청 코인</span>
              <span className="text-sm font-medium text-text-primary tabular-nums">{formatCoin(enteredCount)}</span>
            </div>
            <div className="flex items-center justify-between px-4 py-3">
              <span className="text-sm text-text-secondary">코인 환산 금액</span>
              <span className="text-sm font-medium text-text-primary tabular-nums">{formatCurrency(enteredAmount)}</span>
            </div>
            <div className="flex items-center justify-between px-4 py-3">
              <span className="text-sm text-text-secondary">수수료 (10%)</span>
              <span className="text-sm text-red-400 tabular-nums">−{formatCurrency(feeValue)}</span>
            </div>
            <div className="flex items-center justify-between px-4 py-3.5 bg-bg-secondary rounded-b-lg">
              <span className="text-sm font-semibold text-text-primary">예상 지급액</span>
              <span className={`text-lg font-bold tabular-nums ${canSettle ? 'text-accent' : 'text-text-secondary'}`}>
                {formatCurrency(netValue)}
              </span>
            </div>
          </div>
        </div>

        <div className="px-6 pb-5">
          <button
            onClick={handleRequestSettlement}
            disabled={requesting || !canSettle}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-lg font-semibold text-sm transition-all
              bg-accent hover:bg-accent-light text-white
              disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <MdAccountBalanceWallet className="w-4 h-4" />
            {requesting ? '신청 중...' : '정산 신청하기'}
          </button>
        </div>
      </div>

      {/* 코인 상태 요약 */}
      <div className="rounded-xl bg-bg-secondary border border-border-primary grid grid-cols-2 sm:grid-cols-4 divide-x-0 sm:divide-x divide-y sm:divide-y-0 divide-border-primary">
        <StatusCell
          icon={<MdAccessTime className="w-3.5 h-3.5" />}
          label="정산 대기"
          coinCount={Math.floor((summary?.waiting_amount ?? 0) / 100)}
          color="yellow"
          hint="후원 후 3일 대기 중"
        />
        <StatusCell
          icon={<MdLoop className="w-3.5 h-3.5" />}
          label="정산 중"
          coinCount={Math.floor((summary?.in_settlement_amount ?? 0) / 100)}
          color="blue"
          hint="관리자 처리 중"
        />
        <StatusCell
          icon={<MdBlock className="w-3.5 h-3.5" />}
          label="정산 보류"
          coinCount={Math.floor((summary?.blocked_amount ?? 0) / 100)}
          color="red"
          hint="컴플라이언스 검토"
        />
        <StatusCell
          icon={<MdCheckCircle className="w-3.5 h-3.5" />}
          label="누적 지급"
          coinCount={Math.floor((summary?.completed_amount ?? 0) / 100)}
          color="green"
          hint="누적 지급 완료 코인"
        />
      </div>

      {/* 정산 통계 */}
      {stats && (
        <div className="rounded-xl bg-bg-secondary border border-border-primary p-5">
          <div className="flex items-center gap-2 mb-4">
            <MdTrendingUp className="w-4 h-4 text-accent" />
            <h3 className="font-semibold text-text-primary text-sm">정산 통계</h3>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <StatItem label="누적 지급" amount={stats.total_paid_amount} count={stats.total_paid_count} highlight />
            <StatItem label="검토 중" amount={stats.pending_amount} count={stats.pending_count} />
            <StatItem label="승인됨" amount={stats.approved_amount} count={stats.approved_count} />
          </div>
        </div>
      )}

      {/* 정산 내역 */}
      <div className="rounded-xl bg-bg-secondary border border-border-primary">
        {/* 헤더 + 필터 탭 */}
        <div className="px-5 pt-4 pb-0 border-b border-border-primary">
          <h3 className="font-semibold text-text-primary text-sm mb-3">정산 내역</h3>
          <div className="flex gap-1 overflow-x-auto pb-px">
            {HISTORY_FILTER_TABS.map((tab) => (
              <button
                key={tab.label}
                onClick={() => handleFilterChange(tab.value)}
                className={`shrink-0 px-3 py-1.5 rounded-t-md text-xs font-medium transition-colors border-b-2
                  ${filterStatus === tab.value
                    ? 'border-accent text-accent bg-accent/10'
                    : 'border-transparent text-text-secondary hover:text-text-primary hover:bg-bg-tertiary'
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {settlements.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 gap-2">
            <MdAccountBalanceWallet className="w-8 h-8 text-text-secondary opacity-40" />
            <p className="text-sm text-text-secondary">정산 내역이 없습니다.</p>
          </div>
        ) : (
          <ul className="divide-y divide-border-primary">
            {settlements.map((s) => (
              <React.Fragment key={s.id}>
                <li
                  className={`px-5 py-4 cursor-pointer hover:bg-bg-tertiary transition-colors ${expandedId === s.id ? 'bg-bg-tertiary' : ''}`}
                  onClick={() => setExpandedId(expandedId === s.id ? null : s.id)}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className={`inline-flex shrink-0 px-2 py-0.5 rounded-full text-xs font-medium ${SETTLEMENT_STATUS_CLASS[s.status]}`}>
                          {SETTLEMENT_STATUS_LABEL[s.status]}
                        </span>
                        <span className="text-xs text-text-secondary tabular-nums">{formatDate(s.requested_at)}</span>
                      </div>
                      <p className="text-xs text-text-secondary tabular-nums">
                        신청 {formatCurrency(s.total_value)} · 수수료 −{formatCurrency(s.fee_amount)}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-semibold text-text-primary tabular-nums text-sm">{formatCurrency(s.payout_amount)}</p>
                      <p className="text-xs text-text-secondary mt-0.5">
                        {s.status === 'PAID' && s.paid_at ? `지급 ${formatDate(s.paid_at)}` :
                         s.status === 'APPROVED' && s.approved_at ? `승인 ${formatDate(s.approved_at)}` :
                         s.status === 'REJECTED' && s.rejected_at ? `거절 ${formatDate(s.rejected_at)}` : ''}
                      </p>
                    </div>
                  </div>
                </li>
                {expandedId === s.id && s.status === 'REJECTED' && s.reject_reason && (
                  <li className="border-t border-border-primary bg-red-500/5 px-5 py-3">
                    <div className="flex items-start gap-2 text-xs text-red-400">
                      <span className="shrink-0 font-medium">거절 사유</span>
                      <span className="text-text-secondary">{s.reject_reason}</span>
                    </div>
                  </li>
                )}
                {expandedId === s.id && s.status !== 'REJECTED' && (
                  <li className="border-t border-border-primary bg-bg-tertiary/50 px-5 py-3">
                    <div className="flex flex-wrap gap-4 text-xs text-text-secondary">
                      <span>ID: <span className="text-text-primary font-mono text-[10px]">{s.id}</span></span>
                      {s.approved_at && <span>승인일: {formatDate(s.approved_at)}</span>}
                      {s.paid_at && <span>지급일: {formatDate(s.paid_at)}</span>}
                    </div>
                  </li>
                )}
              </React.Fragment>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

// ── 서브 컴포넌트 ───────────────────────────────────────────────────────────

interface StatusCellProps {
  icon: React.ReactNode;
  label: string;
  coinCount: number;
  color: 'yellow' | 'blue' | 'red' | 'green';
  hint: string;
}

const COLOR_MAP: Record<StatusCellProps['color'], string> = {
  yellow: 'text-yellow-400',
  blue: 'text-blue-400',
  red: 'text-red-400',
  green: 'text-green-400',
};

const StatusCell: React.FC<StatusCellProps> = ({ icon, label, coinCount, color, hint }) => (
  <div className="flex flex-col gap-1 px-4 py-3.5" title={hint}>
    <div className={`flex items-center gap-1.5 text-xs ${COLOR_MAP[color]}`}>
      {icon}
      <span>{label}</span>
    </div>
    <p className="text-base font-bold text-text-primary tabular-nums">
      {formatCoin(coinCount)}
    </p>
  </div>
);

interface StatItemProps {
  label: string;
  amount: number;
  count: number;
  highlight?: boolean;
}

const StatItem: React.FC<StatItemProps> = ({ label, amount, count, highlight }) => (
  <div className="flex flex-col gap-1 text-center p-3 rounded-lg bg-bg-tertiary">
    <p className="text-xs text-text-secondary">{label}</p>
    <p className={`font-bold tabular-nums text-sm ${highlight ? 'text-accent' : 'text-text-primary'}`}>
      {formatCurrency(amount)}
    </p>
    <p className="text-xs text-text-secondary">{count}건</p>
  </div>
);
