'use client';
import DataTable, { Column } from '../../components-shared/ui/DataTable';
import StatusBadge, { BadgeTone } from '../../components-shared/ui/StatusBadge';
import DummyNotice from '../../components-shared/ui/DummyNotice';
import { dummyChannels } from '../../_data/dummy';
import type { AdminChannel, NcpChannelStatus } from '@/app/_types/admin-console';

const ncpStatusLabels: Record<NcpChannelStatus, { label: string; tone: BadgeTone }> = {
  CREATING: { label: '생성 중', tone: 'yellow' },
  READY: { label: '대기', tone: 'blue' },
  PUBLISHING: { label: '송출 중', tone: 'green' },
  DISABLED: { label: '비활성', tone: 'gray' },
  DELETED: { label: '삭제됨', tone: 'red' },
};

const formatHours = (minutes: number): string => `${Math.floor(minutes / 60).toLocaleString()}시간`;

export default function ChannelsTab() {
  const columns: Column<AdminChannel>[] = [
    {
      key: 'channel',
      header: '채널',
      render: (c) => (
        <div>
          <div className="font-medium">{c.title}</div>
          <div className="text-xs text-muted-foreground font-mono">{c.user_id}</div>
        </div>
      ),
    },
    { key: 'bookmark', header: '북마크', render: (c) => c.bookmark_cnt.toLocaleString() },
    { key: 'recommend', header: '추천', render: (c) => c.recommend_cnt.toLocaleString() },
    { key: 'play', header: '시청 수', render: (c) => c.play_cnt.toLocaleString() },
    { key: 'time', header: '누적 방송', render: (c) => formatHours(c.total_time) },
    {
      key: 'ncp',
      header: 'NCP 채널',
      render: (c) => (
        <div className="flex items-center gap-2">
          <StatusBadge label={ncpStatusLabels[c.ncp_status].label} tone={ncpStatusLabels[c.ncp_status].tone} />
          <span className="text-xs text-muted-foreground font-mono">{c.ncp_channel_id}</span>
        </div>
      ),
    },
    {
      key: 'actions',
      header: '조치',
      render: () => (
        <div className="flex gap-1.5">
          {['스트림 키 재발급', '채널 재생성'].map((label) => (
            <button
              key={label}
              disabled
              title="NCP 채널 관리자 API 연동 후 활성화됩니다"
              onClick={(e) => e.stopPropagation()}
              className="px-2.5 py-1 text-xs rounded-md border border-border text-muted-foreground opacity-60 cursor-not-allowed whitespace-nowrap"
            >
              {label}
            </button>
          ))}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <DummyNotice api="관리자 채널 목록/NCP 채널 관리 API (스트림 키 재발급, 채널 재생성)" />
      <DataTable columns={columns} rows={dummyChannels} rowKey={(c) => c.idx} emptyMessage="채널이 없습니다" />
      <p className="text-xs text-muted-foreground">
        스트림 키 재발급은 유출 대응용, 채널 강제 재생성/삭제는 장애 대응용입니다. AWS IVS 모듈은 비활성 상태이며 NCP Live Station 기준으로만 동작합니다.
      </p>
    </div>
  );
}
