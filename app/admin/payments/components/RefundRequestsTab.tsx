'use client';
import { useCallback, useEffect, useState } from 'react';
import DataTable, { Column } from '../../components-shared/ui/DataTable';
import StatusBadge, { BadgeTone } from '../../components-shared/ui/StatusBadge';
import AdminModal from '../../components-shared/ui/AdminModal';
import { getAdminRefundRequests, approveRefundRequest, rejectRefundRequest } from '@/app/_apis/admin/coin-topup';
import { notifyAdminPendingRefresh } from '../../_hooks/useAdminPendingCounts';
import type { AdminRefundRequest, RefundRequestStatus, AdminRefundRequestListQuery } from '@/app/_types/coin-topup';

const PAGE_SIZE = 20;

const statusLabels: Record<RefundRequestStatus, { label: string; tone: BadgeTone }> = {
  PENDING: { label: '승인 대기', tone: 'yellow' },
  APPROVED: { label: '환불 완료', tone: 'green' },
  REJECTED: { label: '거절됨', tone: 'red' },
  CANCELED: { label: '사용자 취소', tone: 'gray' },
};

type StatusFilter = 'ALL' | RefundRequestStatus;

const statusFilters: readonly StatusFilter[] = ['ALL', 'PENDING', 'APPROVED', 'REJECTED', 'CANCELED'];

/** 접수 후 경과 시간 — 전자상거래법상 3영업일 내 환급 의무가 있어 대기시간을 노출한다 */
function formatWaitingTime(requestedAt: string): string {
  const elapsedMs = Date.now() - new Date(requestedAt).getTime();
  if (elapsedMs < 0) return '-';
  const hours = Math.floor(elapsedMs / (60 * 60 * 1000));
  if (hours < 1) return `${Math.max(1, Math.floor(elapsedMs / (60 * 1000)))}분`;
  if (hours < 24) return `${hours}시간`;
  return `${Math.floor(hours / 24)}일 ${hours % 24}시간`;
}

function extractErrorMessage(err: unknown, fallback: string): string {
  const message = (err as { response?: { data?: { message?: string | string[] } } })?.response?.data?.message;
  return (Array.isArray(message) ? message.join('\n') : message) || fallback;
}

