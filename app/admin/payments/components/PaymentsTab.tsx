'use client';
import { useMemo, useState } from 'react';
import DataTable, { Column } from '../../components-shared/ui/DataTable';
import StatusBadge, { BadgeTone } from '../../components-shared/ui/StatusBadge';
import DummyNotice from '../../components-shared/ui/DummyNotice';
import AdminModal from '../../components-shared/ui/AdminModal';
import { refundCoinTopup } from '@/app/_apis/admin/coin-topup';
import { dummyPayments } from '../../_data/dummy';
import type { AdminPaymentTransaction, PaymentStatus, PaymentMethod } from '@/app/_types/admin-console';

const statusLabels: Record<PaymentStatus, { label: string; tone: BadgeTone }> = {
  PENDING: { label: '대기', tone: 'gray' },
  WAITING_DEPOSIT: { label: '입금 대기', tone: 'yellow' },
  SUCCESS: { label: '성공', tone: 'green' },
  FAILED: { label: '실패', tone: 'red' },
  CANCELED: { label: '취소', tone: 'gray' },
  EXPIRED: { label: '만료', tone: 'gray' },
};

const methodLabels: Record<PaymentMethod, string> = {
  CARD: '카드',
  VBANK: '가상계좌',
  EASY_PAY: '간편결제',
};

type StatusFilter = 'ALL' | PaymentStatus;

export default function PaymentsTab() {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('ALL');
  const [refundTarget, setRefundTarget] = useState<AdminPaymentTransaction | null>(null);
  const [refundReason, setRefundReason] = useState<string>('');
  const [refunding, setRefunding] = useState<boolean>(false);
  const [refundResult, setRefundResult] = useState<string | null>(null);

  const filtered = useMemo(
    () => dummyPayments.filter((p) => statusFilter === 'ALL' || p.status === statusFilter),
    [statusFilter],
  );

  // 충전 환불 — 백엔드 API ✅ (Bootpay 취소 연동, 멱등성 보장)
  // refunding 플래그로 이중 클릭 방지 (§16-2)
  const handleRefund = async (): Promise<void> => {
    if (!refundTarget?.topup_id || !refundReason.trim() || refunding) return;
    setRefunding(true);
    setRefundResult(null);
    try {
      const result = await refundCoinTopup(refundTarget.topup_id, refundReason.trim());
      setRefundResult(result.message || '환불이 처리되었습니다.');
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : '환불 처리에 실패했습니다.';
      setRefundResult(`오류: ${message} (더미 데이터에서는 실제 topup_id가 없어 실패할 수 있습니다)`);
    } finally {
      setRefunding(false);
    }
  };

  const closeRefundModal = (): void => {
    setRefundTarget(null);
    setRefundReason('');
    setRefundResult(null);
  };

  const columns: Column<AdminPaymentTransaction>[] = [
    { key: 'tx', header: '트랜잭션', render: (p) => <span className="font-mono text-xs">{p.transaction_id}</span> },
    {
      key: 'user',
      header: '유저',
      render: (p) => (
        <div>
          <div className="font-medium">{p.nickname}</div>
          <div className="text-xs text-muted-foreground font-mono">{p.user_id}</div>
        </div>
      ),
    },
    { key: 'product', header: '상품', render: (p) => p.product_name },
    { key: 'amount', header: '금액', render: (p) => <span className="font-semibold">{p.amount.toLocaleString()}원</span> },
    { key: 'method', header: '수단', render: (p) => methodLabels[p.method] },
    { key: 'status', header: '상태', render: (p) => <StatusBadge label={statusLabels[p.status].label} tone={statusLabels[p.status].tone} /> },
    { key: 'created_at', header: '결제일', render: (p) => new Date(p.created_at).toLocaleString('ko-KR') },
    {
      key: 'actions',
      header: '',
      render: (p) => (
        <div className="flex gap-1.5">
          {p.receipt_url && (
            <a
              href={p.receipt_url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="px-2.5 py-1 text-xs rounded-md border border-border text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            >
              영수증
            </a>
          )}
          {p.status === 'SUCCESS' && p.topup_id !== null && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setRefundTarget(p);
              }}
              className="px-2.5 py-1 text-xs rounded-md border border-destructive/50 text-destructive hover:bg-destructive/10 transition-colors"
            >
              환불
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <DummyNotice api="관리자 결제 내역 조회 API (환불/실패 처리 API는 실제 연동됨)" />

      <div className="flex items-center gap-2 flex-wrap">
        {(['ALL', 'SUCCESS', 'WAITING_DEPOSIT', 'FAILED', 'CANCELED'] as const).map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-3 py-1.5 text-sm rounded-md border transition-colors ${
              statusFilter === s
                ? 'border-primary bg-primary text-primary-foreground font-medium'
                : 'border-border text-muted-foreground hover:text-foreground hover:bg-accent'
            }`}
          >
            {s === 'ALL' ? '전체' : statusLabels[s].label}
          </button>
        ))}
      </div>

      <DataTable columns={columns} rows={filtered} rowKey={(p) => p.id} emptyMessage="결제 내역이 없습니다" />

      {/* 환불 확인 모달 */}
      <AdminModal
        open={refundTarget !== null}
        title="충전 환불"
        onClose={closeRefundModal}
        maxWidthClass="max-w-md"
        footer={
          <>
            <button
              onClick={closeRefundModal}
              className="px-4 py-2 text-sm rounded-md border border-border text-muted-foreground hover:text-foreground"
            >
              닫기
            </button>
            <button
              onClick={handleRefund}
              disabled={!refundReason.trim() || refunding}
              className="px-4 py-2 text-sm font-medium rounded-md bg-destructive text-destructive-foreground disabled:opacity-50 hover:opacity-90 transition-opacity"
            >
              {refunding ? '처리 중...' : '환불 실행'}
            </button>
          </>
        }
      >
        <div className="space-y-4 text-sm">
          <p className="text-foreground">
            <span className="font-semibold">{refundTarget?.nickname}</span>님의{' '}
            <span className="font-semibold">{refundTarget?.amount.toLocaleString()}원</span> 충전을 환불하시겠습니까?
          </p>
          <p className="text-muted-foreground text-xs">
            Bootpay 결제 취소가 함께 실행되며, 중복 요청은 멱등성으로 방지됩니다.
          </p>
          <div className="space-y-1">
            <label className="text-muted-foreground">환불 사유 (필수)</label>
            <textarea
              value={refundReason}
              onChange={(e) => setRefundReason(e.target.value)}
              rows={2}
              className="w-full px-3 py-2 text-sm rounded-md border border-border bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none"
            />
          </div>
          {refundResult && <p className="text-sm text-foreground bg-muted/50 rounded-md px-3 py-2">{refundResult}</p>}
        </div>
      </AdminModal>
    </div>
  );
}
