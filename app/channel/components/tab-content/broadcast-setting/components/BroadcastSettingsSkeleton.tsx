export default function BroadcastSettingsSkeleton() {
  return (
    <div
      className="p-6 rounded-lg relative bg-background border border-border-primary"
      aria-hidden="true"
    >
      <div className="flex flex-col w-full p-4 max-w-3xl space-y-6">
        {/* 제목 */}
        <div className="h-7 w-24 animate-pulse rounded bg-bg-secondary" />

        {/* 스트림 키 */}
        <div className="space-y-2">
          <div className="h-4 w-24 animate-pulse rounded bg-bg-secondary" />
          <div className="flex gap-2">
            <div className="flex-1 h-10 animate-pulse rounded bg-bg-secondary" />
            <div className="h-10 w-20 animate-pulse rounded bg-bg-secondary" />
            <div className="h-10 w-20 animate-pulse rounded bg-bg-secondary" />
          </div>
        </div>

        {/* 서버 URL */}
        <div className="space-y-2">
          <div className="h-4 w-20 animate-pulse rounded bg-bg-secondary" />
          <div className="flex gap-2">
            <div className="flex-1 h-10 animate-pulse rounded bg-bg-secondary" />
            <div className="h-10 w-20 animate-pulse rounded bg-bg-secondary" />
          </div>
        </div>

        {/* 방송 제목 */}
        <div className="space-y-2">
          <div className="h-4 w-20 animate-pulse rounded bg-bg-secondary" />
          <div className="h-10 w-full animate-pulse rounded bg-bg-secondary" />
        </div>

        {/* 성인 방송 / 팬클럽 / 비밀번호 토글 행 */}
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex items-center justify-between">
            <div className="h-4 w-28 animate-pulse rounded bg-bg-secondary" />
            <div className="h-6 w-11 animate-pulse rounded-full bg-bg-secondary" />
          </div>
        ))}

        {/* 저장 버튼 */}
        <div className="h-10 w-24 animate-pulse rounded-lg bg-bg-secondary" />
      </div>
    </div>
  );
}
