'use client';

import { BjArticle } from "@/app/channel/components/tab-contents";
import { useUserStore } from "../../../_lib/stores";

export default function ArticlePage() {
  const { idx: userIdx, user_id: userId, hydrated } = useUserStore();

  // 로그인 상태 확정 전에는 "로그인이 필요합니다"를 단정 렌더하지 않음 (플래시 방지)
  if (!hydrated) {
    return (
      <div className="flex items-center justify-center py-12" aria-hidden="true">
        <div className="h-6 w-40 animate-pulse rounded bg-bg-secondary" />
      </div>
    );
  }

  // 로그인하지 않은 경우 처리
  if (!userIdx || userIdx === 0 || !userId) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-text-secondary">
          로그인이 필요합니다.
        </div>
      </div>
    );
  }

  return (
    <BjArticle 
      userId={userId} 
      showActions={true}
      showCreateButton={true}
    />
  );
}
