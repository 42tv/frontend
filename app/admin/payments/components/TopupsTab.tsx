'use client';
import { useCallback, useEffect, useState } from 'react';
import DataTable, { Column } from '../../components-shared/ui/DataTable';
import StatusBadge, { BadgeTone } from '../../components-shared/ui/StatusBadge';
import AdminModal from '../../components-shared/ui/AdminModal';
import { getAdminCoinTopups, refundCoinTopup } from '@/app/_apis/admin/coin-topup';
import type { AdminCoinTopup, TopupStatus, AdminCoinTopupListQuery } from '@/app/_types/coin-topup';

const PAGE_SIZE = 20;

const statusLabels: Record<TopupStatus, { label: string; tone: BadgeTone }> = {
  PENDING: { label: '대기', tone: 'gray' },
  COMPLETED: { label: '완료', tone: 'green' },
  FAILED: { label: '실패', tone: 'red' },
  REFUNDED: { label: '환불됨', tone: 'yellow' },
  REFUND_REQUESTED: { label: '환불 처리 중', tone: 'blue' },
  FROZEN: { label: '동결', tone: 'red' },
  REVOKED: { label: '회수됨', tone: 'gray' },
};

type StatusFilter = 'ALL' | TopupStatus;

const statusFilters: readonly StatusFilter[] = [
  'ALL',
  'COMPLETED',
  'PENDING',
  'REFUND_REQUESTED',
  'FAILED',
  'REFUNDED',
  'FROZEN',
  'REVOKED',
];

/**
 * 환불 상한 금액 — floor(결제액 × 잔여 코인 / 유료 코인 수).
 * 보너스 사용량은 목록 응답만으로 알 수 없어 차감 전 상한만 표시하고, 실제 환불액은 서버가 계산한다.
 */
function estimateMaxRefundAmount(topup: AdminCoinTopup): number {
  if (topup.coin_amount <= 0) return 0;
  return Math.floor((topup.paid_amount * topup.remaining_coins) / topup.coin_amount);
}

