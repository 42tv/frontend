'use client';

import { BjArticle } from "../../../_components/channel/tab-contents";
import { useUserStore } from "../../../_lib/stores";

export default function ArticlePage() {
  const { idx: userIdx, user_id: userId } = useUserStore();

  // 로그인하지 않은 경우 처리
  if (!userIdx || userIdx === 0 || !userId) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-text-secondary dark:text-text-secondary-dark">
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
