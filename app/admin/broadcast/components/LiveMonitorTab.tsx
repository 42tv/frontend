'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import AdminModal from '../../components-shared/ui/AdminModal';
import AdminLiveCard from './AdminLiveCard';
import AdminLivePreview from './AdminLivePreview';
import {
  getAdminLiveList,
  forceEndBroadcast,
  sendLiveNotice,
  startCurtain,
  stopCurtain,
} from '@/app/_apis/admin/live';
import { extractAdminApiError } from '@/app/_apis/admin/user';
import type { AdminLiveStream, BroadcastCategory } from '@/app/_types/admin-console';

// NCP 썸네일 원본이 약 10초 주기로 교체되므로 목록·썸네일 모두 10초 주기로 갱신
const POLL_INTERVAL_S = 10;

const categoryLabels: Record<BroadcastCategory, string> = {
  GAME: '게임',
  MUKBANG: '먹방',
  TALK_DAILY: '토크/일상',
  ADULT: '성인',
  MUSIC: '음악',
};

// 다음 갱신까지 남은 시간을 원형 링 + 숫자로 표시
function RefreshCountdown({ secondsLeft, total }: { secondsLeft: number; total: number }) {
  const RADIUS = 8;
  const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
  return (
    <div
      className="relative h-7 w-7"
      title={`${secondsLeft}초 후 자동 갱신`}
      aria-label={`${secondsLeft}초 후 자동 갱신`}
    >
      <svg viewBox="0 0 20 20" className="h-full w-full -rotate-90">
        <circle cx="10" cy="10" r={RADIUS} fill="none" strokeWidth="2" className="stroke-border" />
        <circle
          cx="10"
          cy="10"
          r={RADIUS}
          fill="none"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={CIRCUMFERENCE * (1 - secondsLeft / total)}
          className="stroke-primary transition-[stroke-dashoffset] duration-1000 ease-linear"
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-[10px] font-semibold tabular-nums text-foreground">
        {secondsLeft}
      </span>
    </div>
  );
}

type CurtainAction = 'start' | 'stop';
interface ActionResult {
  ok: boolean;
  text: string;
}

