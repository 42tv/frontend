'use client';
import { useState } from 'react';
import DataTable, { Column } from '../../components-shared/ui/DataTable';
import StatusBadge, { BadgeTone } from '../../components-shared/ui/StatusBadge';
import DummyNotice from '../../components-shared/ui/DummyNotice';
import AdminModal from '../../components-shared/ui/AdminModal';
import { dummySanctions } from '../../_data/dummy';
import type { Sanction, SanctionType } from '@/app/_types/admin-console';

const typeLabels: Record<SanctionType, { label: string; tone: BadgeTone }> = {
  ACCOUNT_SUSPEND: { label: '계정 정지', tone: 'red' },
  BROADCAST_BAN: { label: '방송 정지', tone: 'purple' },
  WARNING: { label: '경고', tone: 'gray' },
};

interface NewSanctionForm {
  userId: string;
  type: SanctionType;
  reason: string;
}

const emptyForm: NewSanctionForm = { userId: '', type: 'BROADCAST_BAN', reason: '' };

export default function SanctionsTab() {
  const [sanctions, setSanctions] = useState<Sanction[]>(dummySanctions);
  const [showNewModal, setShowNewModal] = useState<boolean>(false);
  const [form, setForm] = useState<NewSanctionForm>(emptyForm);

  // 제재 등록 — 관리자 제재 API(❌) 연동 지점. 현재는 로컬 상태에만 반영.
  const handleCreate = (): void => {
    if (!form.userId.trim() || !form.reason.trim()) return;
    const now = new Date();
    const newSanction: Sanction = {
      id: Math.max(0, ...sanctions.map((s) => s.id)) + 1,
      user_idx: 0,
      user_id: form.userId.trim(),
      nickname: form.userId.trim(),
      type: form.type,
      reason: form.reason.trim(),
      admin_nickname: '나',
      starts_at: now.toISOString(),
      status: 'ACTIVE',
      created_at: now.toISOString(),
    };
    setSanctions([newSanction, ...sanctions]);
    setForm(emptyForm);
    setShowNewModal(false);
  };

  // 제재 해제 — 관리자 제재 해제 API(❌) 연동 지점
  const handleRelease = (id: number): void => {
    setSanctions(sanctions.map((s) => (s.id === id ? { ...s, status: 'RELEASED' } : s)));
  };

  const columns: Column<Sanction>[] = [
    {
      key: 'user',
      header: '대상',
      render: (s) => (
        <div>
          <div className="font-medium">{s.nickname}</div>
          <div className="text-xs text-muted-foreground font-mono">{s.user_id}</div>
        </div>
      ),
    },
    { key: 'type', header: '유형', render: (s) => <StatusBadge label={typeLabels[s.type].label} tone={typeLabels[s.type].tone} /> },
    { key: 'reason', header: '사유', className: 'max-w-xs', render: (s) => <span className="line-clamp-2">{s.reason}</span> },
    { key: 'admin', header: '처리자', render: (s) => s.admin_nickname },
    {
      key: 'status',
      header: '상태',
      render: (s) =>
        s.status === 'ACTIVE'
          ? <StatusBadge label="적용 중" tone="red" />
          : s.status === 'RELEASED'
            ? <StatusBadge label="해제됨" tone="gray" />
            : <StatusBadge label="만료" tone="gray" />,
    },
    {
      key: 'actions',
      header: '',
      render: (s) =>
        s.status === 'ACTIVE' && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleRelease(s.id);
            }}
            className="px-3 py-1 text-xs rounded-md border border-border text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
          >
            해제
          </button>
        ),
    },
  ];

  return (
    <div className="space-y-4">
      <DummyNotice api="회원 제재 API (제재 등록/해제/이력, 활성 세션 강제 종료)" />

      <div className="flex justify-end">
        <button
          onClick={() => setShowNewModal(true)}
          className="px-4 py-2 text-sm font-medium rounded-md bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
        >
          + 제재 등록
        </button>
      </div>

      <DataTable columns={columns} rows={sanctions} rowKey={(s) => s.id} emptyMessage="제재 이력이 없습니다" />

      <AdminModal
        open={showNewModal}
        title="제재 등록"
        onClose={() => setShowNewModal(false)}
        maxWidthClass="max-w-md"
        footer={
          <>
            <button
              onClick={() => setShowNewModal(false)}
              className="px-4 py-2 text-sm rounded-md border border-border text-muted-foreground hover:text-foreground"
            >
              취소
            </button>
            <button
              onClick={handleCreate}
              disabled={!form.userId.trim() || !form.reason.trim()}
              className="px-4 py-2 text-sm font-medium rounded-md bg-destructive text-destructive-foreground disabled:opacity-50 hover:opacity-90 transition-opacity"
            >
              제재 적용
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm text-muted-foreground">대상 user_id</label>
            <input
              type="text"
              value={form.userId}
              onChange={(e) => setForm({ ...form, userId: e.target.value })}
              className="w-full px-3 py-2 text-sm rounded-md border border-border bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm text-muted-foreground">제재 유형</label>
            <select
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value as SanctionType })}
              className="w-full px-3 py-2 text-sm rounded-md border border-border bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="BROADCAST_BAN">방송 권한 정지</option>
              <option value="ACCOUNT_SUSPEND">계정 정지</option>
              <option value="WARNING">경고</option>
            </select>
            <p className="text-xs text-muted-foreground">
              제재는 관리자가 해제하기 전까지 유지됩니다.
            </p>
          </div>
          <div className="space-y-1">
            <label className="text-sm text-muted-foreground">사유 (필수, 감사 로그 기록)</label>
            <textarea
              value={form.reason}
              onChange={(e) => setForm({ ...form, reason: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 text-sm rounded-md border border-border bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none"
            />
          </div>
          <p className="text-xs text-muted-foreground">
            제재 적용 시 대상 유저의 활성 세션/소켓이 강제 종료됩니다. (Redis Pub/Sub 전파)
          </p>
        </div>
      </AdminModal>
    </div>
  );
}
