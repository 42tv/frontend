import { create } from 'zustand';
import { getNotificationSummary } from '@/app/_apis/notification';

/** TTL 내 재조회 요청은 무시한다 (라우트 변경마다 중복 호출 방지) */
const CACHE_TTL_MS = 30_000;

interface NotificationState {
  unread_posts: number;
  unread_inquiries: number;
  /** 첫 조회(또는 게스트 판정)가 끝나기 전까지 true — 스켈레톤 표시용 */
  loading: boolean;

  /**
   * 개인 뱃지 요약 재조회.
   * force가 아니면 TTL 내 호출은 건너뛰고, 진행 중인 요청이 있으면 그 결과를 공유한다.
   */
  refresh: (force?: boolean) => Promise<void>;
  /** 게스트 전환/로그아웃 시 카운트 초기화 */
  reset: () => void;
}

let lastFetchedAt = 0;
let inflight: Promise<void> | null = null;

const useNotificationStore = create<NotificationState>((set) => ({
  unread_posts: 0,
  unread_inquiries: 0,
  loading: true,

  refresh: async (force = false): Promise<void> => {
    if (!force && Date.now() - lastFetchedAt < CACHE_TTL_MS) {
      return;
    }
    if (inflight) {
      return inflight;
    }
    inflight = getNotificationSummary()
      .then((summary) => {
        lastFetchedAt = Date.now();
        set({
          unread_posts: summary.unread_posts,
          unread_inquiries: summary.unread_inquiries,
          loading: false,
        });
      })
      .catch(() => {
        set({
          unread_posts: 0,
          unread_inquiries: 0,
          loading: false,
        });
      })
      .finally(() => {
        inflight = null;
      });
    return inflight;
  },

  reset: (): void => {
    lastFetchedAt = 0;
    set({
      unread_posts: 0,
      unread_inquiries: 0,
      loading: false,
    });
  },
}));

export default useNotificationStore;
