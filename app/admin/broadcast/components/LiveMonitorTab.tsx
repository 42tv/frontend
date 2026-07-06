'use client';
import { useState } from 'react';
import DataTable, { Column } from '../../components-shared/ui/DataTable';
import StatusBadge from '../../components-shared/ui/StatusBadge';
import DummyNotice from '../../components-shared/ui/DummyNotice';
import AdminModal from '../../components-shared/ui/AdminModal';
import { dummyLiveStreams } from '../../_data/dummy';
import type { AdminLiveStream, BroadcastCategory } from '@/app/_types/admin-console';

const categoryLabels: Record<BroadcastCategory, string> = {
  GAME: '게임',
  MUKBANG: '먹방',
  TALK_DAILY: '토크/일상',
  ADULT: '성인',
  MUSIC: '음악',
};

const formatDuration = (startTime: string): string => {
  const minutes = Math.floor((Date.now() - new Date(startTime).getTime()) / 60000);
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h > 0 ? `${h}시간 ${m}분` : `${m}분`;
};

export default function LiveMonitorTab() {
  const [selected, setSelected] = useState<AdminLiveStream | null>(null);
  const [confirmEnd, setConfirmEnd] = useState<AdminLiveStream | null>(null);

  // 방송 강제 종료 — 관리자 강제 종료 API(❌) 연동 지점 (NCP live-station 종료 이벤트 전파)
  const handleForceEnd = (): void => {
    console.info(`[방송 강제 종료] broadcaster=${confirmEnd?.broadcaster_id}`);
    setConfirmEnd(null);
    setSelected(null);
  };

  const columns: Column<AdminLiveStream>[] = [
    {
      key: 'broadcaster',
      header: '방송자',
      render: (s) => (
        <div>
          <div className="font-medium">{s.broadcaster_nickname}</div>
          <div className="text-xs text-muted-foreground font-mono">{s.broadcaster_id}</div>
        </div>
      ),
    },
    { key: 'title', header: '방송 제목', className: 'max-w-sm', render: (s) => <span className="line-clamp-1">{s.title}</span> },
    { key: 'category', header: '카테고리', render: (s) => categoryLabels[s.category] },
    { key: 'viewers', header: '시청자', render: (s) => <span className="font-semibold">{s.viewer_count.toLocaleString()}</span> },
    { key: 'duration', header: '방송 시간', render: (s) => formatDuration(s.start_time) },
    {
      key: 'flags',
      header: '속성',
      render: (s) => (
        <div className="flex gap-1">
          {s.is_adult && <StatusBadge label="성인" tone="red" />}
          {s.is_fan && <StatusBadge label="팬전용" tone="purple" />}
          {s.is_pw && <StatusBadge label="비밀번호" tone="gray" />}
          {!s.is_adult && !s.is_fan && !s.is_pw && <StatusBadge label="공개" tone="green" />}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <DummyNotice api="관리자 전체 라이브 조회 API (비공개 방송 포함)" />

      <DataTable
        columns={columns}
        rows={dummyLiveStreams}
        rowKey={(s) => s.broadcaster_idx}
        onRowClick={setSelected}
        emptyMessage="현재 진행 중인 라이브가 없습니다"
      />

      {/* 방송 상세 모달 */}
      <AdminModal
        open={selected !== null}
        title={`방송 상세 — ${selected?.broadcaster_nickname ?? ''}`}
        onClose={() => setSelected(null)}
        footer={
          <>
            <button
              disabled
              title="관리자 시청자 목록 API 연동 후 활성화됩니다"
              className="px-4 py-2 text-sm rounded-md border border-border text-muted-foreground opacity-60 cursor-not-allowed"
            >
              시청자 목록
            </button>
            <button
              onClick={() => setConfirmEnd(selected)}
              className="px-4 py-2 text-sm font-medium rounded-md bg-destructive text-destructive-foreground hover:opacity-90 transition-opacity"
            >
              방송 강제 종료
            </button>
          </>
        }
      >
        {selected && (
          <div className="space-y-4">
            {/* 방송 미리보기 — NCP LL-HLS playback_url 연동 지점 */}
            <div className="aspect-video rounded-md bg-muted flex items-center justify-center border border-border">
              <p className="text-sm text-muted-foreground">방송 미리보기 (NCP LL-HLS 플레이어 연동 지점)</p>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-muted-foreground">제목</div>
                <div className="font-medium text-foreground">{selected.title}</div>
              </div>
              <div>
                <div className="text-muted-foreground">카테고리</div>
                <div className="font-medium text-foreground">{categoryLabels[selected.category]}</div>
              </div>
              <div>
                <div className="text-muted-foreground">시청자 수</div>
                <div className="font-medium text-foreground">{selected.viewer_count.toLocaleString()}명</div>
              </div>
              <div>
                <div className="text-muted-foreground">방송 시작</div>
                <div className="font-medium text-foreground">{new Date(selected.start_time).toLocaleString('ko-KR')}</div>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              카테고리 강제 변경, 시청자 강제 퇴장(kick) 기능은 관리자 API 연동 후 제공됩니다.
            </p>
          </div>
        )}
      </AdminModal>

      {/* 강제 종료 확인 */}
      <AdminModal
        open={confirmEnd !== null}
        title="방송 강제 종료"
        onClose={() => setConfirmEnd(null)}
        maxWidthClass="max-w-md"
        footer={
          <>
            <button
              onClick={() => setConfirmEnd(null)}
              className="px-4 py-2 text-sm rounded-md border border-border text-muted-foreground hover:text-foreground"
            >
              취소
            </button>
            <button
              onClick={handleForceEnd}
              className="px-4 py-2 text-sm font-medium rounded-md bg-destructive text-destructive-foreground hover:opacity-90 transition-opacity"
            >
              강제 종료
            </button>
          </>
        }
      >
        <p className="text-sm text-foreground">
          <span className="font-semibold">{confirmEnd?.broadcaster_nickname}</span>님의 방송을 강제 종료하시겠습니까?
          <br />
          <span className="text-muted-foreground">시청자 전원에게 종료 이벤트가 전파됩니다.</span>
        </p>
      </AdminModal>
    </div>
  );
}
