'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import ExchangeContentSkeleton from './ExchangeContentSkeleton';
import { getPayoutSummary, getMaturedPayoutCoins } from '@/app/_apis/payout-coin';
import { createSettlement, getMySettlements, getMySettlementStats } from '@/app/_apis/settlement';
import type { PayoutCoin, PayoutSummary } from '@/app/_types/payout-coin';
import type { Settlement, SettlementStats } from '@/app/_types/settlement';
import {
  MdAccountBalanceWallet, MdAccessTime, MdLoop, MdBlock,
  MdCheckCircle, MdTrendingUp,
} from 'react-icons/md';

const SETTLEMENT_STATUS_LABEL: Record<string, string> = {
  PENDING: '검토 중',
  APPROVED: '승인됨',
  PAID: '지급 완료',
  REJECTED: '거절됨',
};

const SETTLEMENT_STATUS_CLASS: Record<string, string> = {
  PENDING: 'bg-yellow-500/15 text-yellow-400 ring-1 ring-yellow-500/30',
  APPROVED: 'bg-blue-500/15 text-blue-400 ring-1 ring-blue-500/30',
  PAID: 'bg-green-500/15 text-green-400 ring-1 ring-green-500/30',
  REJECTED: 'bg-red-500/15 text-red-400 ring-1 ring-red-500/30',
};

function formatCurrency(value: number) {
  return value.toLocaleString('ko-KR') + '원';
}

function formatCoin(value: number) {
  return value.toLocaleString('ko-KR');
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('ko-KR', {
    year: 'numeric', month: '2-digit', day: '2-digit',
  });
}