export default function RefundRequestsTab() {
  const [requests, setRequests] = useState<AdminRefundRequest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('PENDING');
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);

  // 승인/거절 모달 상태 — 성공 시 모달을 닫고 successMessage 배너로 결과를 알린다
  const [approveTarget, setApproveTarget] = useState<AdminRefundRequest | null>(null);
  const [rejectTarget, setRejectTarget] = useState<AdminRefundRequest | null>(null);
  const [rejectReason, setRejectReason] = useState<string>('');
  const [processing, setProcessing] = useState<boolean>(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const load = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError('');
    try {
      const params: AdminRefundRequestListQuery = { page, limit: PAGE_SIZE };
      if (statusFilter !== 'ALL') params.status = statusFilter;
      const res = await getAdminRefundRequests(params);
      // 서버는 오래 대기한 순(오름차순)으로 내려주지만 화면은 최신 요청이 위로 오도록 재정렬
      const sorted = [...(res.data?.requests ?? [])].sort(
        (a, b) => new Date(b.requested_at).getTime() - new Date(a.requested_at).getTime(),
      );
      setRequests(sorted);
      setTotalPages(res.pagination?.totalPages ?? 1);
      setTotal(res.pagination?.total ?? 0);
    } catch {
      setError('환불 요청 목록 조회 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter]);

  useEffect(() => {
    load();
  }, [load]);

  const closeApproveModal = (): void => {
    setApproveTarget(null);
    setActionError(null);
  };

  const closeRejectModal = (): void => {
    setRejectTarget(null);
    setRejectReason('');
    setActionError(null);
  };

  // 승인 — 성공 시 모달을 닫는다. PG 취소 실패 시 요청은 PENDING으로 유지되므로 모달을 유지해 재시도 가능
  const handleApprove = async (): Promise<void> => {
    if (!approveTarget || processing) return;
    setProcessing(true);
    setActionError(null);
    try {
      const res = await approveRefundRequest(approveTarget.id);
      const refunded = res.data;
      setSuccessMessage(
        refunded
          ? `${refunded.refunded_coins.toLocaleString('ko-KR')}코인 / ${refunded.refunded_amount.toLocaleString('ko-KR')}원 환불이 완료되었습니다.`
          : res.message || '환불 요청을 승인했습니다.',
      );
      closeApproveModal();
      notifyAdminPendingRefresh();
      load();
    } catch (err: unknown) {
      setActionError(extractErrorMessage(err, '환불 승인에 실패했습니다.'));
    } finally {
      setProcessing(false);
    }
  };

  // 거절 — 사유 필수, 성공 시 모달을 닫는다. 충전 건은 다시 사용 가능 상태로 복원되고 사유가 사용자에게 노출됨
  const handleReject = async (): Promise<void> => {
    if (!rejectTarget || !rejectReason.trim() || processing) return;
    setProcessing(true);
    setActionError(null);
    try {
      const res = await rejectRefundRequest(rejectTarget.id, rejectReason.trim());
      setSuccessMessage(res.message || '환불 요청을 거절했습니다.');
      closeRejectModal();
      notifyAdminPendingRefresh();
      load();
    } catch (err: unknown) {
      setActionError(extractErrorMessage(err, '환불 거절에 실패했습니다.'));
    } finally {
      setProcessing(false);
    }
  };

  const columns: Column<AdminRefundRequest>[] = [
    {
      key: 'user',
      header: '유저',
      render: (r) =>
        r.user ? (
          <div>
            <div className="font-medium">{r.user.nickname}</div>
            <div className="text-xs text-muted-foreground font-mono">{r.user.user_id}</div>
          </div>
        ) : (
          <span className="text-muted-foreground text-xs">탈퇴 유저</span>
        ),
    },
    {
      key: 'topup',
      header: '충전 건',
      render: (r) => (
        <div>
          <div>{r.topup.product_name}</div>
          <div className="text-xs text-muted-foreground">
            결제 {r.topup.paid_amount.toLocaleString('ko-KR')}원 · {new Date(r.topup.topped_up_at).toLocaleDateString('ko-KR')}
          </div>
        </div>
      ),
    },
    {
      key: 'refund',
      header: '환불 대상',
      render: (r) => (
        <div>
          <div className="font-medium">{r.remaining_coins.toLocaleString('ko-KR')}코인</div>
          <div className="text-xs text-muted-foreground">예상 {r.expected_amount.toLocaleString('ko-KR')}원</div>
        </div>
      ),
    },
    {
      key: 'reason',
      header: '사유',
      render: (r) => (
        <div className="max-w-[220px]">
          <div className="text-sm truncate" title={r.user_reason ?? undefined}>
            {r.user_reason || <span className="text-muted-foreground">-</span>}
          </div>
          {r.status === 'REJECTED' && r.reject_reason && (
            <div className="text-xs text-destructive truncate" title={r.reject_reason}>
              거절: {r.reject_reason}
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'requested_at',
      header: '요청일 / 대기',
      render: (r) => (
        <div>
          <div className="text-sm">{new Date(r.requested_at).toLocaleString('ko-KR')}</div>
          {r.status === 'PENDING' && (
            <div className="text-xs font-medium text-yellow-600 dark:text-yellow-400">
              대기 {formatWaitingTime(r.requested_at)}
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'status',
      header: '상태',
      render: (r) => <StatusBadge label={statusLabels[r.status].label} tone={statusLabels[r.status].tone} />,
    },
    {
      key: 'actions',
      header: '',
      render: (r) =>
        r.status === 'PENDING' ? (
          <div className="flex items-center gap-1.5">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setApproveTarget(r);
              }}
              className="px-2.5 py-1 text-xs rounded-md bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
            >
              승인
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setRejectTarget(r);
              }}
              className="px-2.5 py-1 text-xs rounded-md border border-destructive/50 text-destructive hover:bg-destructive/10 transition-colors"
            >
              거절
            </button>
          </div>
        ) : null,
    },
  ];

  return (
    <div className="space-y-4">
      {/* 상태 필터 — 접수 후 3영업일 내 환급 의무가 있어 기본은 승인 대기 */}
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
      </div>

      {error && (
        <p className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 rounded-lg px-4 py-3">{error}</p>
      )}

      {/* 승인/거절 처리 결과 배너 */}
      {successMessage && (
        <div className="flex items-center justify-between text-sm text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/20 rounded-lg px-4 py-3">
          <span>{successMessage}</span>
          <button
            onClick={() => setSuccessMessage(null)}
            className="ml-4 text-green-700 dark:text-green-400 hover:opacity-70 transition-opacity"
            aria-label="닫기"
          >
            ×
          </button>
        </div>
      )}

      {loading ? (
        <div className="py-16 flex justify-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" />
        </div>
      ) : (
        <>
          <DataTable columns={columns} rows={requests} rowKey={(r) => r.id} emptyMessage="환불 요청이 없습니다" />

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

      {/* 승인 모달 — 실제 환불(PG 취소) 실행 */}
      <AdminModal
        open={approveTarget !== null}
        title="환불 요청 승인"
        onClose={closeApproveModal}
        maxWidthClass="max-w-md"
        footer={
          <>
            <button
              onClick={closeApproveModal}
              className="px-4 py-2 text-sm rounded-md border border-border text-muted-foreground hover:text-foreground"
            >
              닫기
            </button>
            <button
              onClick={handleApprove}
              disabled={processing}
              className="px-4 py-2 text-sm font-medium rounded-md bg-primary text-primary-foreground disabled:opacity-50 hover:opacity-90 transition-opacity"
            >
              {processing ? '처리 중...' : '승인 및 환불 실행'}
            </button>
          </>
        }
      >
        {approveTarget && (
          <div className="space-y-4 text-sm">
            <p className="text-foreground">
              <span className="font-semibold">{approveTarget.user?.nickname ?? `#${approveTarget.user_idx}`}</span>님의{' '}
              <span className="font-semibold">{approveTarget.topup.product_name}</span> 환불 요청을 승인하시겠습니까?
            </p>
            <div className="rounded-md bg-muted/50 px-4 py-3 space-y-1.5">
              <div className="flex justify-between">
                <span className="text-muted-foreground">환불 대상 코인</span>
                <span>{approveTarget.remaining_coins.toLocaleString('ko-KR')}</span>
              </div>
              <div className="flex justify-between font-semibold">
                <span>예상 환불 금액</span>
                <span>{approveTarget.expected_amount.toLocaleString('ko-KR')}원</span>
              </div>
              {approveTarget.user_reason && (
                <div className="flex justify-between gap-4">
                  <span className="text-muted-foreground shrink-0">요청 사유</span>
                  <span className="text-right">{approveTarget.user_reason}</span>
                </div>
              )}
            </div>
            <p className="text-muted-foreground text-xs">
              승인 즉시 Bootpay 취소(실제 환불)가 실행됩니다. PG 취소에 실패하면 요청은 승인 대기 상태로 유지되어
              재시도할 수 있습니다.
            </p>
            {actionError && (
              <p className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 rounded-md px-3 py-2 whitespace-pre-line">
                {actionError}
              </p>
            )}
          </div>
        )}
      </AdminModal>

      {/* 거절 모달 — 사유 필수 */}
      <AdminModal
        open={rejectTarget !== null}
        title="환불 요청 거절"
        onClose={closeRejectModal}
        maxWidthClass="max-w-md"
        footer={
          <>
            <button
              onClick={closeRejectModal}
              className="px-4 py-2 text-sm rounded-md border border-border text-muted-foreground hover:text-foreground"
            >
              닫기
            </button>
            <button
              onClick={handleReject}
              disabled={!rejectReason.trim() || processing}
              className="px-4 py-2 text-sm font-medium rounded-md bg-destructive text-destructive-foreground disabled:opacity-50 hover:opacity-90 transition-opacity"
            >
              {processing ? '처리 중...' : '거절'}
            </button>
          </>
        }
      >
        {rejectTarget && (
          <div className="space-y-4 text-sm">
            <p className="text-foreground">
              <span className="font-semibold">{rejectTarget.user?.nickname ?? `#${rejectTarget.user_idx}`}</span>님의{' '}
              <span className="font-semibold">{rejectTarget.topup.product_name}</span> 환불 요청을 거절하시겠습니까?
            </p>
            <p className="text-muted-foreground text-xs">
              거절 시 충전 건은 다시 사용 가능 상태로 복원되며, 입력한 사유가 사용자에게 그대로 노출됩니다.
            </p>
            <div className="space-y-1">
              <label className="text-muted-foreground">거절 사유 (필수)</label>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                rows={3}
                placeholder="예: 부정거래 의심으로 확인이 필요합니다."
                className="w-full px-3 py-2 text-sm rounded-md border border-border bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none"
              />
            </div>
            {actionError && (
              <p className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 rounded-md px-3 py-2 whitespace-pre-line">
                {actionError}
              </p>
            )}
          </div>
        )}
      </AdminModal>
    </div>
  );
}
