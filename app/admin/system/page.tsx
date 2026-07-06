'use client';
import { useState } from 'react';
import PageHeader from '../components-shared/ui/PageHeader';
import DataTable, { Column } from '../components-shared/ui/DataTable';
import StatusBadge, { BadgeTone } from '../components-shared/ui/StatusBadge';
import DummyNotice from '../components-shared/ui/DummyNotice';
import { refreshPayoutAvailability } from '@/app/_apis/admin/payout-coin';
import { dummyAuditLogs, dummyInfraStatus, dummyUsers } from '../_data/dummy';
import type { AuditLog, HealthStatus } from '@/app/_types/admin-console';

const healthLabels: Record<HealthStatus, { label: string; tone: BadgeTone }> = {
  HEALTHY: { label: '정상', tone: 'green' },
  DEGRADED: { label: '성능 저하', tone: 'yellow' },
  DOWN: { label: '장애', tone: 'red' },
  UNKNOWN: { label: '미연동', tone: 'gray' },
};

export default function AdminSystemPage() {
  const [schedulerRunning, setSchedulerRunning] = useState<boolean>(false);
  const [schedulerResult, setSchedulerResult] = useState<string | null>(null);

  const adminUsers = dummyUsers.filter((u) => u.is_admin);

  // 출금 성숙도 갱신 수동 트리거 — 백엔드 API ✅ (payout-maturity 크론 비활성 상태 대응)
  const handleRunScheduler = async (): Promise<void> => {
    if (schedulerRunning) return;
    setSchedulerRunning(true);
    setSchedulerResult(null);
    try {
      const result = await refreshPayoutAvailability();
      setSchedulerResult(`실행 완료 — 대상 ${result.total}건 중 가용 전환 ${result.matured}건, 차단 ${result.blocked}건`);
    } catch {
      setSchedulerResult('실행에 실패했습니다. 백엔드 연결을 확인하세요.');
    } finally {
      setSchedulerRunning(false);
    }
  };

  const auditColumns: Column<AuditLog>[] = [
    { key: 'domain', header: '영역', render: (l) => <StatusBadge label={l.domain} tone="blue" /> },
    { key: 'action', header: '액션', render: (l) => <span className="font-mono text-xs">{l.action}</span> },
    { key: 'admin', header: '관리자', render: (l) => l.admin_nickname },
    { key: 'target', header: '대상', className: 'max-w-sm', render: (l) => <span className="line-clamp-1">{l.target}</span> },
    { key: 'reason', header: '사유', className: 'max-w-xs', render: (l) => <span className="line-clamp-1 text-muted-foreground">{l.reason ?? '-'}</span> },
    { key: 'created_at', header: '시각', render: (l) => new Date(l.created_at).toLocaleString('ko-KR') },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="시스템" description="인프라 상태 · 감사 로그 · 관리자 계정 · 스케줄러" />

      {/* 인프라 상태 */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-foreground">인프라 상태</h2>
        <DummyNotice api="Redis/NCP/본인인증 헬스체크 노출 API" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {dummyInfraStatus.map((item) => (
            <div key={item.name} className="bg-card border border-border rounded-lg p-4 flex items-start justify-between gap-2">
              <div>
                <div className="font-semibold text-foreground">{item.name}</div>
                <div className="text-xs text-muted-foreground">{item.description}</div>
                <div className="text-sm text-muted-foreground mt-1">{item.detail}</div>
              </div>
              <StatusBadge label={healthLabels[item.status].label} tone={healthLabels[item.status].tone} />
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">로그 상세 조회는 Graylog 대시보드를 이용하세요.</p>
      </section>

      {/* 스케줄러 수동 실행 (실 API ✅) */}
      <section className="bg-card border border-border rounded-lg p-6 space-y-3">
        <h2 className="text-lg font-semibold text-foreground">스케줄러 수동 실행</h2>
        <p className="text-sm text-muted-foreground">
          출금 성숙도 갱신 (WAITING → AVAILABLE) — payout-maturity 크론이 비활성 상태이므로 수동으로 트리거합니다.
        </p>
        <div className="flex items-center gap-3">
          <button
            onClick={handleRunScheduler}
            disabled={schedulerRunning}
            className="px-4 py-2 text-sm font-medium rounded-md bg-primary text-primary-foreground disabled:opacity-50 hover:opacity-90 transition-opacity"
          >
            {schedulerRunning ? '실행 중...' : '가용성 갱신 실행'}
          </button>
          {schedulerResult && <span className="text-sm text-foreground">{schedulerResult}</span>}
        </div>
      </section>

      {/* 관리자 계정 */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-foreground">관리자 계정</h2>
        <div className="bg-card border border-border rounded-lg divide-y divide-border">
          {adminUsers.map((u) => (
            <div key={u.idx} className="flex items-center justify-between px-4 py-3">
              <div>
                <span className="font-medium text-foreground">{u.nickname}</span>
                <span className="ml-2 text-xs text-muted-foreground font-mono">{u.user_id}</span>
              </div>
              <StatusBadge label="슈퍼관리자" tone="purple" />
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">
          현재는 is_admin 단일 권한 체계입니다. 역할 세분화(슈퍼관리자/운영자/CS/정산담당)와 2FA는 백엔드 개발 후 지원됩니다.
        </p>
      </section>

      {/* 감사 로그 */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-foreground">감사 로그</h2>
        <DummyNotice api="전 영역 감사 로그 API (현재 정산 SettlementAuditLog만 존재)" />
        <DataTable columns={auditColumns} rows={dummyAuditLogs} rowKey={(l) => l.id} emptyMessage="감사 로그가 없습니다" />
      </section>
    </div>
  );
}