export const ExchangeContent = () => {
  const [summary, setSummary] = useState<PayoutSummary | null>(null);
  const [maturedCoins, setMaturedCoins] = useState<PayoutCoin[]>([]);
  const [stats, setStats] = useState<SettlementStats | null>(null);
  const [settlements, setSettlements] = useState<Settlement[]>([]);
  const [loading, setLoading] = useState(true);
  const [requesting, setRequesting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [coinInput, setCoinInput] = useState('');

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [summaryRes, coinsRes, statsRes, settlementsRes] = await Promise.all([
        getPayoutSummary(),
        getMaturedPayoutCoins({ limit: 200 }),
        getMySettlementStats(),
        getMySettlements({ limit: 10 }),
      ]);
      setSummary(summaryRes.data);
      setMaturedCoins(coinsRes.data?.payoutCoins ?? []);
      setStats(statsRes.data);
      setSettlements(settlementsRes.data?.settlements ?? []);
    } catch (err) {
      console.error('[ExchangeContent] fetchData 실패:', err);
      setError('데이터를 불러오는 데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const totalMaturedCoins = useMemo(
    () => maturedCoins.reduce((sum, c) => sum + c.coin_amount, 0),
    [maturedCoins],
  );

  const COIN_RATE = 100; // 1 Coin = 100원

  const enteredCoins = Math.min(Math.max(0, Number(coinInput) || 0), totalMaturedCoins);
  const grossValue = enteredCoins * COIN_RATE;
  const feeValue = Math.floor(grossValue * 0.1);
  const netValue = grossValue - feeValue;
  const canSettle = enteredCoins > 0;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value.replace(/[^0-9]/g, '');
    const num = Number(v);
    setCoinInput(num > totalMaturedCoins ? String(totalMaturedCoins) : v);
  };

  const handleSetMax = () => setCoinInput(String(totalMaturedCoins));

  const handleRequestSettlement = async () => {
    if (!canSettle) return;
    try {
      setRequesting(true);
      setError(null);
      setSuccessMessage(null);
      await createSettlement({ amount: grossValue });
      setSuccessMessage('정산 요청이 완료되었습니다. 관리자 검토 후 지급됩니다.');
      setCoinInput('');
      await fetchData();
    } catch {
      setError('정산 요청에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setRequesting(false);
    }
  };

  if (loading) return <ExchangeContentSkeleton />;

  return (
    <div className="space-y-5">
      {/* 페이지 헤더 */}
      <div className="pb-4 border-b border-border-primary">
        <h2 className="text-xl font-semibold text-text-primary">수익 정산</h2>
        <p className="text-sm mt-1 text-text-secondary">코인을 원화로 전환 신청하고 정산 내역을 확인하세요.</p>
      </div>

      {/* 알림 */}
      {error && (
        <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-red-500/10 text-red-400 ring-1 ring-red-500/20 text-sm">
          <span className="shrink-0">⚠</span>{error}
        </div>
      )}
      {successMessage && (
        <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-green-500/10 text-green-400 ring-1 ring-green-500/20 text-sm">
          <span className="shrink-0">✓</span>{successMessage}
        </div>
      )}

      {/* 정산 신청 */}
      <div className="rounded-xl bg-bg-secondary border border-border-primary overflow-hidden">
        {/* 정산 가능 코인 강조 */}
        <div className="px-6 pt-6 pb-5 border-b border-border-primary">
          <p className="text-xs font-medium text-text-secondary uppercase tracking-wider mb-1">정산 가능 코인</p>
          <p className="text-4xl font-bold text-accent tabular-nums">
            {formatCoin(totalMaturedCoins)}
            <span className="text-lg font-semibold text-text-secondary ml-2">Coin</span>
          </p>
          <p className="text-sm text-text-secondary mt-1.5">
            ≈ <span className="text-text-primary font-medium">{formatCurrency(totalMaturedCoins * COIN_RATE)}</span> 상당
          </p>
        </div>
        <div className="px-6 py-5">
          <h3 className="font-semibold text-text-primary text-sm mb-5">정산 신청</h3>

          {/* 코인 입력 */}
          <div className="mb-5">
            <label className="block text-xs text-text-secondary mb-1.5">정산할 코인 수</label>
            <div className="relative">
              <input
                type="text"
                inputMode="numeric"
                value={coinInput}
                onChange={handleInputChange}
                placeholder="0"
                className="w-full px-4 py-3 pr-24 rounded-lg bg-bg-tertiary border border-border-primary text-text-primary text-sm tabular-nums
                  focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent placeholder:text-text-secondary/40"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                <span className="text-xs text-text-secondary">Coin</span>
                <button
                  onClick={handleSetMax}
                  className="text-xs px-2 py-1 rounded bg-accent/20 text-accent hover:bg-accent/30 transition-colors font-medium"
                >
                  전액
                </button>
              </div>
            </div>
            <p className="text-xs text-text-secondary mt-1.5">
              최대 {formatCoin(totalMaturedCoins)} Coin 신청 가능
            </p>
          </div>

          {/* 계산 결과 */}
          <div className="rounded-lg bg-bg-tertiary border border-border-primary divide-y divide-border-primary">
            <div className="flex items-center justify-between px-4 py-3">
              <span className="text-sm text-text-secondary">신청 코인</span>
              <span className="text-sm font-medium text-text-primary tabular-nums">{formatCoin(enteredCoins)} Coin</span>
            </div>
            <div className="flex items-center justify-between px-4 py-3">
              <span className="text-sm text-text-secondary">총 금액</span>
              <span className="text-sm font-medium text-text-primary tabular-nums">{formatCurrency(grossValue)}</span>
            </div>
            <div className="flex items-center justify-between px-4 py-3">
              <span className="text-sm text-text-secondary">수수료 (10%)</span>
              <span className="text-sm text-red-400 tabular-nums">−{formatCurrency(feeValue)}</span>
            </div>
            <div className="flex items-center justify-between px-4 py-3.5 bg-bg-secondary rounded-b-lg">
              <span className="text-sm font-semibold text-text-primary">실지급 예상액</span>
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
            {requesting ? '요청 중...' : '정산 요청하기'}
          </button>
        </div>
      </div>

      {/* 코인 상태 요약 */}
      <div className="rounded-xl bg-bg-secondary border border-border-primary grid grid-cols-2 sm:grid-cols-4 divide-x-0 sm:divide-x divide-y sm:divide-y-0 divide-border-primary">
        <StatusCell icon={<MdAccessTime className="w-3.5 h-3.5" />} label="대기 중" value={summary?.pending_amount ?? 0} color="yellow" hint="후원 후 3일 대기" />
        <StatusCell icon={<MdLoop className="w-3.5 h-3.5" />} label="신청 중" value={summary?.in_settlement_amount ?? 0} color="blue" hint="관리자 처리 중" />
        <StatusCell icon={<MdBlock className="w-3.5 h-3.5" />} label="차단됨" value={summary?.blocked_amount ?? 0} color="red" hint="컴플라이언스 검토" />
        <StatusCell icon={<MdCheckCircle className="w-3.5 h-3.5" />} label="지급 완료" value={summary?.settled_amount ?? 0} color="green" hint="누적 지급액" />
      </div>

      {/* 정산 통계 */}
      {stats && (
        <div className="rounded-xl bg-bg-secondary border border-border-primary p-5">
          <div className="flex items-center gap-2 mb-4">
            <MdTrendingUp className="w-4 h-4 text-accent" />
            <h3 className="font-semibold text-text-primary text-sm">정산 통계</h3>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <StatItem label="누적 지급" coin={stats.total_paid_amount} count={stats.total_paid_count} highlight />
            <StatItem label="검토 중" coin={stats.pending_amount} count={stats.pending_count} />
            <StatItem label="승인됨" coin={stats.approved_amount} count={stats.approved_count} />
          </div>
        </div>
      )}

      {/* 정산 내역 */}
      <div className="rounded-xl bg-bg-secondary border border-border-primary">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border-primary">
          <h3 className="font-semibold text-text-primary text-sm">정산 내역</h3>
          <span className="text-xs text-text-secondary">최근 10건</span>
        </div>
        {settlements.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 gap-2">
            <MdAccountBalanceWallet className="w-8 h-8 text-text-secondary opacity-40" />
            <p className="text-sm text-text-secondary">정산 내역이 없습니다.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-text-secondary border-b border-border-primary">
                  <th className="px-5 py-3 text-left font-medium">요청일</th>
                  <th className="px-5 py-3 text-right font-medium">총 금액</th>
                  <th className="px-5 py-3 text-right font-medium">수수료</th>
                  <th className="px-5 py-3 text-right font-medium">실지급액</th>
                  <th className="px-5 py-3 text-center font-medium">상태</th>
                </tr>
              </thead>
              <tbody>
                {settlements.map((s, i) => (
                  <tr key={s.id} className={`border-t border-border-primary hover:bg-bg-tertiary transition-colors ${i % 2 !== 0 ? 'bg-bg-primary/30' : ''}`}>
                    <td className="px-5 py-3.5 text-text-secondary tabular-nums">{formatDate(s.created_at)}</td>
                    <td className="px-5 py-3.5 text-right text-text-primary tabular-nums">{formatCurrency(s.total_value)}</td>
                    <td className="px-5 py-3.5 text-right text-text-secondary tabular-nums">−{formatCurrency(s.fee_amount)}</td>
                    <td className="px-5 py-3.5 text-right font-semibold text-text-primary tabular-nums">{formatCurrency(s.payout_amount)}</td>
                    <td className="px-5 py-3.5 text-center">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${SETTLEMENT_STATUS_CLASS[s.status] ?? ''}`}>
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

// ── 서브 컴포넌트 ───────────────────────────────────────────────────────────

interface StatusCellProps {
  icon: React.ReactNode;
  label: string;
  value: number;
  color: 'yellow' | 'blue' | 'red' | 'green';
  hint: string;
}

const COLOR_MAP: Record<StatusCellProps['color'], string> = {
  yellow: 'text-yellow-400',
  blue: 'text-blue-400',
  red: 'text-red-400',
  green: 'text-green-400',
};

const StatusCell: React.FC<StatusCellProps> = ({ icon, label, value, color, hint }) => (
  <div className="flex flex-col gap-1 px-4 py-3.5" title={hint}>
    <div className={`flex items-center gap-1.5 text-xs ${COLOR_MAP[color]}`}>
      {icon}
      <span>{label}</span>
    </div>
    <p className="text-base font-bold text-text-primary tabular-nums">
      {formatCoin(value)} <span className="text-xs font-normal text-text-secondary">Coin</span>
    </p>
  </div>
);

interface StatItemProps {
  label: string;
  coin: number;
  count: number;
  highlight?: boolean;
}

const StatItem: React.FC<StatItemProps> = ({ label, coin, count, highlight }) => (
  <div className="flex flex-col gap-1 text-center p-3 rounded-lg bg-bg-tertiary">
    <p className="text-xs text-text-secondary">{label}</p>
    <p className={`font-bold tabular-nums ${highlight ? 'text-accent' : 'text-text-primary'}`}>
      {formatCoin(coin)} <span className="text-xs font-normal text-text-secondary">Coin</span>
    </p>
    <p className="text-xs text-text-secondary">{count}건</p>
  </div>
);
