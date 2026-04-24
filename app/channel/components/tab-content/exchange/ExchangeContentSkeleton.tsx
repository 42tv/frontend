export default function ExchangeContentSkeleton() {
  return (
    <div className="space-y-6" aria-hidden="true">
      {/* 코인 현황 카드 */}
      <div className="p-6 rounded-lg bg-bg-secondary border border-border-primary">
        <div className="h-5 w-24 mb-4 animate-pulse rounded bg-bg-tertiary" />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="p-4 rounded-lg bg-bg-tertiary border-l-4 border-l-border-primary space-y-2">
              <div className="h-3 w-14 animate-pulse rounded bg-bg-secondary" />
              <div className="h-5 w-20 animate-pulse rounded bg-bg-secondary" />
            </div>
          ))}
        </div>
      </div>

      {/* 정산 요청 카드 */}
      <div className="p-6 rounded-lg bg-bg-secondary border border-border-primary">
        <div className="h-5 w-24 mb-4 animate-pulse rounded bg-bg-tertiary" />
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-2">
            <div className="h-3 w-32 animate-pulse rounded bg-bg-tertiary" />
            <div className="h-9 w-40 animate-pulse rounded bg-bg-tertiary" />
            <div className="h-3 w-48 animate-pulse rounded bg-bg-tertiary" />
          </div>
          <div className="h-11 w-36 animate-pulse rounded-lg bg-bg-tertiary" />
        </div>
      </div>

      {/* 정산 통계 카드 */}
      <div className="p-6 rounded-lg bg-bg-secondary border border-border-primary">
        <div className="h-5 w-24 mb-4 animate-pulse rounded bg-bg-tertiary" />
        <div className="grid grid-cols-3 gap-4 text-center">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-3 w-16 mx-auto animate-pulse rounded bg-bg-tertiary" />
              <div className="h-4 w-24 mx-auto animate-pulse rounded bg-bg-tertiary" />
              <div className="h-3 w-10 mx-auto animate-pulse rounded bg-bg-tertiary" />
            </div>
          ))}
        </div>
      </div>

      {/* 정산 내역 테이블 */}
      <div className="p-6 rounded-lg bg-bg-secondary border border-border-primary">
        <div className="h-5 w-24 mb-4 animate-pulse rounded bg-bg-tertiary" />
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border-primary">
                {['w-20', 'w-24', 'w-20', 'w-24', 'w-16'].map((w, i) => (
                  <th key={i} className="pb-3">
                    <div className={`h-3 ${w} mx-auto animate-pulse rounded bg-bg-tertiary`} />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border-primary">
              {Array.from({ length: 5 }).map((_, row) => (
                <tr key={row}>
                  <td className="py-3"><div className="h-4 w-20 animate-pulse rounded bg-bg-tertiary" /></td>
                  <td className="py-3 text-right"><div className="h-4 w-20 ml-auto animate-pulse rounded bg-bg-tertiary" /></td>
                  <td className="py-3 text-right"><div className="h-4 w-16 ml-auto animate-pulse rounded bg-bg-tertiary" /></td>
                  <td className="py-3 text-right"><div className="h-4 w-20 ml-auto animate-pulse rounded bg-bg-tertiary" /></td>
                  <td className="py-3 text-center"><div className="h-5 w-16 mx-auto animate-pulse rounded bg-bg-tertiary" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
