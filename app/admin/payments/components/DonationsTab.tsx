'use client';
import { useMemo, useState } from 'react';
import DataTable, { Column } from '../../components-shared/ui/DataTable';
import StatusBadge from '../../components-shared/ui/StatusBadge';
import DummyNotice from '../../components-shared/ui/DummyNotice';
import { dummyDonations } from '../../_data/dummy';
import type { AdminDonation } from '@/app/_types/admin-console';

export default function DonationsTab() {
  const [suspiciousOnly, setSuspiciousOnly] = useState<boolean>(false);
  const [search, setSearch] = useState<string>('');

  const filtered = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    return dummyDonations.filter((d) => {
      if (suspiciousOnly && !d.is_suspicious) return false;
      if (
        keyword &&
        !d.donor_id.toLowerCase().includes(keyword) &&
        !d.streamer_id.toLowerCase().includes(keyword) &&
        !d.donor_nickname.toLowerCase().includes(keyword) &&
        !d.streamer_nickname.toLowerCase().includes(keyword)
      ) {
        return false;
      }
      return true;
    });
  }, [search, suspiciousOnly]);

  const columns: Column<AdminDonation>[] = [
    {
      key: 'donor',
      header: '후원자',
      render: (d) => (
        <div>
          <div className="font-medium">{d.donor_nickname}</div>
          <div className="text-xs text-muted-foreground font-mono">{d.donor_id}</div>
        </div>
      ),
    },
    {
      key: 'streamer',
      header: '스트리머',
      render: (d) => (
        <div>
          <div className="font-medium">{d.streamer_nickname}</div>
          <div className="text-xs text-muted-foreground font-mono">{d.streamer_id}</div>
        </div>
      ),
    },
    { key: 'coins', header: '코인', render: (d) => <span className="font-semibold">{d.coin_amount.toLocaleString()}</span> },
    { key: 'krw', header: '환산 가치', render: (d) => `${d.krw_value.toLocaleString()}원` },
    {
      key: 'message',
      header: '메시지',
      className: 'max-w-xs',
      render: (d) => <span className="line-clamp-1 text-muted-foreground">{d.message ?? '-'}</span>,
    },
    {
      key: 'suspicious',
      header: '이상 거래',
      render: (d) =>
        d.is_suspicious
          ? <StatusBadge label="⚠ 의심" tone="red" />
          : <StatusBadge label="정상" tone="green" />,
    },
    { key: 'created_at', header: '후원 시각', render: (d) => new Date(d.created_at).toLocaleString('ko-KR') },
  ];

  return (
    <div className="space-y-4">
      <DummyNotice api="관리자 후원 내역 조회 · 이상 거래 탐지 API" />

      <div className="flex items-center gap-3">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="후원자, 스트리머 검색"
          className="w-64 px-3 py-2 text-sm rounded-md border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
        />
        <label className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
          <input
            type="checkbox"
            checked={suspiciousOnly}
            onChange={(e) => setSuspiciousOnly(e.target.checked)}
            className="rounded border-border"
          />
          이상 거래만 보기
        </label>
      </div>

      <DataTable columns={columns} rows={filtered} rowKey={(d) => d.id} emptyMessage="후원 내역이 없습니다" />

      <p className="text-xs text-muted-foreground">
        이상 거래: 단기간 고액 반복 후원, 환불 직전 대량 후원(정산 악용) 패턴을 탐지합니다. 후원 메시지 신고는 신고 센터에서 처리합니다.
      </p>
    </div>
  );
}
