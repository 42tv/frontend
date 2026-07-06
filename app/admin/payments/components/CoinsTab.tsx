'use client';
import { useState } from 'react';
import DataTable, { Column } from '../../components-shared/ui/DataTable';
import DummyNotice from '../../components-shared/ui/DummyNotice';
import AdminModal from '../../components-shared/ui/AdminModal';
import { dummyCoinLedgers } from '../../_data/dummy';
import type { AdminCoinLedger } from '@/app/_types/admin-console';

type GrantMode = 'GRANT' | 'REVOKE';

interface GrantForm {
  mode: GrantMode;
  amount: string;
  reason: string;
}

const emptyForm: GrantForm = { mode: 'GRANT', amount: '', reason: '' };

export default function CoinsTab() {
  const [ledgers, setLedgers] = useState<AdminCoinLedger[]>(dummyCoinLedgers);
  const [target, setTarget] = useState<AdminCoinLedger | null>(null);
  const [form, setForm] = useState<GrantForm>(emptyForm);

  // 코인 수동 지급/회수 — 관리자 API(❌) 연동 지점. 사유 필수 + 감사 로그 기록 전제.
  const handleGrant = (): void => {
    const amount = Number(form.amount);
    if (!target || !form.reason.trim() || !Number.isFinite(amount) || amount <= 0) return;
    const delta = form.mode === 'GRANT' ? amount : -amount;
    setLedgers(
      ledgers.map((l) =>
        l.user_idx === target.user_idx ? { ...l, balance: Math.max(0, l.balance + delta) } : l,
      ),
    );
    console.info(`[코인 ${form.mode === 'GRANT' ? '지급' : '회수'}] user=${target.user_id} amount=${amount} reason=${form.reason.trim()}`);
    setTarget(null);
    setForm(emptyForm);
  };

  const columns: Column<AdminCoinLedger>[] = [
    {
      key: 'user',
      header: '유저',
      render: (l) => (
        <div>
          <div className="font-medium">{l.nickname}</div>
          <div className="text-xs text-muted-foreground font-mono">{l.user_id}</div>
        </div>
      ),
    },
    { key: 'balance', header: '보유 코인', render: (l) => <span className="font-semibold">{l.balance.toLocaleString()}</span> },
    { key: 'topup', header: '총 충전', render: (l) => l.total_topup.toLocaleString() },
    { key: 'usage', header: '총 사용', render: (l) => l.total_usage.toLocaleString() },
    { key: 'received', header: '총 수령', render: (l) => l.total_received.toLocaleString() },
    { key: 'last', header: '최근 활동', render: (l) => new Date(l.last_activity_at).toLocaleString('ko-KR') },
    {
      key: 'actions',
      header: '',
      render: (l) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setTarget(l);
            setForm(emptyForm);
          }}
          className="px-3 py-1 text-xs rounded-md border border-border text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
        >
          지급/회수
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <DummyNotice api="관리자 코인 잔액/이력 조회 · 수동 지급/회수 API" />

      <DataTable columns={columns} rows={ledgers} rowKey={(l) => l.user_idx} emptyMessage="코인 데이터가 없습니다" />

      <AdminModal
        open={target !== null}
        title={`코인 지급/회수 — ${target?.nickname ?? ''}`}
        onClose={() => setTarget(null)}
        maxWidthClass="max-w-md"
        footer={
          <>
            <button
              onClick={() => setTarget(null)}
              className="px-4 py-2 text-sm rounded-md border border-border text-muted-foreground hover:text-foreground"
            >
              취소
            </button>
            <button
              onClick={handleGrant}
              disabled={!form.reason.trim() || !form.amount || Number(form.amount) <= 0}
              className="px-4 py-2 text-sm font-medium rounded-md bg-primary text-primary-foreground disabled:opacity-50 hover:opacity-90 transition-opacity"
            >
              {form.mode === 'GRANT' ? '지급' : '회수'} 실행
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="flex gap-2">
            {(['GRANT', 'REVOKE'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setForm({ ...form, mode })}
                className={`flex-1 px-3 py-2 text-sm rounded-md border transition-colors ${
                  form.mode === mode
                    ? 'border-primary bg-primary text-primary-foreground font-medium'
                    : 'border-border text-muted-foreground hover:text-foreground'
                }`}
              >
                {mode === 'GRANT' ? '지급 (이벤트/CS 보상)' : '회수'}
              </button>
            ))}
          </div>
          <div className="space-y-1">
            <label className="text-sm text-muted-foreground">코인 수량</label>
            <input
              type="number"
              min={1}
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
              className="w-full px-3 py-2 text-sm rounded-md border border-border bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm text-muted-foreground">사유 (필수 — 감사 로그에 기록됩니다)</label>
            <textarea
              value={form.reason}
              onChange={(e) => setForm({ ...form, reason: e.target.value })}
              rows={2}
              className="w-full px-3 py-2 text-sm rounded-md border border-border bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none"
            />
          </div>
          <p className="text-xs text-muted-foreground">
            현재 보유: {target?.balance.toLocaleString()} 코인
          </p>
        </div>
      </AdminModal>
    </div>
  );
}
