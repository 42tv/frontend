interface PostTabSkeletonProps {
  actionCount?: number;
  columnWidths: string[];
  showTopControls?: boolean;
  showBottomAction?: boolean;
  rows?: number;
}

export default function PostTabSkeleton({
  actionCount = 1,
  columnWidths,
  showTopControls = true,
  showBottomAction = true,
  rows = 8,
}: PostTabSkeletonProps) {
  return (
    <div className="mb-20" aria-hidden="true">
      {showTopControls && (
        <div className="my-5 flex flex-row justify-between px-6">
          <div className="flex space-x-2">
            {Array.from({ length: actionCount }).map((_, index) => (
              <div
                key={index}
                className="h-[40px] w-[95px] animate-pulse rounded-[8px] border border-border-primary bg-bg-secondary"
              />
            ))}
          </div>
          <div className="h-[40px] w-[200px] animate-pulse rounded-[8px] border border-border-primary bg-bg-secondary" />
        </div>
      )}

      <div className="p-4">
        <div className="mb-2 h-5 w-24 animate-pulse rounded bg-bg-secondary" />

        <table className="w-full border-b border-t border-t-2 border-tableBorder dark:border-tableBorder-dark">
          <thead>
            <tr className="border-b border-tableRowBorder text-center align-middle dark:border-tableRowBorder-dark">
              {columnWidths.map((width, index) => (
                <th key={index} className="p-2">
                  <div className={`mx-auto h-4 animate-pulse rounded bg-bg-secondary ${width}`} />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: rows }).map((_, rowIndex) => (
              <tr
                key={rowIndex}
                className="border-b border-tableRowBorder text-center align-middle dark:border-tableRowBorder-dark"
              >
                {columnWidths.map((width, columnIndex) => (
                  <td key={columnIndex} className="p-2">
                    <div
                      className={`mx-auto h-4 animate-pulse rounded bg-bg-secondary ${
                        columnIndex === 0 ? 'w-5' : width
                      }`}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-4 flex justify-center">
          <nav className="flex items-center space-x-2">
            <div className="h-8 w-14 animate-pulse rounded border border-border-primary bg-bg-secondary" />
            {Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className={`h-8 w-8 animate-pulse rounded border border-border-primary ${
                  index === 0 ? 'bg-accent/20' : 'bg-bg-secondary'
                }`}
              />
            ))}
            <div className="h-8 w-14 animate-pulse rounded border border-border-primary bg-bg-secondary" />
          </nav>
        </div>
      </div>

      {showBottomAction && (
        <div className="mt-5 flex w-full items-center justify-center">
          <div className="h-[40px] w-[120px] animate-pulse rounded-[15px] bg-accent/25" />
        </div>
      )}
    </div>
  );
}
