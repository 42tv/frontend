export default function ExchangeContentSkeleton() {
  return (
    <div className="space-y-5" aria-hidden="true">
      {/* 페이지 헤더 */}
      <div className="pb-4 border-b border-border-primary space-y-2">
        <div className="h-6 w-28 animate-pulse rounded bg-bg-tertiary" />
        <div className="h-3.5 w-64 animate-pulse rounded bg-bg-tertiary" />
      </div>

      {/* 정산 신청 */}
      <div className="rounded-xl bg-bg-secondary border border-border-primary p-6 space-y-5">
        <div className="flex items-center justify-between">
          <div className="h-4 w-20 animate-pulse rounded bg-bg-tertiary" />
          <div className="space-y-1 text-right">
            <div className="h-3 w-12 ml-auto animate-pulse rounded bg-bg-tertiary" />
            <div className="h-5 w-24 ml-auto animate-pulse rounded bg-bg-tertiary" />
          </div>
        </div>
        <div className="space-y-1.5">
          <div className="h-3 w-24 animate-pulse rounded bg-bg-tertiary" />
          <div className="h-11 w-full animate-pulse rounded-lg bg-bg-tertiary" />
          <div className="h-3 w-40 animate-pulse rounded bg-bg-tertiary" />
        </div>
        <div className="rounded-lg border border-border-primary divide-y divide-border-primary">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between px-4 py-3">
              <div className="h-3.5 w-20 animate-pulse rounded bg-bg-tertiary" />
              <div className="h-3.5 w-24 animate-pulse rounded bg-bg-tertiary" />
            </div>
          ))}
        </div>
        <div className="h-11 w-full animate-pulse rounded-lg bg-bg-tertiary" />
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
        <div className="flex items-center justify-between px-5 py-4 border-b border-border-primary">
          <div className="h-4 w-20 animate-pulse rounded bg-bg-tertiary" />
          <div className="h-3 w-12 animate-pulse rounded bg-bg-tertiary" />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr>
                {['w-20', 'w-24', 'w-16', 'w-24', 'w-16'].map((w, i) => (
                  <th key={i} className="px-5 py-3">
                    <div className={`h-3 ${w} mx-auto animate-pulse rounded bg-bg-tertiary`} />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 4 }).map((_, row) => (
                <tr key={row} className="border-t border-border-primary">
                  <td className="px-5 py-3.5"><div className="h-4 w-20 animate-pulse rounded bg-bg-tertiary" /></td>
                  <td className="px-5 py-3.5 text-right"><div className="h-4 w-20 ml-auto animate-pulse rounded bg-bg-tertiary" /></td>
                  <td className="px-5 py-3.5 text-right"><div className="h-4 w-16 ml-auto animate-pulse rounded bg-bg-tertiary" /></td>
                  <td className="px-5 py-3.5 text-right"><div className="h-4 w-20 ml-auto animate-pulse rounded bg-bg-tertiary" /></td>
                  <td className="px-5 py-3.5 text-center"><div className="h-5 w-16 mx-auto animate-pulse rounded-full bg-bg-tertiary" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
