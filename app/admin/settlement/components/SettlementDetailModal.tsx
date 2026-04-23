'use client';
import { useState } from 'react';
import type { Settlement } from '@/app/_types/settlement';
import {
  approveSettlement,
  paySettlement,
  rejectSettlement,
} from '@/app/_apis/admin/settlement';

interface SettlementDetailModalProps {
  settlement: Settlement;
  onClose: () => void;
  onUpdated: () => void;
}

const STATUS_LABEL: Record<string, string> = {
  PENDING: '승인 대기',
  APPROVED: '승인됨',
  PAID: '지급 완료',
  REJECTED: '거절됨',
};

const STATUS_COLOR: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  APPROVED: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  PAID: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  REJECTED: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
};

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex justify-between py-2 border-b border-border last:border-0">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm text-foreground font-medium text-right">{value}</span>
    </div>
  );
}

export default function SettlementDetailModal({
  settlement,
  onClose,
  onUpdated,
}: SettlementDetailModalProps) {
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectInput, setShowRejectInput] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const formatDate = (d: string | null) =>
    d ? new Date(d).toLocaleString('ko-KR') : '-';

  const formatKRW = (v: number) => v.toLocaleString('ko-KR') + '원';

  const handleApprove = async () => {
    setLoading(true);
    setError('');
    try {
      await approveSettlement(settlement.id);
      onUpdated();
    } catch {
      setError('승인 처리 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handlePay = async () => {
    setLoading(true);
    setError('');
    try {
      await paySettlement(settlement.id);
      onUpdated();
    } catch {
      setError('지급 완료 처리 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) {
      setError('거절 사유를 입력하세요.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await rejectSettlement(settlement.id, rejectReason.trim());
      onUpdated();
    } catch {
      setError('거절 처리 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-card border border-border rounded-xl shadow-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-bold text-foreground">정산 상세</h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors text-xl leading-none"
          >
            ✕
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* 상태 배지 */}
          <div className="flex items-center gap-3">
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${STATUS_COLOR[settlement.status]}`}
            >
              {STATUS_LABEL[settlement.status]}
            </span>
            <span className="text-xs text-muted-foreground font-mono">{settlement.id}</span>
          </div>

          {/* 기본 정보 */}
          <div className="bg-background rounded-lg p-4">
            <InfoRow label="스트리머 IDX" value={settlement.streamer_idx} />
            <InfoRow
              label="정산 기간"
              value={`${formatDate(settlement.period_start)} ~ ${formatDate(settlement.period_end)}`}
            />
            <InfoRow label="총 금액" value={formatKRW(settlement.total_value)} />
            <InfoRow label="수수료" value={formatKRW(settlement.fee_amount)} />
            <InfoRow
              label="지급액"
              value={
                <span className="text-primary font-bold text-base">
                  {formatKRW(settlement.payout_amount)}
                </span>
              }
            />
            <InfoRow label="지급 수단" value={settlement.payout_method || '-'} />
            <InfoRow label="지급 계좌" value={settlement.payout_account || '-'} />
          </div>

          {/* 처리 이력 */}
          <div className="bg-background rounded-lg p-4">
            <InfoRow label="신청일" value={formatDate(settlement.created_at)} />
            <InfoRow label="승인일" value={formatDate(settlement.approved_at)} />
            <InfoRow label="지급일" value={formatDate(settlement.paid_at)} />
            <InfoRow label="거절일" value={formatDate(settlement.rejected_at)} />
            {settlement.reject_reason && (
              <InfoRow label="거절 사유" value={settlement.reject_reason} />
            )}
            {settlement.admin_memo && (
              <InfoRow label="관리자 메모" value={settlement.admin_memo} />
            )}
          </div>

          {/* 에러 메시지 */}
          {error && (
            <p className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 rounded-lg px-4 py-2">
              {error}
            </p>
          )}

          {/* 거절 사유 입력 */}
          {showRejectInput && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">거절 사유</label>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="거절 사유를 입력하세요..."
                rows={3}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleReject}
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 transition-colors text-sm font-medium"
                >
                  {loading ? '처리 중...' : '거절 확정'}
                </button>
                <button
                  onClick={() => {
                    setShowRejectInput(false);
                    setRejectReason('');
                    setError('');
                  }}
                  className="px-4 py-2 border border-border rounded-lg text-sm text-muted-foreground hover:bg-accent transition-colors"
                >
                  취소
                </button>
              </div>
            </div>
          )}

          {/* 액션 버튼 */}
          {!showRejectInput && (
            <div className="flex gap-2 pt-2">
              {settlement.status === 'PENDING' && (
                <>
                  <button
                    onClick={handleApprove}
                    disabled={loading}
                    className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-colors text-sm font-medium"
                  >
                    {loading ? '처리 중...' : '승인'}
                  </button>
                  <button
                    onClick={() => setShowRejectInput(true)}
                    disabled={loading}
                    className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 transition-colors text-sm font-medium"
                  >
                    거절
                  </button>
                </>
              )}
              {settlement.status === 'APPROVED' && (
                <button
                  onClick={handlePay}
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors text-sm font-medium"
                >
                  {loading ? '처리 중...' : '지급 완료'}
                </button>
              )}
              <button
                onClick={onClose}
                className="px-4 py-2 border border-border rounded-lg text-sm text-muted-foreground hover:bg-accent transition-colors"
              >
                닫기
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
