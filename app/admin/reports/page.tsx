'use client';
import { useCallback, useEffect, useState } from 'react';
import DataTable, { Column } from '../components-shared/ui/DataTable';
import StatusBadge, { BadgeTone } from '../components-shared/ui/StatusBadge';
import AdminModal from '../components-shared/ui/AdminModal';
import PageHeader from '../components-shared/ui/PageHeader';
import {
  getAdminReport,
  getAdminReports,
  getPendingReportCount,
  resolveReport,
} from '@/app/_apis/admin/report';
import { extractAdminApiError } from '@/app/_apis/admin/user';
import type {
  ReportAction,
  ReportDetail,
  ReportListItem,
  ReportStatus,
  ReportTargetType,
  SanctionStatus,
  SanctionType,
} from '@/app/_types/admin-console';
import { notifyAdminPendingRefresh } from '../_hooks/useAdminPendingCounts';

const statusLabels: Record<ReportStatus, { label: string; tone: BadgeTone }> = {
  PENDING: { label: '접수', tone: 'red' },
  IN_REVIEW: { label: '처리 중', tone: 'yellow' },
  RESOLVED: { label: '완료', tone: 'green' },
  DISMISSED: { label: '기각', tone: 'gray' },
};

const targetLabels: Record<ReportTargetType, string> = {
  BROADCAST: '방송',
  CHAT: '채팅',
  PROFILE: '닉네임/프로필',
  POST: '쪽지',
  ARTICLE: '게시글',
};

const actionLabels: Record<ReportAction, string> = {
  DISMISS: '기각',
  WARN: '경고',
  END_BROADCAST: '방송 종료',
  SUSPEND: '계정 정지',
};

const sanctionTypeLabels: Record<SanctionType, string> = {
  ACCOUNT_SUSPEND: '계정 정지',
  BROADCAST_BAN: '방송 정지',
  WARNING: '경고',
};

const sanctionStatusLabels: Record<SanctionStatus, { label: string; tone: BadgeTone }> = {
  ACTIVE: { label: '활성', tone: 'red' },
  RELEASED: { label: '해제', tone: 'gray' },
  EXPIRED: { label: '만료', tone: 'gray' },
};

type StatusFilter = 'ALL' | ReportStatus;
type TargetFilter = 'ALL' | ReportTargetType;

const PAGE_SIZE = 20;

