'use client';
import { useState, useEffect, useCallback } from 'react';
import type { Settlement, SettlementStatus } from '@/app/_types/settlement';
import {
  getPendingSettlements,
  getAllSettlements,
  type AdminSettlementQuery,
} from '@/app/_apis/admin/settlement';
import SettlementDetailModal from './SettlementDetailModal';

type SubTab = 'pending' | 'all';

const STATUS_OPTIONS: { value: SettlementStatus | ''; label: string }[] = [
  { value: '', label: '전체 상태' },
  { value: 'PENDING', label: '승인 대기' },
  { value: 'APPROVED', label: '승인됨' },
  { value: 'PAID', label: '지급 완료' },
  { value: 'REJECTED', label: '거절됨' },
];

const STATUS_LABEL: Record<SettlementStatus, string> = {
  PENDING: '승인 대기',
  APPROVED: '승인됨',
  PAID: '지급 완료',
  REJECTED: '거절됨',
};

const STATUS_COLOR: Record<SettlementStatus, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  APPROVED: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  PAID: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  REJECTED: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
};

export default function SettlementTab() {
  const [subTab, setSubTab] = useState<SubTab>('pending');
  const [settlements, setSettlements] = useState<Settlement[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // 전체 탭 필터
  const [filterStatus, setFilterStatus] = useState<SettlementStatus | ''>('');
  const [filterStreamerIdx, setFilterStreamerIdx] = useState('');
  const [filterStartDate, setFilterStartDate] = useState('');
  const [filterEndDate, setFilterEndDate] = useState('');

  // 모달
  const [selectedSettlement, setSelectedSettlement] = useState<Settlement | null>(null);

  const loadPending = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await getPendingSettlements();
      setSettlements(res.data?.settlements ?? []);
      setTotal(res.pagination?.total ?? 0);
    } catch {
      setError('목록 조회 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  }, []);

  const loadAll = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params: AdminSettlementQuery = { limit: 50 };
      if (filterStatus) params.status = filterStatus;
      if (filterStreamerIdx) params.streamerIdx = parseInt(filterStreamerIdx, 10);
      if (filterStartDate) params.startDate = filterStartDate;
      if (filterEndDate) params.endDate = filterEndDate;
      const res = await getAllSettlements(params);
      setSettlements(res.data?.settlements ?? []);
      setTotal(res.pagination?.total ?? 0);
    } catch {
      setError('목록 조회 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  }, [filterStatus, filterStreamerIdx, filterStartDate, filterEndDate]);

  useEffect(() => {
    if (subTab === 'pending') {
      loadPending();
    } else {
      loadAll();
    }
  }, [subTab, loadPending, loadAll]);

  const handleUpdated = () => {
    setSelectedSettlement(null);
    if (subTab === 'pending') loadPending();
    else loadAll();
  };

  const formatKRW = (v: number) => v.toLocaleString('ko-KR') + '원';
  const formatDate = (d: string | null) =>
    d ? new Date(d).toLocaleDateString('ko-KR') : '-';

  return (
    <div className="space-y-6">
      {/* 서브 탭 */}
      <div className="flex gap-1 bg-muted rounded-lg p-1 w-fit">
        {([
          { key: 'pending', label: '승인 대기' },
          { key: 'all', label: '전체 목록' },
        ] as const).map((t) => (
          <button
            key={t.key}
            onClick={() => setSubTab(t.key)}
            className={`px-5 py-2 rounded-md text-sm font-medium transition-all ${
              subTab === t.key
                ? 'bg-card text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* 전체 탭 필터 */}
      {subTab === 'all' && (
        <div className="bg-card border border-border rounded-lg p-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as SettlementStatus | '')}
              className="px-3 py-2 border border-border rounded-lg bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {STATUS_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
            <input
              type="number"
              placeholder="스트리머 IDX"
              value={filterStreamerIdx}
              onChange={(e) => setFilterStreamerIdx(e.target.value)}
              className="px-3 py-2 border border-border rounded-lg bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <input
              type="date"
              value={filterStartDate}
              onChange={(e) => setFilterStartDate(e.target.value)}
              className="px-3 py-2 border border-border rounded-lg bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <input
              type="date"
              value={filterEndDate}
              onChange={(e) => setFilterEndDate(e.target.value)}
              className="px-3 py-2 border border-border rounded-lg bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div className="mt-3 flex gap-2">
            <button
              onClick={loadAll}
              disabled={loading}
              className="px-5 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-colors text-sm font-medium"
            >
              {loading ? '조회 중...' : '조회'}
            </button>
            <button
              onClick={() => {
                setFilterStatus('');
                setFilterStreamerIdx('');
                setFilterStartDate('');
                setFilterEndDate('');
              }}
              className="px-4 py-2 border border-border rounded-lg text-sm text-muted-foreground hover:bg-accent transition-colors"
            >
              초기화
            </button>
          </div>
        </div>
      )}

      {error && (
        <p className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 rounded-lg px-4 py-2">
          {error}
        </p>
      )}

      {/* 목록 */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-border flex items-center justify-between">
          <h3 className="font-semibold text-foreground">
            {subTab === 'pending' ? '승인 대기 목록' : '전체 정산 목록'}
          </h3>
          <span className="text-sm text-muted-foreground">총 {total}건</span>
        </div>

        {loading ? (
          <div className="py-16 flex justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" />
          </div>
        ) : settlements.length === 0 ? (
          <div className="py-16 text-center text-muted-foreground">
            {subTab === 'pending' ? '승인 대기 중인 정산이 없습니다.' : '해당 조건의 정산 내역이 없습니다.'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/50 text-muted-foreground">
                  <th className="text-left px-4 py-3 font-medium">ID</th>
                  <th className="text-left px-4 py-3 font-medium">스트리머</th>
                  <th className="text-left px-4 py-3 font-medium">상태</th>
                  <th className="text-right px-4 py-3 font-medium">지급액</th>
                  <th className="text-left px-4 py-3 font-medium">지급 수단</th>
                  <th className="text-left px-4 py-3 font-medium">신청일</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {settlements.map((s) => (
                  <tr key={s.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs text-muted-foreground truncate max-w-[100px]">
                      {s.id}
                    </td>
                    <td className="px-4 py-3 text-foreground">{s.streamer_idx}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${STATUS_COLOR[s.status]}`}
                      >
                        {STATUS_LABEL[s.status]}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-medium">
                      {formatKRW(s.payout_amount)}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{s.payout_method || '-'}</td>
                    <td className="px-4 py-3 text-muted-foreground">{formatDate(s.created_at)}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => setSelectedSettlement(s)}
                        className="px-3 py-1 border border-border rounded text-xs hover:bg-accent transition-colors"
                      >
                        상세
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 상세 모달 */}
      {selectedSettlement && (
        <SettlementDetailModal
          settlement={selectedSettlement}
          onClose={() => setSelectedSettlement(null)}
          onUpdated={handleUpdated}
        />
      )}
    </div>
  );
}
