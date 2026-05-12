export default function ExchangeContentSkeleton() {
  return (
    <div className="max-w-3xl mx-auto space-y-5" aria-hidden="true">
      {/* 페이지 헤더 */}
      <div className="pb-4 border-b border-border-primary flex items-start justify-between">
        <div className="space-y-2">
          <div className="h-6 w-28 animate-pulse rounded bg-bg-tertiary" />
          <div className="h-3.5 w-64 animate-pulse rounded bg-bg-tertiary" />
        </div>
        <div className="h-8 w-8 animate-pulse rounded-lg bg-bg-tertiary" />
      </div>

      {/* 정산 신청 카드 */}
      <div className="rounded-xl bg-bg-secondary border border-border-primary overflow-hidden">
        {/* 정산 가능 금액 */}
        <div className="px-6 pt-6 pb-5 border-b border-border-primary space-y-2">
          <div className="h-3 w-24 animate-pulse rounded bg-bg-tertiary" />
          <div className="h-10 w-40 animate-pulse rounded bg-bg-tertiary" />
          <div className="h-3 w-48 animate-pulse rounded bg-bg-tertiary" />
        </div>
        {/* 입력 섹션 */}
        <div className="px-6 py-5 space-y-5">
          <div className="h-4 w-20 animate-pulse rounded bg-bg-tertiary" />
          <div className="space-y-1.5">
            <div className="h-3 w-16 animate-pulse rounded bg-bg-tertiary" />
            <div className="h-11 w-full animate-pulse rounded-lg bg-bg-tertiary" />
            <div className="h-3 w-36 animate-pulse rounded bg-bg-tertiary" />
          </div>
          <div className="rounded-lg border border-border-primary divide-y divide-border-primary">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between px-4 py-3">
                <div className="h-3.5 w-20 animate-pulse rounded bg-bg-tertiary" />
                <div className="h-3.5 w-24 animate-pulse rounded bg-bg-tertiary" />
              </div>
            ))}
          </div>
        </div>
        <div className="px-6 pb-5">
          <div className="h-11 w-full animate-pulse rounded-lg bg-bg-tertiary" />
        </div>
      </div>

      {/* 코인 상태 요약 */}
      <div className="rounded-xl bg-bg-secondary border border-border-primary grid grid-cols-2 sm:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="px-4 py-3.5 space-y-2">
            <div className="h-3 w-16 animate-pulse rounded bg-bg-tertiary" />
            <div className="h-5 w-24 animate-pulse rounded bg-bg-tertiary" />
          </div>
        ))}
      </div>

      {/* 통계 */}
      <div className="rounded-xl bg-bg-secondary border border-border-primary p-5 space-y-4">
        <div className="h-4 w-20 animate-pulse rounded bg-bg-tertiary" />
        <div className="grid grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="p-3 rounded-lg bg-bg-tertiary space-y-2 text-center">
              <div className="h-3 w-14 mx-auto animate-pulse rounded bg-bg-secondary" />
              <div className="h-4 w-20 mx-auto animate-pulse rounded bg-bg-secondary" />
              <div className="h-3 w-8 mx-auto animate-pulse rounded bg-bg-secondary" />
            </div>
          ))}
        </div>
      </div>

      {/* 정산 내역 */}
      <div className="rounded-xl bg-bg-secondary border border-border-primary">
        <div className="px-5 pt-4 pb-0 border-b border-border-primary space-y-3">
          <div className="h-4 w-20 animate-pulse rounded bg-bg-tertiary" />
          <div className="flex gap-1 pb-px">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-7 w-14 animate-pulse rounded bg-bg-tertiary" />
            ))}
          </div>
        </div>
        <ul className="divide-y divide-border-primary">
          {Array.from({ length: 4 }).map((_, i) => (
            <li key={i} className="px-5 py-4 flex items-center justify-between gap-3">
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <div className="h-5 w-16 animate-pulse rounded-full bg-bg-tertiary" />
                  <div className="h-3 w-20 animate-pulse rounded bg-bg-tertiary" />
                </div>
                <div className="h-3 w-40 animate-pulse rounded bg-bg-tertiary" />
              </div>
              <div className="text-right space-y-1.5">
                <div className="h-4 w-24 ml-auto animate-pulse rounded bg-bg-tertiary" />
                <div className="h-3 w-16 ml-auto animate-pulse rounded bg-bg-tertiary" />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
