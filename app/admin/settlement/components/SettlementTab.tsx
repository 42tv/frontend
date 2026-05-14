'use client';
import { useState, useEffect, useCallback } from 'react';
import type { Settlement, SettlementStatus } from '@/app/_types/settlement';
import {
  getPendingSettlements,
  getAllSettlements,
  approveSettlement,
  rejectSettlement,
  paySettlement,
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

const INPUT_CLS =
  'px-3 py-2 border border-border rounded-lg bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary';

function formatKRW(v: number) {
  return v.toLocaleString('ko-KR') + '원';
}

function formatDate(d: string | null) {
  if (!d) return '-';
  return new Date(d).toLocaleDateString('ko-KR');
}

// ── 승인 대기 행 ─────────────────────────────────────────────────────────────

interface PendingRowProps {
  settlement: Settlement;
  onDetail: () => void;
  onDone: () => void;
}

function PendingRow({ settlement: s, onDetail, onDone }: PendingRowProps) {
  const [rejectOpen, setRejectOpen] = useState(false);
  const [reason, setReason] = useState('');
  const [processing, setProcessing] = useState(false);
  const [rowError, setRowError] = useState('');

  const handleApprove = async () => {
    if (!confirm(`스트리머 ${s.streamer_idx}의 정산 ${formatKRW(s.payout_amount)}을 승인하시겠습니까?`)) return;
    setProcessing(true);
    setRowError('');
    try {
      await approveSettlement(s.id);
      onDone();
    } catch {
      setRowError('승인 처리 중 오류가 발생했습니다.');
    } finally {
      setProcessing(false);
    }
  };

  const handleRejectSubmit = async () => {
    if (!reason.trim()) { setRowError('거절 사유를 입력하세요.'); return; }
    setProcessing(true);
    setRowError('');
    try {
      await rejectSettlement(s.id, reason.trim());
      onDone();
    } catch {
      setRowError('거절 처리 중 오류가 발생했습니다.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <>
      <tr className="hover:bg-muted/30 transition-colors">
        <td className="px-4 py-3.5 text-sm text-foreground">
          {s.streamer
            ? <>{s.streamer.nickname}<span className="text-muted-foreground ml-1">({s.streamer.user_id})</span></>
            : `#${s.streamer_idx}`}
        </td>
        <td className="px-4 py-3.5">
          <p className="font-semibold text-foreground text-sm">{formatKRW(s.payout_amount)}</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            총 {formatKRW(s.total_value)} · 수수료 {formatKRW(s.fee_amount)}
          </p>
        </td>
        <td className="px-4 py-3.5 text-sm text-muted-foreground">{formatDate(s.requested_at)}</td>
        <td className="px-4 py-3.5">
          <div className="flex items-center gap-2">
            <button
              onClick={handleApprove}
              disabled={processing}
              className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 disabled:opacity-40 transition-colors"
            >
              승인
            </button>
            <button
              onClick={() => { setRejectOpen((v) => !v); setRowError(''); }}
              disabled={processing}
              className="px-3 py-1.5 rounded-lg bg-red-500 text-white text-xs font-semibold hover:bg-red-600 disabled:opacity-40 transition-colors"
            >
              거절
            </button>
            <button
              onClick={onDetail}
              className="px-3 py-1.5 rounded-lg border border-border text-xs text-muted-foreground hover:bg-accent transition-colors"
            >
              상세
            </button>
          </div>
        </td>
      </tr>

      {/* 거절 사유 입력 행 */}
      {rejectOpen && (
        <tr className="bg-red-50 dark:bg-red-900/10">
          <td colSpan={4} className="px-4 py-3">
            <div className="flex items-start gap-2">
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="거절 사유를 입력하세요..."
                rows={2}
                className="flex-1 px-3 py-2 border border-red-300 dark:border-red-800 rounded-lg bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-red-400 resize-none"
              />
              <div className="flex flex-col gap-1.5 shrink-0">
                <button
                  onClick={handleRejectSubmit}
                  disabled={processing}
                  className="px-4 py-2 rounded-lg bg-red-500 text-white text-xs font-semibold hover:bg-red-600 disabled:opacity-40 transition-colors"
                >
                  {processing ? '처리 중...' : '거절 확정'}
                </button>
                <button
                  onClick={() => { setRejectOpen(false); setReason(''); setRowError(''); }}
                  className="px-4 py-2 rounded-lg border border-border text-xs text-muted-foreground hover:bg-accent transition-colors"
                >
                  취소
                </button>
              </div>
            </div>
            {rowError && (
              <p className="mt-1.5 text-xs text-red-500">{rowError}</p>
            )}
          </td>
        </tr>
      )}
    </>
  );
}

// ── 메인 컴포넌트 ─────────────────────────────────────────────────────────────

export default function SettlementTab() {
  const [subTab, setSubTab] = useState<SubTab>('pending');
  const [settlements, setSettlements] = useState<Settlement[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [filterStatus, setFilterStatus] = useState<SettlementStatus | ''>('');
  const [filterStreamerIdx, setFilterStreamerIdx] = useState('');
  const [filterStartDate, setFilterStartDate] = useState('');
  const [filterEndDate, setFilterEndDate] = useState('');

  const [selectedSettlement, setSelectedSettlement] = useState<Settlement | null>(null);

  // 전체 탭 내 지급 완료 처리 중 ID 추적
  const [payingId, setPayingId] = useState<string | null>(null);

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
    if (subTab === 'pending') loadPending();
    else loadAll();
  }, [subTab, loadPending, loadAll]);

  const handleUpdated = () => {
    setSelectedSettlement(null);
    if (subTab === 'pending') loadPending();
    else loadAll();
  };

  const handlePay = async (s: Settlement) => {
    if (!confirm(`스트리머 ${s.streamer_idx}의 ${formatKRW(s.payout_amount)}을 지급 완료 처리하시겠습니까?`)) return;
    setPayingId(s.id);
    try {
      await paySettlement(s.id);
      loadAll();
    } catch {
      setError('지급 처리 중 오류가 발생했습니다.');
    } finally {
      setPayingId(null);
    }
  };

  return (
    <div className="space-y-5">
      {/* 서브 탭 */}
      <div className="flex gap-1 bg-muted rounded-lg p-1 w-fit">
        {([
          { key: 'pending', label: '승인 대기' },
          { key: 'all', label: '전체 목록' },
        ] as const).map((t) => (
          <button
            key={t.key}
            onClick={() => setSubTab(t.key)}
            className={`px-5 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${
              subTab === t.key
                ? 'bg-card text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {t.label}
            {t.key === 'pending' && total > 0 && subTab === 'pending' && (
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold">
                {total}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* 전체 탭 필터 */}
      {subTab === 'all' && (
        <div className="bg-card border border-border rounded-xl p-5">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">필터</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as SettlementStatus | '')}
              className={INPUT_CLS}
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
              className={INPUT_CLS}
            />
            <input type="date" value={filterStartDate} onChange={(e) => setFilterStartDate(e.target.value)} className={INPUT_CLS} />
            <input type="date" value={filterEndDate} onChange={(e) => setFilterEndDate(e.target.value)} className={INPUT_CLS} />
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
              onClick={() => { setFilterStatus(''); setFilterStreamerIdx(''); setFilterStartDate(''); setFilterEndDate(''); }}
              className="px-4 py-2 border border-border rounded-lg text-sm text-muted-foreground hover:bg-accent transition-colors"
            >
              초기화
            </button>
          </div>
        </div>
      )}

      {error && (
        <p className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 rounded-xl px-4 py-3">
          {error}
        </p>
      )}

      {/* 목록 */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
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
          <div className="py-16 text-center">
            <p className="text-muted-foreground text-sm">
              {subTab === 'pending' ? '승인 대기 중인 정산이 없습니다.' : '해당 조건의 정산 내역이 없습니다.'}
            </p>
          </div>
        ) : subTab === 'pending' ? (
          /* 승인 대기 — 인라인 액션 테이블 */
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/50 text-muted-foreground text-xs uppercase tracking-wide">
                  <th className="text-left px-4 py-3 font-medium">스트리머</th>
                  <th className="text-left px-4 py-3 font-medium">지급액</th>
                  <th className="text-left px-4 py-3 font-medium">신청일</th>
                  <th className="px-4 py-3 font-medium text-left">처리</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {settlements.map((s) => (
                  <PendingRow
                    key={s.id}
                    settlement={s}
                    onDetail={() => setSelectedSettlement(s)}
                    onDone={loadPending}
                  />
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          /* 전체 목록 — 상태 + 지급 완료 처리 테이블 */
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/50 text-muted-foreground text-xs uppercase tracking-wide">
                  <th className="text-left px-4 py-3 font-medium">스트리머</th>
                  <th className="text-left px-4 py-3 font-medium">상태</th>
                  <th className="text-right px-4 py-3 font-medium">지급액</th>
                  <th className="text-left px-4 py-3 font-medium">신청일</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {settlements.map((s) => (
                  <tr key={s.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3.5 text-sm text-foreground">
                      {s.streamer
                        ? <>{s.streamer.nickname}<span className="text-muted-foreground ml-1">({s.streamer.user_id})</span></>
                        : `#${s.streamer_idx}`}
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${STATUS_COLOR[s.status]}`}>
                        {STATUS_LABEL[s.status]}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-right font-semibold text-foreground">
                      {formatKRW(s.payout_amount)}
                    </td>
                    <td className="px-4 py-3.5 text-muted-foreground">{formatDate(s.requested_at)}</td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2 justify-end">
                        {s.status === 'APPROVED' && (
                          <button
                            onClick={() => handlePay(s)}
                            disabled={payingId === s.id}
                            className="px-3 py-1.5 rounded-lg bg-green-600 text-white text-xs font-semibold hover:bg-green-700 disabled:opacity-40 transition-colors"
                          >
                            {payingId === s.id ? '처리 중...' : '지급 완료'}
                          </button>
                        )}
                        <button
                          onClick={() => setSelectedSettlement(s)}
                          className="px-3 py-1.5 rounded-lg border border-border text-xs text-muted-foreground hover:bg-accent transition-colors"
                        >
                          상세
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

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
