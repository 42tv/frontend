import useUserStore from '@/app/_lib/stores/userStore';

/**
 * 로그인 상태가 확정된 userStore 스냅샷을 반환한다.
 * 새로고침 직후처럼 하이드레이션이 끝나기 전에 클릭이 발생하면,
 * 초기값(게스트)으로 오판하지 않도록 fetchUser 완료를 기다린 뒤 판단한다.
 * (fetchUser는 in-flight 요청을 공유하므로 추가 네트워크 요청이 발생하지 않는다)
 */
export async function ensureAuthHydrated(): Promise<ReturnType<typeof useUserStore.getState>> {
  const { hydrated, fetchUser } = useUserStore.getState();
  if (!hydrated) {
    await fetchUser();
  }
  return useUserStore.getState();
}
