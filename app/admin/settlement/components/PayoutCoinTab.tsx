'use client';
import { useState } from 'react';
import type { PayoutStatus, PayoutCoin } from '@/app/_types/payout-coin';
import type { MatureResult } from '@/app/_apis/admin/payout-coin';
import {
  maturePayoutCoins,
  getStreamerPayoutCoins,
  unblockPayoutCoin,
} from '@/app/_apis/admin/payout-coin';

const STATUS_OPTIONS: { value: PayoutStatus | ''; label: string }[] = [
  { value: '', label: '전체' },
  { value: 'PENDING', label: 'PENDING' },
  { value: 'MATURED', label: 'MATURED' },
  { value: 'BLOCKED', label: 'BLOCKED' },
  { value: 'SETTLED', label: 'SETTLED' },
];

const STATUS_COLOR: Record<PayoutStatus, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  MATURED: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  BLOCKED: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  SETTLED: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
};

export default function PayoutCoinTab() {
  const [streamerIdx, setStreamerIdx] = useState('');
  const [statusFilter, setStatusFilter] = useState<PayoutStatus | ''>('');
  const [coins, setCoins] = useState<PayoutCoin[]>([]);
  const [total, setTotal] = useState(0);
  const [searchLoading, setSearchLoading] = useState(false);
  const [matureLoading, setMatureLoading] = useState(false);
  const [matureResult, setMatureResult] = useState<MatureResult | null>(null);
  const [unblockingId, setUnblockingId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);

  const handleSearch = async () => {
    const idx = parseInt(streamerIdx, 10);
    if (!streamerIdx || isNaN(idx)) {
      setError('스트리머 IDX를 입력하세요.');
      return;
    }
    setSearchLoading(true);
    setError('');
    setMatureResult(null);
    try {
      const res = await getStreamerPayoutCoins(idx, {
        status: statusFilter || undefined,
        limit: 50,
      });
      setCoins(res.data.payoutCoins);
      setTotal(res.pagination.total);
      setSearched(true);
    } catch {
      setError('조회 중 오류가 발생했습니다.');
    } finally {
      setSearchLoading(false);
    }
  };

  const handleMature = async () => {
    if (!confirm('정산 가능으로 전환하시겠습니까?\n정산 가능일이 도래한 PENDING 코인이 MATURED로 전환됩니다.')) return;
    setMatureLoading(true);
    setError('');
    setMatureResult(null);
    try {
      const result = await maturePayoutCoins();
      setMatureResult(result);
      // 결과 표시 후 현재 목록도 갱신
      if (searched && streamerIdx) {
        handleSearch();
      }
    } catch {
      setError('정산 가능 전환 중 오류가 발생했습니다.');
    } finally {
      setMatureLoading(false);
    }
  };

  const handleUnblock = async (coin: PayoutCoin) => {
    if (!confirm(`ID: ${coin.id}\n해당 BLOCKED 코인을 MATURED로 해제하시겠습니까?`)) return;
    setUnblockingId(coin.id);
    setError('');
    try {
      await unblockPayoutCoin(coin.id);
      setCoins((prev) => prev.map((c) => (c.id === coin.id ? { ...c, status: 'MATURED' } : c)));
    } catch {
      setError('언블록 처리 중 오류가 발생했습니다.');
    } finally {
      setUnblockingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* 성숙도 업데이트 액션 */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-semibold text-foreground">정산 가능 전환</h3>
            <p className="text-sm text-muted-foreground mt-1">
              PENDING 상태 코인 중 정산 가능일이 도래한 항목을 MATURED로 전환합니다.
            </p>
          </div>
          <button
            onClick={handleMature}
            disabled={matureLoading}
            className="px-5 py-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-colors font-medium whitespace-nowrap"
          >
            {matureLoading ? '실행 중...' : '정산 가능으로 전환'}
          </button>
        </div>

        {matureResult && (
          <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <p className="text-sm font-semibold text-green-800 dark:text-green-400 mb-2">처리 완료</p>
            <div className="flex gap-6 text-sm text-green-700 dark:text-green-300">
              <span>총 <strong>{matureResult.total}</strong>건</span>
              <span>성숙 <strong>{matureResult.matured}</strong>건</span>
              <span>차단 <strong>{matureResult.blocked}</strong>건</span>
            </div>
          </div>
        )}
      </div>

      {/* 스트리머별 조회 */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="font-semibold text-foreground mb-4">스트리머별 PayoutCoin 조회</h3>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="number"
            placeholder="스트리머 IDX 입력"
            value={streamerIdx}
            onChange={(e) => setStreamerIdx(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="flex-1 px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as PayoutStatus | '')}
            className="px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {STATUS_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
          <button
            onClick={handleSearch}
            disabled={searchLoading}
            className="px-5 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-colors font-medium"
          >
            {searchLoading ? '조회 중...' : '조회'}
          </button>
        </div>

        {error && (
          <p className="mt-3 text-sm text-red-500 bg-red-50 dark:bg-red-900/20 rounded-lg px-4 py-2">
            {error}
          </p>
        )}
      </div>

      {/* 결과 테이블 */}
      {searched && (
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-border flex items-center justify-between">
            <h3 className="font-semibold text-foreground">조회 결과</h3>
            <span className="text-sm text-muted-foreground">총 {total}건</span>
          </div>

          {coins.length === 0 ? (
            <div className="py-16 text-center text-muted-foreground">
              해당 조건의 PayoutCoin이 없습니다.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-muted/50 text-muted-foreground">
                    <th className="text-left px-4 py-3 font-medium">ID</th>
                    <th className="text-left px-4 py-3 font-medium">상태</th>
                    <th className="text-right px-4 py-3 font-medium">코인량</th>
                    <th className="text-right px-4 py-3 font-medium">금액(원)</th>
                    <th className="text-left px-4 py-3 font-medium">정산 가능일</th>
                    <th className="text-left px-4 py-3 font-medium">생성일</th>
                    <th className="px-4 py-3"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {coins.map((coin) => (
                    <tr key={coin.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 font-mono text-xs text-muted-foreground truncate max-w-[120px]">
                        {coin.id}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${STATUS_COLOR[coin.status]}`}
                        >
                          {coin.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">{coin.coin_amount.toLocaleString()}</td>
                      <td className="px-4 py-3 text-right">{coin.coin_value.toLocaleString()}</td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {new Date(coin.settlement_ready_at).toLocaleDateString('ko-KR')}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {new Date(coin.created_at).toLocaleDateString('ko-KR')}
                      </td>
                      <td className="px-4 py-3">
                        {coin.status === 'BLOCKED' && (
                          <button
                            onClick={() => handleUnblock(coin)}
                            disabled={unblockingId === coin.id}
                            className="px-3 py-1 bg-orange-500 text-white rounded text-xs hover:bg-orange-600 disabled:opacity-50 transition-colors font-medium"
                          >
                            {unblockingId === coin.id ? '처리 중...' : '차단 해제'}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
