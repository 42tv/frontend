'use client';
import { useCallback, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useUserStore, useNotificationStore } from '@/app/_lib/stores';

/**
 * 미읽음 쪽지 갱신 이벤트.
 * 쪽지 읽음 처리 직후 라우트 변경 없이도 뱃지를 갱신할 때 사용한다.
 */
export const UNREAD_POSTS_REFRESH_EVENT = 'unread-posts-refresh';

export function notifyUnreadPostsRefresh(): void {
  window.dispatchEvent(new Event(UNREAD_POSTS_REFRESH_EVENT));
}

/**
 * 미읽음 쪽지 개수 훅.
 * notificationStore의 뱃지 요약을 구독하며, 라우트 변경 시 TTL 내 중복 호출 없이 재조회하고
 * 읽음 처리 이벤트 시에는 즉시 재조회해 프로필 아이콘/메뉴 뱃지가 최신 상태를 유지하도록 한다.
 */
export function useUnreadPosts(): { count: number; loading: boolean; refresh: () => void } {
  const is_guest = useUserStore((state) => state.is_guest);
  const pathname = usePathname();
  const count = useNotificationStore((state) => state.unread_posts);
  const loading = useNotificationStore((state) => state.loading);
  const storeRefresh = useNotificationStore((state) => state.refresh);
  const reset = useNotificationStore((state) => state.reset);

  const refresh = useCallback((): void => {
    if (is_guest) {
      reset();
      return;
    }
    void storeRefresh(true);
  }, [is_guest, storeRefresh, reset]);

  useEffect(() => {
    if (is_guest) {
      reset();
      return;
    }
    void storeRefresh();
  }, [is_guest, pathname, storeRefresh, reset]);

  useEffect(() => {
    window.addEventListener(UNREAD_POSTS_REFRESH_EVENT, refresh);
    return () => window.removeEventListener(UNREAD_POSTS_REFRESH_EVENT, refresh);
  }, [refresh]);

  return { count, loading, refresh };
}