export default function LiveMonitorTab() {
  const [streams, setStreams] = useState<AdminLiveStream[]>([]);
  const [refreshTick, setRefreshTick] = useState<number>(Date.now());
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [selected, setSelected] = useState<AdminLiveStream | null>(null);
  const [confirmEnd, setConfirmEnd] = useState<AdminLiveStream | null>(null);
  const [ending, setEnding] = useState<boolean>(false);
  const [curtainLoading, setCurtainLoading] = useState<CurtainAction | null>(null);
  const [noticeText, setNoticeText] = useState<string>('');
  const [noticeSending, setNoticeSending] = useState<boolean>(false);
  const [actionResult, setActionResult] = useState<ActionResult | null>(null);
  const [secondsLeft, setSecondsLeft] = useState<number>(POLL_INTERVAL_S);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const fetchingRef = useRef<boolean>(false);

  const fetchLives = useCallback(async (): Promise<void> => {
    if (fetchingRef.current) return; // in-flight 가드
    fetchingRef.current = true;
    setRefreshing(true);
    try {
      setStreams(await getAdminLiveList());
      setRefreshTick(Date.now());
      setError('');
    } catch (e) {
      // 첫 로드 실패만 표시하고 폴링 실패는 다음 주기에 재시도
      setError((prev) => prev || extractAdminApiError(e, '라이브 목록 조회 중 오류가 발생했습니다.'));
    } finally {
      fetchingRef.current = false;
      setRefreshing(false);
      setLoading(false);
    }
  }, []);

  // 목록 + 썸네일 갱신 후 카운트다운 리셋 — 수동 새로고침·폴링 공용
  const refresh = useCallback(async (): Promise<void> => {
    await fetchLives();
    setSecondsLeft(POLL_INTERVAL_S);
  }, [fetchLives]);

  // 첫 로드
  useEffect(() => {
    fetchLives();
  }, [fetchLives]);

  // 1초 단위 카운트다운 — 탭 백그라운드 시 일시 정지
  useEffect(() => {
    const timer = setInterval(() => {
      if (document.visibilityState !== 'visible') return;
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : prev));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // 카운트다운이 0에 도달하면 갱신
  useEffect(() => {
    if (secondsLeft === 0) refresh();
  }, [secondsLeft, refresh]);

  const openDetail = (stream: AdminLiveStream): void => {
    setSelected(stream);
    setNoticeText('');
    setActionResult(null);
  };

  const handleForceEnd = async (): Promise<void> => {
    if (!confirmEnd || ending) return;
    setEnding(true);
    try {
      await forceEndBroadcast(confirmEnd.broadcaster_idx);
      setConfirmEnd(null);
      setSelected(null);
      await refresh();
    } catch (e) {
      setError(extractAdminApiError(e, '방송 강제 종료 중 오류가 발생했습니다.'));
      setConfirmEnd(null);
    } finally {
      setEnding(false);
    }
  };

  const handleCurtain = async (action: CurtainAction): Promise<void> => {
    if (!selected || curtainLoading) return;
    setCurtainLoading(action);
    setActionResult(null);
    try {
      if (action === 'start') {
        await startCurtain(selected.broadcaster_idx);
        setActionResult({ ok: true, text: '블라인드를 시작했습니다 (최대 10분 유지 후 자동 해제).' });
      } else {
        await stopCurtain(selected.broadcaster_idx);
        setActionResult({ ok: true, text: '블라인드를 해제했습니다.' });
      }
    } catch (e) {
      setActionResult({
        ok: false,
        text: extractAdminApiError(e, '블라인드 처리 중 오류가 발생했습니다.'),
      });
    } finally {
      setCurtainLoading(null);
    }
  };

  const handleSendNotice = async (): Promise<void> => {
    const message = noticeText.trim();
    if (!selected || !message || noticeSending) return;
    setNoticeSending(true);
    setActionResult(null);
    try {
      await sendLiveNotice(selected.broadcaster_idx, message);
      setNoticeText('');
      setActionResult({ ok: true, text: '이 방송의 채팅방에 관리자 공지를 전송했습니다.' });
    } catch (e) {
      setActionResult({
        ok: false,
        text: extractAdminApiError(e, '관리자 공지 전송 중 오류가 발생했습니다.'),
      });
    } finally {
      setNoticeSending(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          비공개 방송 포함 전체 라이브 · 목록·썸네일 {POLL_INTERVAL_S}초 간격 갱신
        </p>
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-foreground">
            진행 중 {streams.length}개
          </span>
          <RefreshCountdown secondsLeft={secondsLeft} total={POLL_INTERVAL_S} />
          <button
            onClick={refresh}
            disabled={refreshing}
            title="지금 갱신"
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-md border border-border text-foreground disabled:opacity-50 hover:bg-muted transition-colors"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`}
            >
              <path d="M21 12a9 9 0 1 1-2.64-6.36" />
              <path d="M21 3v6h-6" />
            </svg>
            새로고침
          </button>
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 rounded-md px-4 py-3">
          {error}
        </p>
      )}

      {loading ? (
        <div className="py-16 flex justify-center bg-card border border-border rounded-lg">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" />
        </div>
      ) : streams.length === 0 ? (
        <div className="py-16 text-center text-sm text-muted-foreground bg-card border border-border rounded-lg">
          현재 진행 중인 라이브가 없습니다
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
          {streams.map((stream) => (
            <AdminLiveCard
              key={stream.broadcaster_idx}
              stream={stream}
              refreshTick={refreshTick}
              onClick={openDetail}
            />
          ))}
        </div>
      )}

      {/* 방송 상세 모달 */}
      <AdminModal
        open={selected !== null}
        title={`방송 상세 — ${selected?.broadcaster.nickname ?? ''}`}
        onClose={() => setSelected(null)}
        maxWidthClass="max-w-3xl"
        footer={
          <>
            <button
              onClick={() => handleCurtain('start')}
              disabled={curtainLoading !== null}
              className="px-4 py-2 text-sm font-medium rounded-md border border-border text-foreground disabled:opacity-50 hover:bg-muted transition-colors"
            >
              {curtainLoading === 'start' ? '블라인드 처리 중...' : '블라인드'}
            </button>
            <button
              onClick={() => handleCurtain('stop')}
              disabled={curtainLoading !== null}
              className="px-4 py-2 text-sm font-medium rounded-md border border-border text-muted-foreground disabled:opacity-50 hover:text-foreground transition-colors"
            >
              {curtainLoading === 'stop' ? '해제 중...' : '블라인드 해제'}
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
            {/* 실시간 미리보기 — 선택한 방송 1개만 LL-HLS 재생 */}
            {selected.broadcaster.ncpChannel?.playback_url ? (
              <AdminLivePreview
                playbackUrl={selected.broadcaster.ncpChannel.playback_url}
                title={selected.broadcaster.broadcastSetting.title || '라이브'}
              />
            ) : (
              <div className="aspect-video rounded-md bg-muted flex items-center justify-center border border-border">
                <p className="text-sm text-muted-foreground">재생 URL이 없어 미리보기를 제공할 수 없습니다</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-muted-foreground">제목</div>
                <div className="font-medium text-foreground">
                  {selected.broadcaster.broadcastSetting.title || '(제목 없음)'}
                </div>
              </div>
              <div>
                <div className="text-muted-foreground">카테고리</div>
                <div className="font-medium text-foreground">
                  {categoryLabels[selected.broadcaster.broadcastSetting.category]}
                </div>
              </div>
              <div>
                <div className="text-muted-foreground">시청자 수</div>
                <div className="font-medium text-foreground">{selected.viewerCount.toLocaleString()}명</div>
              </div>
              <div>
                <div className="text-muted-foreground">방송 시작</div>
                <div className="font-medium text-foreground">
                  {new Date(selected.start_time).toLocaleString('ko-KR')}
                </div>
              </div>
            </div>

            {/* 방송별 관리자 공지 */}
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">관리자 공지 (이 방송에만 전송)</div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={noticeText}
                  onChange={(e) => setNoticeText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendNotice()}
                  maxLength={500}
                  placeholder="공지 메시지 입력"
                  className="flex-1 px-3 py-2 text-sm rounded-md border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <button
                  onClick={handleSendNotice}
                  disabled={!noticeText.trim() || noticeSending}
                  className="px-4 py-2 text-sm font-medium rounded-md bg-primary text-primary-foreground disabled:opacity-50 hover:opacity-90 transition-opacity"
                >
                  {noticeSending ? '전송 중...' : '전송'}
                </button>
              </div>
            </div>

            {actionResult && (
              <p className={`text-sm ${actionResult.ok ? 'text-green-600' : 'text-red-500'}`}>
                {actionResult.text}
              </p>
            )}
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
              disabled={ending}
              className="px-4 py-2 text-sm font-medium rounded-md bg-destructive text-destructive-foreground disabled:opacity-50 hover:opacity-90 transition-opacity"
            >
              {ending ? '종료 중...' : '강제 종료'}
            </button>
          </>
        }
      >
        <p className="text-sm text-foreground">
          <span className="font-semibold">{confirmEnd?.broadcaster.nickname}</span>님의 방송을 강제 종료하시겠습니까?
          <br />
          <span className="text-muted-foreground">시청자 전원에게 종료 이벤트가 전파됩니다.</span>
        </p>
      </AdminModal>
    </div>
  );
}
