'use client';
import { useMemo, useState } from 'react';
import DataTable, { Column } from '../components-shared/ui/DataTable';
import StatusBadge, { BadgeTone } from '../components-shared/ui/StatusBadge';
import DummyNotice from '../components-shared/ui/DummyNotice';
import { dummySettlementAccounts } from '../_data/dummy';
import type { SettlementAccount, AccountVerifyStatus, BusinessType } from '@/app/_types/admin-console';

const verifyLabels: Record<AccountVerifyStatus, { label: string; tone: BadgeTone }> = {
  UNVERIFIED: { label: '미검증', tone: 'gray' },
  PENDING: { label: '검증 대기', tone: 'yellow' },
  VERIFIED: { label: '검증 완료', tone: 'green' },
  FAILED: { label: '검증 실패', tone: 'red' },
  REVOKED: { label: '철회됨', tone: 'purple' },
};

const businessLabels: Record<BusinessType, string> = {
  INDIVIDUAL: '개인',
  SOLE_PROPRIETOR: '개인사업자',
  CORPORATION: '법인',
};

type VerifyFilter = 'ALL' | AccountVerifyStatus;

export default function AdminSettlementAccountsPage() {
  const [accounts, setAccounts] = useState<SettlementAccount[]>(dummySettlementAccounts);
  const [filter, setFilter] = useState<VerifyFilter>('ALL');

  const filtered = useMemo(
    () => accounts.filter((a) => filter === 'ALL' || a.verify_status === filter),
    [accounts, filter],
  );

  // 계좌 검증 승인/거절/철회 — 관리자 계좌 검증 API(🔧) 연동 지점
  const handleVerifyAction = (id: number, status: AccountVerifyStatus): void => {
    setAccounts(accounts.map((a) => (a.id === id ? { ...a, verify_status: status } : a)));
  };

  const columns: Column<SettlementAccount>[] = [
    { key: 'streamer', header: '스트리머', render: (a) => <span className="font-medium">{a.streamer_nickname}</span> },
    { key: 'bank', header: '은행', render: (a) => a.bank_name },
    { key: 'account', header: '계좌번호', render: (a) => <span className="font-mono">{a.account_number_masked}</span> },
    { key: 'holder', header: '예금주', render: (a) => a.holder_name_masked },
    {
      key: 'business',
      header: '사업자 유형',
      render: (a) => businessLabels[a.business_type],
    },
    {
      key: 'verify',
      header: '검증 상태',
      render: (a) => <StatusBadge label={verifyLabels[a.verify_status].label} tone={verifyLabels[a.verify_status].tone} />,
    },
    { key: 'created_at', header: '등록일', render: (a) => new Date(a.created_at).toLocaleDateString('ko-KR') },
    {
      key: 'actions',
      header: '조치',
      render: (a) => (
        <div className="flex gap-1.5">
          {a.verify_status === 'PENDING' && (
            <>
              <button
                onClick={() => handleVerifyAction(a.id, 'VERIFIED')}
                className="px-2.5 py-1 text-xs rounded-md bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
              >
                승인
              </button>
              <button
                onClick={() => handleVerifyAction(a.id, 'FAILED')}
                className="px-2.5 py-1 text-xs rounded-md border border-destructive/50 text-destructive hover:bg-destructive/10 transition-colors"
              >
                거절
              </button>
            </>
          )}
          {a.verify_status === 'VERIFIED' && (
            <button
              onClick={() => handleVerifyAction(a.id, 'REVOKED')}
              className="px-2.5 py-1 text-xs rounded-md border border-border text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            >
              철회
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">

      <DummyNotice api="관리자 정산 계좌 조회/검증 승인·거절·철회 API" />

      <div className="flex items-center gap-2 flex-wrap">
        {(['ALL', 'PENDING', 'VERIFIED', 'FAILED', 'REVOKED', 'UNVERIFIED'] as const).map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-3 py-1.5 text-sm rounded-md border transition-colors ${
              filter === s
                ? 'border-primary bg-primary text-primary-foreground font-medium'
                : 'border-border text-muted-foreground hover:text-foreground hover:bg-accent'
            }`}
          >
            {s === 'ALL' ? '전체' : verifyLabels[s].label}
          </button>
        ))}
      </div>

      <DataTable columns={columns} rows={filtered} rowKey={(a) => a.id} emptyMessage="등록된 정산 계좌가 없습니다" />

      <p className="text-xs text-muted-foreground">
        사업자 유형(개인/개인사업자/법인)별 원천징수 처리는 docs/세금관련.md를 참조하세요.
      </p>
    </div>
  );
}
