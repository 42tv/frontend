'use client';
import { useMemo } from 'react';
import DataTable, { Column } from '../../components-shared/ui/DataTable';
import StatusBadge from '../../components-shared/ui/StatusBadge';
import StatCard from '../../components-shared/ui/StatCard';
import DummyNotice from '../../components-shared/ui/DummyNotice';
import { dummyUsers } from '../../_data/dummy';
import type { AdminUserSummary } from '@/app/_types/admin-console';

export default function VerificationTab() {
  const stats = useMemo(() => {
    const total = dummyUsers.length;
    const identity = dummyUsers.filter((u) => u.is_identity_verified).length;
    const adult = dummyUsers.filter((u) => u.is_adult_verified).length;
    return {
      total,
      identity,
      adult,
      rate: total > 0 ? Math.round((identity / total) * 100) : 0,
    };
  }, []);

  const columns: Column<AdminUserSummary>[] = [
    { key: 'user_id', header: '아이디', render: (u) => <span className="font-mono">{u.user_id}</span> },
    { key: 'nickname', header: '닉네임', render: (u) => u.nickname },
    {
      key: 'identity',
      header: '본인인증 (CI 해시)',
      render: (u) =>
        u.is_identity_verified
          ? <StatusBadge label="인증 완료" tone="green" />
          : <StatusBadge label="미인증" tone="gray" />,
    },
    {
      key: 'adult',
      header: '성인인증',
      render: (u) =>
        u.is_adult_verified
          ? <StatusBadge label="인증 완료" tone="blue" />
          : <StatusBadge label="미인증" tone="gray" />,
    },
    { key: 'created_at', header: '가입일', render: (u) => new Date(u.created_at).toLocaleDateString('ko-KR') },
  ];

  return (
    <div className="space-y-4">
      <DummyNotice api="본인인증 연동 상태/이력 조회 관리자 API" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="전체 회원" value={stats.total.toLocaleString()} color="blue" />
        <StatCard title="본인인증 완료" value={stats.identity.toLocaleString()} color="green" />
        <StatCard title="성인인증 완료" value={stats.adult.toLocaleString()} color="purple" />
        <StatCard title="본인인증 전환율" value={`${stats.rate}%`} color="yellow" />
      </div>

      <DataTable columns={columns} rows={dummyUsers} rowKey={(u) => u.idx} />

      <p className="text-xs text-muted-foreground">
        주민등록번호는 수집하지 않으며, 본인확인은 CI 해시만 사용합니다 (§16-1).
      </p>
    </div>
  );
}
