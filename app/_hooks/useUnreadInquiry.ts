'use client';
import { useCallback, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useUserStore } from '@/app/_lib/stores';
import { getUnreadInquiryCount } from '@/app/_apis/inquiry';

/**
 * 미읽음 문의 답변 개수 훅.
 * 로그인 상태에서만 조회하며, 라우트 변경 시 재조회해
 * 상세 페이지 진입(=읽음 처리) 후 뱃지가 갱신되도록 한다.
 */
export function useUnreadInquiry(): { count: number; refresh: () => void } {
  const is_guest = useUserStore((state) => state.is_guest);
  const pathname = usePathname();
  const [count, setCount] = useState<number>(0);

  const refresh = useCallback((): void => {
    if (is_guest) {
      setCount(0);
      return;
    }
    getUnreadInquiryCount()
      .then(setCount)
      .catch(() => setCount(0));
  }, [is_guest]);

  useEffect(() => {
    refresh();
  }, [refresh, pathname]);

  return { count, refresh };
}
