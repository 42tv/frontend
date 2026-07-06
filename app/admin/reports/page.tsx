'use client';
import { useMemo, useState } from 'react';
import DataTable, { Column } from '../components-shared/ui/DataTable';
import StatusBadge, { BadgeTone } from '../components-shared/ui/StatusBadge';
import DummyNotice from '../components-shared/ui/DummyNotice';
import AdminModal from '../components-shared/ui/AdminModal';
import { dummyReports } from '../_data/dummy';
import type { Report, ReportStatus, ReportTargetType, ReportAction } from '@/app/_types/admin-console';

const statusLabels: Record<ReportStatus, { label: string; tone: BadgeTone }> = {
  RECEIVED: { label: '접수', tone: 'red' },
  IN_PROGRESS: { label: '처리 중', tone: 'yellow' },
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

// 동일 대상 반복 신고 에스컬레이션 임계치 (§6)
const ESCALATION_THRESHOLD = 10;

type StatusFilter = 'ALL' | ReportStatus;

export default function AdminReportsPage() {
  const [reports, setReports] = useState<Report[]>(dummyReports);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('ALL');
  const [selected, setSelected] = useState<Report | null>(null);

  const filtered = useMemo(
    () => reports.filter((r) => statusFilter === 'ALL' || r.status === statusFilter),
    [reports, statusFilter],
  );

  // 신고 처리 — 신고 처리 API(❌) 연동 지점. 처리 결과는 제재 이력에 자동 기록되어야 함.
  const handleResolve = (action: ReportAction): void => {
    if (!selected) return;
    setReports(
      reports.map((r) =>
        r.id === selected.id
          ? { ...r, status: action === 'DISMISS' ? 'DISMISSED' : 'RESOLVED', resolved_action: action }
          : r,
      ),
    );
    setSelected(null);
  };

  const columns: Column<Report>[] = [
    { key: 'type', header: '유형', render: (r) => targetLabels[r.target_type] },
    {
      key: 'reported',
      header: '피신고자',
      render: (r) => (
        <div>
          <div className="font-medium">{r.reported_nickname}</div>
          <div className="text-xs text-muted-foreground font-mono">{r.reported_user_id}</div>
        </div>
      ),
    },
    { key: 'reason', header: '사유', className: 'max-w-xs', render: (r) => <span className="line-clamp-1">{r.reason}</span> },
    {
      key: 'count',
      header: '누적 신고',
      render: (r) => (
        <span className={`font-semibold ${r.report_count >= ESCALATION_THRESHOLD ? 'text-destructive' : ''}`}>
          {r.report_count}건
          {r.report_count >= ESCALATION_THRESHOLD && <span className="ml-1 text-xs">⚠ 에스컬레이션</span>}
        </span>
      ),
    },
    { key: 'status', header: '상태', render: (r) => <StatusBadge label={statusLabels[r.status].label} tone={statusLabels[r.status].tone} /> },
    { key: 'created_at', header: '접수일', render: (r) => new Date(r.created_at).toLocaleString('ko-KR') },
  ];

  return (
    <div className="space-y-6">

      <DummyNotice api="신고 시스템 API (신고 접수/목록/처리 — 신규 개발)" />

      <div className="flex items-center gap-2">
        {(['ALL', 'RECEIVED', 'IN_PROGRESS', 'RESOLVED', 'DISMISSED'] as const).map((s) => (
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
            {s === 'RECEIVED' && (
              <span className="ml-1.5 text-xs">({reports.filter((r) => r.status === 'RECEIVED').length})</span>
            )}
          </button>
        ))}
      </div>

      <DataTable columns={columns} rows={filtered} rowKey={(r) => r.id} onRowClick={setSelected} emptyMessage="신고 내역이 없습니다" />

      {/* 신고 상세 + 처리 */}
      <AdminModal
        open={selected !== null}
        title={`신고 상세 #${selected?.id ?? ''}`}
        onClose={() => setSelected(null)}
        footer={
          selected && (selected.status === 'RECEIVED' || selected.status === 'IN_PROGRESS') ? (
            <div className="flex flex-wrap gap-2">
              {(['DISMISS', 'WARN', 'END_BROADCAST', 'SUSPEND'] as const).map((action) => (
                <button
                  key={action}
                  onClick={() => handleResolve(action)}
                  className={`px-3 py-2 text-sm font-medium rounded-md transition-opacity hover:opacity-90 ${
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
        {selected && (
          <div className="space-y-4 text-sm">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-muted-foreground">신고 유형</div>
                <div className="font-medium text-foreground">{targetLabels[selected.target_type]}</div>
              </div>
              <div>
                <div className="text-muted-foreground">상태</div>
                <StatusBadge label={statusLabels[selected.status].label} tone={statusLabels[selected.status].tone} />
              </div>
              <div>
                <div className="text-muted-foreground">신고자</div>
                <div className="font-medium text-foreground">{selected.reporter_nickname}</div>
              </div>
              <div>
                <div className="text-muted-foreground">피신고자</div>
                <div className="font-medium text-foreground">
                  {selected.reported_nickname} <span className="text-xs text-muted-foreground font-mono">({selected.reported_user_id})</span>
                </div>
              </div>
            </div>
            <div>
              <div className="text-muted-foreground">신고 사유</div>
              <div className="font-medium text-foreground">{selected.reason}</div>
            </div>
            <div>
              <div className="text-muted-foreground">상세 내용</div>
              <div className="text-foreground">{selected.detail}</div>
            </div>
            <div>
              <div className="text-muted-foreground">증거 자료</div>
              <div className="text-foreground">{selected.evidence ?? '없음'}</div>
            </div>
            {selected.resolved_action && (
              <div>
                <div className="text-muted-foreground">처리 결과</div>
                <div className="font-medium text-foreground">{actionLabels[selected.resolved_action]}</div>
              </div>
            )}
            <p className="text-xs text-muted-foreground pt-2 border-t border-border">
              처리 액션(경고/방송 종료/계정 정지)은 피신고자 제재 이력에 자동 기록됩니다.
            </p>
          </div>
        )}
      </AdminModal>
    </div>
  );
}
