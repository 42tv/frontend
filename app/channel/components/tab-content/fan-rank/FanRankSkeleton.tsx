export default function FanRankSkeleton() {
  return (
    <div
      className="max-w-3xl mx-auto p-6 bg-background border border-border-primary rounded-lg"
      aria-hidden="true"
    >
      {/* 헤더 */}
      <div className="h-6 w-32 mb-6 animate-pulse rounded bg-bg-secondary" />

      {/* 팬 등급 행 */}
      <div className="space-y-3 mb-6">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="p-4 rounded-lg flex items-center gap-4 border border-border-primary max-w-4xl"
          >
            {/* 순번 */}
            <div className="w-12 flex-shrink-0 flex justify-center">
              <div className="h-6 w-4 animate-pulse rounded bg-bg-secondary" />
            </div>
            {/* 색상 원 */}
            <div className="w-12 h-12 rounded-full flex-shrink-0 animate-pulse bg-bg-secondary" />
            {/* 등급명 */}
            <div className="flex-1 h-4 animate-pulse rounded bg-bg-secondary" />
            {/* 최소 후원금액 입력 */}
            <div className="w-24 h-8 flex-shrink-0 animate-pulse rounded bg-bg-secondary" />
          </div>
        ))}
      </div>

      {/* 일괄 업데이트 버튼 */}
      <div className="h-10 w-32 animate-pulse rounded-lg bg-bg-secondary" />
    </div>
  );
}
