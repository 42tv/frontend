'use client';
import DataTable, { Column } from '../../components-shared/ui/DataTable';
import StatusBadge from '../../components-shared/ui/StatusBadge';
import DummyNotice from '../../components-shared/ui/DummyNotice';
import { dummyTerms } from '../../_data/dummy';
import type { AdminTerms } from '@/app/_types/admin-console';

export default function TermsTab() {
  const columns: Column<AdminTerms>[] = [
    { key: 'version', header: '버전', render: (t) => <span className="font-mono font-semibold">v{t.version}</span> },
    { key: 'title', header: '제목', render: (t) => t.title },
    { key: 'effective', header: '시행일', render: (t) => new Date(t.effective_at).toLocaleDateString('ko-KR') },
    { key: 'agreed', header: '동의 수', render: (t) => `${t.agreed_count.toLocaleString()}명` },
    {
      key: 'active',
      header: '상태',
      render: (t) =>
        t.is_active ? <StatusBadge label="시행 중" tone="green" /> : <StatusBadge label="이전 버전" tone="gray" />,
    },
    { key: 'created_at', header: '등록일', render: (t) => new Date(t.created_at).toLocaleDateString('ko-KR') },
  ];

  return (
    <div className="space-y-4">
      <DummyNotice api="약관(Terms) 관리자 CRUD API — Terms/UserTerms 모델은 존재" />

      <div className="flex justify-end">
        <button
          disabled
          title="약관 관리자 API 연동 후 활성화됩니다"
          className="px-4 py-2 text-sm font-medium rounded-md bg-primary text-primary-foreground opacity-60 cursor-not-allowed"
        >
          + 새 버전 등록
        </button>
      </div>

      <DataTable columns={columns} rows={dummyTerms} rowKey={(t) => t.id} emptyMessage="등록된 약관이 없습니다" />

      <p className="text-xs text-muted-foreground">
        새 버전 등록 시 기존 버전은 이전 버전으로 전환되며, 유저 동의 이력(UserTerms)은 버전별로 보존됩니다.
      </p>
    </div>
  );
}