export default function TopupsTab() {
  const [topups, setTopups] = useState<AdminCoinTopup[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('ALL');
  const [searchInput, setSearchInput] = useState<string>('');
  const [search, setSearch] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);

  const [refundTarget, setRefundTarget] = useState<AdminCoinTopup | null>(null);
  const [refundReason, setRefundReason] = useState<string>('');
  const [refunding, setRefunding] = useState<boolean>(false);
  const [refundResult, setRefundResult] = useState<string | null>(null);

  const load = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError('');
    try {
      const params: AdminCoinTopupListQuery = { page, limit: PAGE_SIZE };
      if (statusFilter !== 'ALL') params.status = statusFilter;
      if (search) params.search = search;
      const res = await getAdminCoinTopups(params);
      setTopups(res.data?.topups ?? []);
      setTotalPages(res.pagination?.totalPages ?? 1);
      setTotal(res.pagination?.total ?? 0);
    } catch {
      setError('충전 내역 조회 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter, search]);

  useEffect(() => {
    load();
  }, [load]);

  const applySearch = (): void => {
    setPage(1);
    setSearch(searchInput.trim());
  };

  // 잔여 코인 부분 환불 — refunding 플래그로 이중 클릭 방지
  const handleRefund = async (): Promise<void> => {
    if (!refundTarget || !refundReason.trim() || refunding) return;
    setRefunding(true);
    setRefundResult(null);
    try {
      const res = await refundCoinTopup(refundTarget.id, refundReason.trim());
      const refunded = res.data;
      setRefundResult(
        refunded
          ? [
              `잔여 코인 ${refunded.refunded_coins.toLocaleString('ko-KR')}개 / ${refunded.refunded_amount.toLocaleString('ko-KR')}원 환불이 처리되었습니다.`,
              refunded.bonus_used_coins > 0 &&
                `보너스 사용분 ${refunded.bonus_used_coins.toLocaleString('ko-KR')}개가 환불액에서 차감되었습니다.`,
              refunded.revoked_bonus_coins > 0 &&
                `잔여 보너스 코인 ${refunded.revoked_bonus_coins.toLocaleString('ko-KR')}개가 회수되었습니다.`,
            ]
              .filter(Boolean)
              .join(' ')
          : res.message || '환불이 처리되었습니다.',
      );
      load();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : '환불 처리에 실패했습니다.';
      setRefundResult(`오류: ${message}`);
    } finally {
      setRefunding(false);
    }
  };

  const closeRefundModal = (): void => {
    setRefundTarget(null);
    setRefundReason('');
    setRefundResult(null);
  };

  const columns: Column<AdminCoinTopup>[] = [
    {
      key: 'user',
      header: '유저',
      render: (t) =>
        t.user ? (
          <div>
            <div className="font-medium">{t.user.nickname}</div>
            <div className="text-xs text-muted-foreground font-mono">{t.user.user_id}</div>
          </div>
        ) : (
          <span className="text-muted-foreground text-xs">탈퇴 유저</span>
        ),
    },
    { key: 'product', header: '상품', render: (t) => t.product_name },
    {
      key: 'paid',
      header: '결제 금액',
      render: (t) =>
        t.is_bonus ? (
          <span className="text-muted-foreground">-</span>
        ) : (
          <span className="font-semibold">{t.paid_amount.toLocaleString('ko-KR')}원</span>
        ),
    },
    {
      key: 'coins',
      header: '충전 코인',
      render: (t) => (
        <div className="flex items-center gap-1.5">
          <span className="font-medium">{t.coin_amount.toLocaleString('ko-KR')}</span>
          {t.is_bonus && <StatusBadge label="보너스" tone="blue" />}
        </div>
      ),
    },
    {
      key: 'usage',
      header: '사용 / 잔여',
      render: (t) => (
        <div className="text-sm">
          <span className="text-muted-foreground">
            {(t.coin_amount - t.remaining_coins - t.refunded_coins).toLocaleString('ko-KR')}
          </span>
          {' / '}
          <span className="font-semibold">{t.remaining_coins.toLocaleString('ko-KR')}</span>
          {t.refunded_coins > 0 && (
            <div className="text-xs text-muted-foreground">환불 {t.refunded_coins.toLocaleString('ko-KR')}</div>
          )}
        </div>
      ),
    },
    {
      key: 'status',
      header: '상태',
      render: (t) => <StatusBadge label={statusLabels[t.status].label} tone={statusLabels[t.status].tone} />,
    },
    {
      key: 'topped_up_at',
      header: '충전일',
      render: (t) => new Date(t.topped_up_at).toLocaleString('ko-KR'),
    },
    {
      key: 'actions',
      header: '',
      // 보너스 지급 건은 환불 대상이 아님 — 유료 건 환불 시 함께 회수됨
      render: (t) =>
        !t.is_bonus && t.status === 'COMPLETED' && t.remaining_coins > 0 ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setRefundTarget(t);
            }}
            className="px-2.5 py-1 text-xs rounded-md border border-destructive/50 text-destructive hover:bg-destructive/10 transition-colors"
          >
            환불
          </button>
        ) : null,
    },
  ];

  return (
    <div className="space-y-4">
      {/* 필터 영역 */}
      <div className="flex items-center gap-2 flex-wrap">
        {statusFilters.map((s) => (
          <button
            key={s}
            onClick={() => {
              setStatusFilter(s);
              setPage(1);
            }}
            className={`px-3 py-1.5 text-sm rounded-md border transition-colors ${
              statusFilter === s
                ? 'border-primary bg-primary text-primary-foreground font-medium'
                : 'border-border text-muted-foreground hover:text-foreground hover:bg-accent'
            }`}
          >
            {s === 'ALL' ? '전체' : statusLabels[s].label}
          </button>
        ))}
        <div className="flex items-center gap-2 ml-auto">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && applySearch()}
            placeholder="유저 ID, 닉네임 검색"
            className="w-56 px-3 py-2 text-sm rounded-md border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <button
            onClick={applySearch}
            className="px-4 py-2 text-sm rounded-md bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity"
          >
            검색
          </button>
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 rounded-lg px-4 py-3">{error}</p>
      )}

      {loading ? (
        <div className="py-16 flex justify-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" />
        </div>
      ) : (
        <>
          <DataTable columns={columns} rows={topups} rowKey={(t) => t.id} emptyMessage="충전 내역이 없습니다" />

          {/* 페이지네이션 */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">총 {total.toLocaleString('ko-KR')}건</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="px-3 py-1.5 text-sm rounded-md border border-border text-muted-foreground hover:text-foreground hover:bg-accent disabled:opacity-40 transition-colors"
              >
                이전
              </button>
              <span className="text-sm text-foreground">
                {page} / {Math.max(1, totalPages)}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="px-3 py-1.5 text-sm rounded-md border border-border text-muted-foreground hover:text-foreground hover:bg-accent disabled:opacity-40 transition-colors"
              >
                다음
              </button>
            </div>
          </div>
        </>
      )}

      {/* 잔여 코인 환불 모달 */}
      <AdminModal
        open={refundTarget !== null}
        title="잔여 코인 환불"
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
        {refundTarget && (
          <div className="space-y-4 text-sm">
            <p className="text-foreground">
              <span className="font-semibold">{refundTarget.user?.nickname ?? `#${refundTarget.user_idx}`}</span>님의{' '}
              <span className="font-semibold">{refundTarget.product_name}</span> 충전에서 사용하고 남은 코인을
              환불하시겠습니까?
            </p>
            <div className="rounded-md bg-muted/50 px-4 py-3 space-y-1.5">
              <div className="flex justify-between">
                <span className="text-muted-foreground">충전 코인</span>
                <span>{refundTarget.coin_amount.toLocaleString('ko-KR')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">사용 코인</span>
                <span>{(refundTarget.coin_amount - refundTarget.remaining_coins).toLocaleString('ko-KR')}</span>
              </div>
              <div className="flex justify-between font-semibold">
                <span>환불 대상 잔여 코인</span>
                <span>{refundTarget.remaining_coins.toLocaleString('ko-KR')}</span>
              </div>
              <div className="flex justify-between font-semibold text-destructive">
                <span>환불 상한 금액</span>
                <span>{estimateMaxRefundAmount(refundTarget).toLocaleString('ko-KR')}원</span>
              </div>
            </div>
            <p className="text-muted-foreground text-xs">
              Bootpay 부분 취소가 함께 실행되며, 중복 요청은 멱등성으로 방지됩니다. 보너스로 사용한 코인은 유료
              충전분에서 차감되어 실제 환불액은 상한 금액보다 적을 수 있고, 잔여 보너스 코인은 환불 시 회수됩니다.
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
            {refundResult && (
              <p className="text-sm text-foreground bg-muted/50 rounded-md px-3 py-2">{refundResult}</p>
            )}
          </div>
        )}
      </AdminModal>
    </div>
  );
}
