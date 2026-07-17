'use client';
import { useEffect } from 'react';
import { useUserStore } from '@/app/_lib/stores';

/**
 * 앱 진입 시 로그인 상태를 1회 하이드레이션하는 전역 초기화 컴포넌트.
 * Toolbar 유무(admin 라우트 포함)와 무관하게 모든 라우트에서 userStore가 채워지도록 한다.
 * fetchUser는 in-flight 요청을 공유하므로 다른 곳(AdminGuard 등)의 호출과 중복 요청이 발생하지 않는다.
 */
export default function AuthInitializer(): null {
  const fetchUser = useUserStore((state) => state.fetchUser);

  useEffect(() => {
    void fetchUser();
  }, [fetchUser]);

  return null;
}
