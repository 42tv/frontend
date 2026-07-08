interface DummyNoticeProps {
  /** 어떤 백엔드 API가 필요한지 설명 (예: "관리자 회원 조회 API") */
  api: string;
}

/**
 * 백엔드 관리자 API가 아직 없는 화면에 표시하는 안내 배너.
 * 더미 데이터로 UI를 먼저 구성하고, API 연동 시 이 배너를 제거합니다.
 */
export default function DummyNotice({ api }: DummyNoticeProps) {
  return (
    <div className="flex items-center gap-3 px-4 py-3 rounded-lg border border-yellow-200 dark:border-yellow-800 bg-yellow-50/70 dark:bg-yellow-950/20">
      <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-yellow-200 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-300 text-xs font-bold shrink-0">
        더미 데이터
      </span>
      <p className="text-sm text-yellow-800 dark:text-yellow-300">
        {api} 연동 대기 중입니다. 현재 화면은 개발용 더미 데이터로 표시됩니다.
      </p>
    </div>
  );
}