export default function AdminReportsPage() {
  const [reports, setReports] = useState<ReportListItem[]>([]);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('ALL');
  const [targetFilter, setTargetFilter] = useState<TargetFilter>('ALL');
  const [page, setPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [pendingCount, setPendingCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const [selected, setSelected] = useState<ReportListItem | null>(null);
  const [detail, setDetail] = useState<ReportDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState<boolean>(false);
  const [resolveReason, setResolveReason] = useState<string>('');
  const [resolveSubmitting, setResolveSubmitting] = useState<boolean>(false);
  const [resolveError, setResolveError] = useState<string>('');

  const load = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError('');
    try {
      const [result, pending] = await Promise.all([
        getAdminReports({
          status: statusFilter === 'ALL' ? undefined : statusFilter,
          targetType: targetFilter === 'ALL' ? undefined : targetFilter,
          page,
          limit: PAGE_SIZE,
        }),
        getPendingReportCount(),
      ]);
      setReports(result.reports);
      setTotal(result.pagination.total);
      setTotalPages(result.pagination.totalPages);
      setPendingCount(pending);
    } catch (err: unknown) {
      setError(extractAdminApiError(err, '신고 목록 조회 중 오류가 발생했습니다.'));
    } finally {
      setLoading(false);
    }
  }, [statusFilter, targetFilter, page]);

  useEffect(() => {
    load();
  }, [load]);

  const openDetail = async (report: ReportListItem): Promise<void> => {
    setSelected(report);
    setDetail(null);
    setResolveReason('');
    setResolveError('');
    setDetailLoading(true);
    try {
      const result = await getAdminReport(report.id);
      setDetail(result);
    } catch (err: unknown) {
      setResolveError(extractAdminApiError(err, '신고 상세 조회 중 오류가 발생했습니다.'));
    } finally {
      setDetailLoading(false);
    }
  };

  const closeDetail = (): void => {
    setSelected(null);
    setDetail(null);
  };

  // 처리 결과는 백엔드에서 피신고자 제재 이력·감사 로그에 자동 기록된다
  const handleResolve = async (action: ReportAction): Promise<void> => {
    if (!selected || !resolveReason.trim()) return;
    setResolveSubmitting(true);
    setResolveError('');
    try {
      await resolveReport(selected.id, action, resolveReason.trim());
      closeDetail();
      await load();
      notifyAdminPendingRefresh(); // 사이드바 미처리 뱃지 즉시 갱신
    } catch (err: unknown) {
      setResolveError(extractAdminApiError(err, '신고 처리 중 오류가 발생했습니다.'));
    } finally {
      setResolveSubmitting(false);
    }
  };

  const current: ReportDetail | ReportListItem | null = detail ?? selected;
  const resolvable: boolean =
    selected !== null && (selected.status === 'PENDING' || selected.status === 'IN_REVIEW');

  const columns: Column<ReportListItem>[] = [
    { key: 'id', header: 'ID', render: (r) => <span className="font-mono">#{r.id}</span> },
    { key: 'type', header: '유형', render: (r) => targetLabels[r.target_type] },
    {
      key: 'reported',
      header: '피신고자',
      render: (r) =>
        r.reported ? (
          <div>
            <div className="font-medium">{r.reported.nickname}</div>
            <div className="text-xs text-muted-foreground font-mono">{r.reported.user_id}</div>
          </div>
        ) : (
          <span className="text-muted-foreground">탈퇴한 사용자</span>
        ),
    },
    { key: 'reason', header: '사유', className: 'max-w-xs', render: (r) => <span className="line-clamp-1">{r.reason}</span> },
    {
      key: 'count',
      header: '누적 신고',
      render: (r) => (
        <span className={`font-semibold ${r.is_escalated ? 'text-destructive' : ''}`}>
          {r.report_count}건
          {r.is_escalated && <span className="ml-1 text-xs">⚠ 에스컬레이션</span>}
        </span>
      ),
    },
    { key: 'status', header: '상태', render: (r) => <StatusBadge label={statusLabels[r.status].label} tone={statusLabels[r.status].tone} /> },
    { key: 'created_at', header: '접수일', render: (r) => new Date(r.created_at).toLocaleString('ko-KR') },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="신고 센터"
        description="접수된 신고를 확인하고 처리합니다. 처리 액션은 제재 이력·감사 로그에 자동 기록됩니다."
      />

      {/* 필터 */}
      <div className="flex flex-wrap items-center gap-2">
        {(['ALL', 'PENDING', 'IN_REVIEW', 'RESOLVED', 'DISMISSED'] as const).map((s) => (
          <button
            key={s}
            onClick={() => { setStatusFilter(s); setPage(1); }}
            className={`px-3 py-1.5 text-sm rounded-md border transition-colors ${
              statusFilter === s
                ? 'border-primary bg-primary text-primary-foreground font-medium'
                : 'border-border text-muted-foreground hover:text-foreground hover:bg-accent'
            }`}
          >
            {s === 'ALL' ? '전체' : statusLabels[s].label}
            {s === 'PENDING' && <span className="ml-1.5 text-xs">({pendingCount})</span>}
          </button>
        ))}

        <select
          value={targetFilter}
          onChange={(e) => { setTargetFilter(e.target.value as TargetFilter); setPage(1); }}
          className="ml-2 px-3 py-1.5 text-sm rounded-md border border-border bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
        >
          <option value="ALL">전체 유형</option>
          {(Object.entries(targetLabels) as [ReportTargetType, string][]).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>

        <span className="text-sm text-muted-foreground ml-auto">총 {total.toLocaleString()}건</span>
      </div>

      {error && (
        <p className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 rounded-md px-4 py-3">{error}</p>
      )}

      {loading ? (
        <div className="py-16 flex justify-center bg-card border border-border rounded-lg">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" />
        </div>
      ) : (
        <DataTable
          columns={columns}
          rows={reports}
          rowKey={(r) => r.id}
          onRowClick={openDetail}
          emptyMessage="신고 내역이 없습니다"
        />
      )}

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1 || loading}
            className="px-3 py-1.5 text-sm rounded-md border border-border text-foreground hover:bg-accent disabled:opacity-40 transition-colors"
          >
            이전
          </button>
          <span className="text-sm text-muted-foreground">{page} / {totalPages}</span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages || loading}
            className="px-3 py-1.5 text-sm rounded-md border border-border text-foreground hover:bg-accent disabled:opacity-40 transition-colors"
          >
            다음
          </button>
        </div>
      )}

      {/* 신고 상세 + 처리 */}
      <AdminModal
        open={selected !== null}
        title={`신고 상세 #${selected?.id ?? ''}`}
        onClose={closeDetail}
        footer={
          resolvable ? (
            <div className="flex flex-wrap gap-2">
              {(['DISMISS', 'WARN', 'END_BROADCAST', 'SUSPEND'] as const).map((action) => (
                <button
                  key={action}
                  onClick={() => handleResolve(action)}
                  disabled={resolveSubmitting || detailLoading || !resolveReason.trim()}
                  className={`px-3 py-2 text-sm font-medium rounded-md transition-opacity hover:opacity-90 disabled:opacity-50 ${
                    action === 'DISMISS'
                      ? 'border border-border text-muted-foreground hover:text-foreground'
                      : 'bg-destructive text-destructive-foreground'
                  }`}
                >
                  {actionLabels[action]}
                </button>
              ))}
            </div>
          ) : undefined
        }
      >
        {current && (
          <div className="space-y-4 text-sm">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-muted-foreground">신고 유형</div>
                <div className="font-medium text-foreground">
                  {targetLabels[current.target_type]}
                  {current.target_ref && (
                    <span className="ml-1.5 text-xs text-muted-foreground font-mono">({current.target_ref})</span>
                  )}
                </div>
              </div>
              <div>
                <div className="text-muted-foreground">상태</div>
                <StatusBadge label={statusLabels[current.status].label} tone={statusLabels[current.status].tone} />
              </div>
              <div>
                <div className="text-muted-foreground">신고자</div>
                <div className="font-medium text-foreground">
                  {current.reporter ? (
                    <>
                      {current.reporter.nickname}{' '}
                      <span className="text-xs text-muted-foreground font-mono">({current.reporter.user_id})</span>
                    </>
                  ) : (
                    '탈퇴한 사용자'
                  )}
                </div>
              </div>
              <div>
                <div className="text-muted-foreground">피신고자</div>
                <div className="font-medium text-foreground">
                  {current.reported ? (
                    <>
                      {current.reported.nickname}{' '}
                      <span className="text-xs text-muted-foreground font-mono">({current.reported.user_id})</span>
                    </>
                  ) : (
                    '탈퇴한 사용자'
                  )}
                </div>
              </div>
            </div>

            <div>
              <div className="text-muted-foreground">신고 사유</div>
              <div className="text-foreground whitespace-pre-wrap">{current.reason}</div>
            </div>

            <div>
              <div className="text-muted-foreground">증거 자료</div>
              {current.evidence ? (
                <pre className="mt-1 px-3 py-2 text-xs rounded-md border border-border bg-background text-foreground overflow-x-auto">
                  {JSON.stringify(current.evidence, null, 2)}
                </pre>
              ) : (
                <div className="text-foreground">없음</div>
              )}
            </div>

            {current.resolve_action && (
              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-border">
                <div>
                  <div className="text-muted-foreground">처리 결과</div>
                  <div className="font-medium text-foreground">{actionLabels[current.resolve_action]}</div>
                </div>
                {current.resolved_at && (
                  <div>
                    <div className="text-muted-foreground">처리일</div>
                    <div className="text-foreground">{new Date(current.resolved_at).toLocaleString('ko-KR')}</div>
                  </div>
                )}
                {current.resolve_reason && (
                  <div className="col-span-2">
                    <div className="text-muted-foreground">처리 사유</div>
                    <div className="text-foreground whitespace-pre-wrap">{current.resolve_reason}</div>
                  </div>
                )}
              </div>
            )}

            {/* 피신고자 제재 이력 */}
            <div className="pt-2 border-t border-border">
              <div className="text-muted-foreground mb-1.5">피신고자 제재 이력</div>
              {detailLoading ? (
                <div className="py-3 flex justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary" />
                </div>
              ) : detail && detail.reported_sanctions.length > 0 ? (
                <div className="space-y-1.5">
                  {detail.reported_sanctions.map((sanction) => (
                    <div
                      key={sanction.id}
                      className="flex items-center justify-between gap-3 px-3 py-2 rounded-md border border-border bg-background"
                    >
                      <div className="min-w-0">
                        <span className="font-medium text-foreground">{sanctionTypeLabels[sanction.type]}</span>
                        <span className="ml-2 text-xs text-muted-foreground line-clamp-1 inline">{sanction.reason}</span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <StatusBadge
                          label={sanctionStatusLabels[sanction.status].label}
                          tone={sanctionStatusLabels[sanction.status].tone}
                        />
                        <span className="text-xs text-muted-foreground">
                          {new Date(sanction.created_at).toLocaleDateString('ko-KR')}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-foreground">제재 이력이 없습니다.</div>
              )}
            </div>

            {resolvable && (
              <div className="pt-2 border-t border-border">
                <div className="text-muted-foreground mb-1.5">처리 사유 (필수)</div>
                <textarea
                  value={resolveReason}
                  maxLength={1000}
                  onChange={(e) => setResolveReason(e.target.value)}
                  rows={3}
                  disabled={detailLoading || resolveSubmitting}
                  placeholder="처리 사유를 입력하세요 — 제재 이력·감사 로그에 기록됩니다"
                  className="w-full px-3 py-2.5 text-sm rounded-md border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-y disabled:opacity-50"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  경고/계정 정지는 제재 이력에 자동 기록되고, 방송 종료는 해당 방송을 즉시 강제 종료합니다.
                </p>
              </div>
            )}

            {resolveError && <p className="text-xs text-red-500">{resolveError}</p>}
          </div>
        )}
      </AdminModal>
    </div>
  );
}
